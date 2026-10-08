//import req packages, files

const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/user")
const ErrorHandler = require("../utils/errorHandler")
const catchAsyncErrors = require("../middlewares/catchAsyncErrors")
const sendToken = require("../utils/sendToken");
const Email = require("../utils/email");
const cloudinary = require("cloudinary").v2;
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

//signup
exports.signup = catchAsyncErrors(async (req, res, next) => {
    let { name, email, password, passwordConfirm, phonenumber, phoneNumber } = req.body;
    phonenumber = phonenumber || phoneNumber;
    if (!passwordConfirm) passwordConfirm = password;

    let avatar = {
        public_id: "default",
        url: "/images/images.png"
    };

    if (req.body.avatar && typeof req.body.avatar === "string" && req.body.avatar.startsWith("data:image")) {
        try {
            const result = await cloudinary.uploader.upload(req.body.avatar, {
                folder: "avatars",
                width: 150,
                crop: "scale"
            });
            avatar = {
                public_id: result.public_id,
                url: result.secure_url
            };
        } catch (uploadErr) {
            console.error("Cloudinary upload failed, using default avatar:", uploadErr.message);
        }
    }

    const user = await User.create({
        name,
        email,
        password,
        passwordConfirm,
        phonenumber,
        avatar
    });

    sendToken(user, 201, res);
});

//login
exports.login = catchAsyncErrors(async(req,res,next) => {

    const {email,password} = req.body;
    if(!email || !password){
        return next(new ErrorHandler("Please provide email and password", 400) )
    }

    const user = await User.findOne({email}).select("+password")
    if(!user){
        return next(new ErrorHandler("Invalid email or password", 401))
    }

    const isPasswordMatched = await user.comparePassword(password, user.password)
    if(!isPasswordMatched){
        return next(new ErrorHandler("Invalid email or password", 401))
    }
    
    sendToken(user, 200, res)
})

// Send a one-time password reset link by email.
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
    const { email } = req.body;
    if (!email) {
        return next(new ErrorHandler("Please provide your email address", 400));
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    const message = "If an account exists for that email, a password reset link has been sent.";
    if (!user) {
        return res.status(200).json({ success: true, message });
    }

    const frontendUrl = process.env.FRONTEND_URL;
    if (!frontendUrl) {
        return next(new ErrorHandler("Password reset is not configured on the server", 500));
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    await user.save({ validateBeforeSave: false });

    try {
        const resetUrl = `${frontendUrl.replace(/\/+$/, "")}/users/password/reset/${resetToken}`;
        await new Email(user, resetUrl).sendPasswordReset();
    } catch (error) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({ validateBeforeSave: false });
        return next(error);
    }

    return res.status(200).json({ success: true, message });
});

// Reset the password only when the emailed token is valid and unexpired.
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
    const { password, passwordConfirm } = req.body;
    if (!password || !passwordConfirm) {
        return next(new ErrorHandler("Please provide and confirm your new password", 400));
    }
    if (password !== passwordConfirm) {
        return next(new ErrorHandler("Passwords do not match", 400));
    }

    const hashedToken = crypto.createHash("sha256").update(req.params.token).digest("hex");
    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() },
    });
    if (!user) {
        return next(new ErrorHandler("Password reset link is invalid or has expired", 400));
    }

    user.password = password;
    user.passwordConfirm = passwordConfirm;
    user.passwordChangedAt = new Date(Date.now() - 1000);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    return res.status(200).json({
        success: true,
        message: "Password updated successfully. Please log in with your new password.",
    });
});

// protect middleware
exports.protect = catchAsyncErrors(async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies && req.cookies.jwt) {
        token = req.cookies.jwt;
    } else if (req.headers.cookie) {
        const raw = req.headers.cookie.split(";").map(c => c.trim()).find(c => c.startsWith("jwt="));
        if (raw) token = raw.split("=")[1];
    }

    if (!token) {
        return next(new ErrorHandler("Login first to access this resource", 401));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const currentUser = await User.findById(decoded.id);
        if (!currentUser) {
            return next(new ErrorHandler("The user belonging to this token no longer exists", 401));
        }

        if (currentUser.changedPasswordAfter && currentUser.changedPasswordAfter(decoded.iat)) {
            return next(new ErrorHandler("User recently changed password! Please log in again.", 401));
        }

        req.user = currentUser;
        next();
    } catch (err) {
        console.error("Protect middleware error:", err.message);
        return next(new ErrorHandler("Authentication token is invalid or expired. Please login again.", 401));
    }
});

// logout
exports.logout = catchAsyncErrors(async (req, res, next) => {
    res.cookie("jwt", "none", {
        expires: new Date(Date.now() + 5 * 1000),
        httpOnly: true,
    });

    res.status(200).json({
        success: true,
        message: "Logged out successfully",
    });
});

// get currently logged in user details
exports.getUserProfile = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        user,
    });
});

// update user profile
exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
    const newUserData = {};
    if (req.body.name) newUserData.name = req.body.name;
    if (req.body.email) newUserData.email = req.body.email;
    if (req.body.phonenumber) newUserData.phonenumber = req.body.phonenumber;

    if (req.body.avatar && req.body.avatar.startsWith("data:image")) {
        try {
            const result = await cloudinary.uploader.upload(req.body.avatar, {
                folder: "avatars",
                width: 150,
                crop: "scale",
            });

            newUserData.avatar = {
                public_id: result.public_id,
                url: result.secure_url,
            };
        } catch (uploadErr) {
            console.error("Cloudinary upload error:", uploadErr.message);
        }
    }

    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: false,
    });

    res.status(200).json({
        success: true,
        user,
    });
});