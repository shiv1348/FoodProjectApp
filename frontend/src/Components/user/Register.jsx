import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { register, clearErrors } from "../../redux/actions/userActions";
import Loader from "../layout/Loader";
import { toast } from "react-toastify";

const Register = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    passwordConfirm: "",
    phonenumber: "",
  });

  const { name, email, password, passwordConfirm, phonenumber } = user;

  const [avatar, setAvatar] = useState("");
  const [avatarPreview, setAvatarPreview] = useState("/images/images.png");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuthenticated, error, loading } = useSelector(
    (state) => state.auth || {}
  );

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }

    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
  }, [dispatch, isAuthenticated, error, navigate]);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (password !== passwordConfirm) {
      toast.error("Passwords do not match!");
      return;
    }

    if (!/^[0-9]{10}$/.test(phonenumber)) {
      toast.error("Please enter a valid 10-digit phone number!");
      return;
    }

    const userData = {
      name,
      email,
      password,
      passwordConfirm,
      phonenumber,
      avatar,
    };

    const result = await dispatch(register(userData));
    if (result.success) {
      toast.success("Account created successfully!");
    }
  };

  const onChange = (e) => {
    if (e.target.name === "avatar") {
      const reader = new FileReader();

      reader.onload = () => {
        if (reader.readyState === 2) {
          setAvatarPreview(reader.result);
          setAvatar(reader.result);
        }
      };

      if (e.target.files[0]) {
        reader.readAsDataURL(e.target.files[0]);
      }
    } else {
      setUser({ ...user, [e.target.name]: e.target.value });
    }
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="row wrapper">
          <div className="col-10 col-lg-5">
            <form
              className="shadow-lg bg-white rounded p-4"
              onSubmit={submitHandler}
              encType="multipart/form-data"
            >
              <h1 className="mb-4 font-weight-bold text-center">Register</h1>

              <div className="form-group mb-3">
                <label htmlFor="name_field">Name</label>
                <input
                  type="text"
                  id="name_field"
                  className="form-control"
                  name="name"
                  value={name}
                  onChange={onChange}
                  required
                  placeholder="Enter full name"
                />
              </div>

              <div className="form-group mb-3">
                <label htmlFor="email_field">Email</label>
                <input
                  type="email"
                  id="email_field"
                  className="form-control"
                  name="email"
                  value={email}
                  onChange={onChange}
                  required
                  placeholder="Enter email address"
                />
              </div>

              <div className="form-group mb-3">
                <label htmlFor="password_field">Password</label>
                <input
                  type="password"
                  id="password_field"
                  className="form-control"
                  name="password"
                  value={password}
                  onChange={onChange}
                  required
                  placeholder="Min 8 characters"
                />
              </div>

              <div className="form-group mb-3">
                <label htmlFor="password_confirm_field">Confirm Password</label>
                <input
                  type="password"
                  id="password_confirm_field"
                  className="form-control"
                  name="passwordConfirm"
                  value={passwordConfirm}
                  onChange={onChange}
                  required
                  placeholder="Re-enter password"
                />
              </div>

              <div className="form-group mb-3">
                <label htmlFor="phone_field">Phone Number</label>
                <input
                  type="text"
                  id="phone_field"
                  className="form-control"
                  name="phonenumber"
                  value={phonenumber}
                  onChange={onChange}
                  required
                  placeholder="10-digit number"
                />
              </div>

              <div className="form-group mb-4">
                <label htmlFor="avatar_upload">Avatar</label>
                <div className="d-flex align-items-center">
                  <div>
                    <figure className="avatar mr-3 item-rtl">
                      <img
                        src={avatarPreview}
                        className="rounded-circle"
                        alt="Avatar Preview"
                        height="48"
                        width="48"
                        style={{ objectFit: "cover" }}
                      />
                    </figure>
                  </div>
                  <div className="custom-file ml-2">
                    <input
                      type="file"
                      name="avatar"
                      className="form-control"
                      id="customFile"
                      accept="image/*"
                      onChange={onChange}
                    />
                  </div>
                </div>
              </div>

              <button
                id="register_button"
                type="submit"
                className="btn btn-block btn-success py-2 font-weight-bold text-white w-100"
              >
                REGISTER
              </button>

              <div className="text-center mt-4">
                <Link to="/users/login" className="text-muted">
                  Already have an account? <b>Login here</b>
                </Link>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Register;
