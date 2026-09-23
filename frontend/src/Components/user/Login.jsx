import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login, clearErrors } from "../../redux/actions/userActions";
import Loader from "../layout/Loader";
import { toast } from "react-toastify";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { isAuthenticated, error, loading } = useSelector(
    (state) => state.auth || {}
  );

  const redirect = new URLSearchParams(location.search).get("redirect") || "/";

  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirect === "delivery" ? "/delivery" : redirect);
    }

    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
  }, [dispatch, isAuthenticated, error, navigate, redirect]);

  const submitHandler = async (e) => {
    e.preventDefault();
    const result = await dispatch(login(email, password));
    if (result.success) {
      toast.success("Welcome back! Logged in successfully.");
    }
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="row wrapper">
          <div className="col-10 col-lg-5">
            <form className="shadow-lg bg-white rounded p-4" onSubmit={submitHandler}>
              <h1 className="mb-4 font-weight-bold text-center">Login</h1>

              <div className="form-group mb-3">
                <label htmlFor="email_field">Email</label>
                <input
                  type="email"
                  id="email_field"
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Enter your email"
                />
              </div>

              <div className="form-group mb-4">
                <label htmlFor="password_field">Password</label>
                <input
                  type="password"
                  id="password_field"
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter your password"
                />
              </div>

              <button
                id="login_button"
                type="submit"
                className="btn btn-block btn-success py-2 font-weight-bold text-white w-100"
              >
                LOGIN
              </button>

              <div className="text-center mt-4">
                <Link to="/users/signup" className="text-muted">
                  New User? <b>Register here</b>
                </Link>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Login;
