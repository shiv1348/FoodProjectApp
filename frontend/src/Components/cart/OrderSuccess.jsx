import React from "react";
import { Link } from "react-router-dom";
import "../../App.css";

const OrderSuccess = () => {
  return (
    <div className="container mt-5 text-center">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">
          {/* Animated Green Checkmark SVG matching App.css */}
          <div className="mb-4">
            <svg
              className="checkmark"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 52 52"
            >
              <circle
                className="checkmark__circle"
                cx="26"
                cy="26"
                r="25"
                fill="none"
              />
              <path
                className="checkmark__check"
                fill="none"
                d="M14.1 27.2l7.1 7.2 16.7-16.8"
              />
            </svg>
          </div>

          <h2 className="font-weight-bold mb-3">
            Your Order has been placed successfully! 🎉
          </h2>

          <p className="text-muted mb-4 lead">
            Your delicious food is being prepared and will be delivered shortly.
          </p>

          <div className="d-flex justify-content-center gap-3">
            <Link
              to="/eats/orders/me/myOrders"
              className="btn btn-success px-4 py-2 font-weight-bold mr-3"
            >
              📦 Go to My Orders
            </Link>

            <Link to="/" className="btn btn-outline-secondary px-4 py-2">
              Browse More Restaurants
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
