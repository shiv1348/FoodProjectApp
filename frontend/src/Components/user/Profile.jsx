import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Loader from "../layout/Loader";

const Profile = () => {
  const { user, loading } = useSelector((state) => state.auth || {});

  return (
    <>
      {loading ? (
        <Loader />
      ) : user ? (
        <div className="container container-fluid mt-5">
          <h2 className="mt-5 ml-5 font-weight-bold">My Profile</h2>
          <div className="row justify-content-around mt-4 user-info bg-white p-4 rounded shadow-sm">
            <div className="col-12 col-md-4 text-center">
              <figure className="avatar avatar-profile mb-4">
                <img
                  className="rounded-circle img-fluid"
                  src={user.avatar?.url || "/images/images.png"}
                  alt={user.name}
                  style={{
                    width: "160px",
                    height: "160px",
                    objectFit: "cover",
                    border: "3px solid #078347",
                  }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/images/images.png";
                  }}
                />
              </figure>
              <Link
                to="/users/me/update"
                id="edit_profile"
                className="btn btn-primary btn-block my-3 font-weight-bold"
              >
                ✏️ Edit Profile
              </Link>
            </div>

            <div className="col-12 col-md-6">
              <h4>Full Name</h4>
              <p className="lead">{user.name}</p>

              <h4>Email Address</h4>
              <p className="lead">{user.email}</p>

              <h4>Phone Number</h4>
              <p className="lead">{user.phonenumber || "Not provided"}</p>

              <h4>Joined On</h4>
              <p className="lead">
                {String(user.createdAt).substring(0, 10)}
              </p>

              <div className="mt-4">
                <Link
                  to="/eats/orders/me/myOrders"
                  className="btn btn-danger btn-block py-2 font-weight-bold text-white mr-3"
                >
                  📦 My Orders
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center mt-5">
          <p>Please log in to view your profile.</p>
          <Link to="/users/login" className="btn btn-primary">
            Login
          </Link>
        </div>
      )}
    </>
  );
};

export default Profile;
