import React from "react";
import { Link } from "react-router-dom";
import "../../App.css";

const CheckoutSteps = ({ delivery, confirmOrder, payment }) => {
  return (
    <div className="checkout-progress d-flex justify-content-center mt-4 mb-4">
      {/* Step 1: Delivery */}
      {delivery ? (
        <Link to="/delivery" className="float-right text-decoration-none">
          <div className="triangle2-active"></div>
          <div className="step active-step">Delivery</div>
          <div className="triangle-active"></div>
        </Link>
      ) : (
        <Link to="#!" disabled className="float-right text-decoration-none">
          <div className="triangle2-incomplete"></div>
          <div className="step incomplete">Delivery</div>
          <div className="triangle-incomplete"></div>
        </Link>
      )}

      {/* Step 2: Confirm Order */}
      {confirmOrder ? (
        <Link to="/confirm" className="float-right text-decoration-none">
          <div className="triangle2-active"></div>
          <div className="step active-step">Confirm Order</div>
          <div className="triangle-active"></div>
        </Link>
      ) : (
        <Link to="#!" disabled className="float-right text-decoration-none">
          <div className="triangle2-incomplete"></div>
          <div className="step incomplete">Confirm Order</div>
          <div className="triangle-incomplete"></div>
        </Link>
      )}

      {/* Step 3: Payment */}
      {payment ? (
        <Link to="/payment" className="float-right text-decoration-none">
          <div className="triangle2-active"></div>
          <div className="step active-step">Payment</div>
          <div className="triangle-active"></div>
        </Link>
      ) : (
        <Link to="#!" disabled className="float-right text-decoration-none">
          <div className="triangle2-incomplete"></div>
          <div className="step incomplete">Payment</div>
          <div className="triangle-incomplete"></div>
        </Link>
      )}
    </div>
  );
};

export default CheckoutSteps;
