import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../utils/api";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const { token } = useParams();
  const navigate = useNavigate();

  const submitHandler = async (event) => {
    event.preventDefault();
    if (password !== passwordConfirm) {
      toast.error("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.patch(`/v1/auth/password/reset/${token}`, {
        password,
        passwordConfirm,
      });
      toast.success(data.message);
      navigate("/users/login");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.response?.data?.errMessage ||
          "Unable to reset your password. Request a new reset link."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="row wrapper">
      <div className="col-10 col-lg-5">
        <form
          className="shadow-lg bg-white rounded p-4"
          onSubmit={submitHandler}
        >
          <h1 className="mb-4 font-weight-bold text-center">Reset Password</h1>
          <div className="form-group mb-3">
            <label htmlFor="password_field">New Password</label>
            <input
              type="password"
              id="password_field"
              className="form-control"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="new-password"
              minLength={8}
              required
              placeholder="At least 8 characters"
            />
          </div>
          <div className="form-group mb-4">
            <label htmlFor="password_confirm_field">Confirm New Password</label>
            <input
              type="password"
              id="password_confirm_field"
              className="form-control"
              value={passwordConfirm}
              onChange={(event) => setPasswordConfirm(event.target.value)}
              autoComplete="new-password"
              minLength={8}
              required
              placeholder="Re-enter your new password"
            />
          </div>
          <button
            type="submit"
            className="btn btn-success py-2 font-weight-bold text-white w-100"
            disabled={loading}
          >
            {loading ? "Updating..." : "RESET PASSWORD"}
          </button>
          <div className="text-center mt-4">
            <Link to="/users/login">Back to Login</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
