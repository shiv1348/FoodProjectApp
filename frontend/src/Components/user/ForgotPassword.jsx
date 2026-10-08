import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../utils/api";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const submitHandler = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post("/v1/auth/password/forgot", { email });
      setSubmitted(true);
      toast.success(data.message);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.response?.data?.errMessage ||
          "Unable to send the reset link. Please try again."
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
          <h1 className="mb-4 font-weight-bold text-center">Forgot Password</h1>
          {submitted ? (
            <>
              <p>
                If an account exists for that email, a password reset link has
                been sent. Check your inbox.
              </p>
              <Link to="/users/login" className="btn btn-success w-100">
                Back to Login
              </Link>
            </>
          ) : (
            <>
              <p>Enter your account email and we will send you a reset link.</p>
              <div className="form-group mb-4">
                <label htmlFor="email_field">Email</label>
                <input
                  type="email"
                  id="email_field"
                  className="form-control"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  autoComplete="email"
                  required
                  placeholder="Enter your email"
                />
              </div>
              <button
                type="submit"
                className="btn btn-success py-2 font-weight-bold text-white w-100"
                disabled={loading}
              >
                {loading ? "Sending..." : "SEND RESET LINK"}
              </button>
              <div className="text-center mt-4">
                <Link to="/users/login">Back to Login</Link>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
