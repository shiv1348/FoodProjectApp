// Schema

const mongoose = require("mongoose")

const validator = require("validator")

const bcrypt = require("bcryptjs")

const jwt = require("jsonwebtoken")

const crypto = require("crypto")
const { stringify } = require("querystring")

// step 2 create schema

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter your name"],
        maxLength: [30, "Name cannot exceed 30 characters"],
    },
    email: {
        type: String,
        required: [true, "Please enter emailid"],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, "Please enter a valid email"]
    },
    password: {
        type: String,
        required: [true, "Please enter password"],
        minLength: [8, "Password must be at least 8 characters"],
        select: false
    },
    passwordConfirm: {
  type: String,
  required: [true, "Please confirm your password"],
  validate: {
    validator: function(el) {
      return el === this.password
    },
    message: "Password does not match"
  }
},
    phonenumber: {
        type: String,
        required:true,
        match: [/^[0-9]{10}$/, "Please enter a valid 10-digit phone number"]
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },
    avatar: {
        public_id: String,
        url: String,
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
}, {timestamps: true
    });


// hash password
//pre ("save") => run before data is saved

userSchema.pre("save", async function() {
    if(!this.isModified("password")) return;

this.password = await bcrypt.hash(this.password, 12)
this.passwordConfirm = undefined
})

//pass compare
userSchema.methods.comparePassword = async function(
    candidatePassword, userPassword
){
    return await bcrypt.compare(candidatePassword, userPassword)

}

//check whether the user's password was changes after getting jwt token
//if yes, the old token is invalid and user must login in again
userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
    if(this.passwordChangedAt) {
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10)
        return JWTTimestamp < changedTimestamp
    }
    return false;
}


//custom method to generate jwt token
userSchema.methods.getJwtToken = function() {
    return jwt.sign({id: this._id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES || "90d"}
    )
}

module.exports = mongoose.model("User", userSchema)
