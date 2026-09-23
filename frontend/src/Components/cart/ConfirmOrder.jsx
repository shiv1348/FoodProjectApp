import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import CheckoutSteps from "./CheckoutSteps";

const ConfirmOrder = () => {
  const navigate = useNavigate();

  const { cartItems, deliveryInfo } = useSelector((state) => state.cart || {});
  const { user } = useSelector((state) => state.auth || {});

  // Calculate prices
  const itemsPrice = (cartItems || []).reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const deliveryCharge = itemsPrice > 0 ? 55 : 0;
  const taxPrice = Number((0.05 * itemsPrice).toFixed(2));
  const finalTotal = (itemsPrice + deliveryCharge + taxPrice).toFixed(2);

  const processToPayment = () => {
    const data = {
      itemsPrice: itemsPrice.toFixed(2),
      deliveryCharge,
      taxPrice,
      finalTotal,
    };

    sessionStorage.setItem("orderInfo", JSON.stringify(data));
    navigate("/payment");
  };

  return (
    <>
      <CheckoutSteps delivery confirmOrder />

      <div className="container mt-4">
        <div className="row d-flex justify-content-between">
          <div className="col-12 col-lg-8 mt-3 order-confirm">
            <h4 className="mb-3 font-weight-bold">Shipping Info</h4>
            <p>
              <b>Name:</b> {user && user.name}
            </p>
            <p>
              <b>Phone:</b> {deliveryInfo && deliveryInfo.phoneNo}
            </p>
            <p className="mb-4">
              <b>Address:</b>{" "}
              {`${deliveryInfo.address}, ${deliveryInfo.city}, ${deliveryInfo.postalCode}, ${deliveryInfo.country}`}
            </p>

            <hr />
            <h4 className="mt-4 mb-3 font-weight-bold">Your Cart Items:</h4>

            {cartItems.map((item) => (
              <div key={item.fooditem} className="mb-3">
                <div className="row align-items-center">
                  <div className="col-3 col-lg-2">
                    <img
                      src={item.image}
                      alt={item.name}
                      height="50"
                      width="65"
                      className="rounded"
                      style={{ objectFit: "cover" }}
                    />
                  </div>

                  <div className="col-5 col-lg-6">
                    <span className="font-weight-bold">{item.name}</span>
                  </div>

                  <div className="col-4 col-lg-4 text-right">
                    <p className="mb-0">
                      {item.quantity} x ₹{item.price} ={" "}
                      <b>₹{(item.quantity * item.price).toFixed(2)}</b>
                    </p>
                  </div>
                </div>
                <hr />
              </div>
            ))}
          </div>

          <div className="col-12 col-lg-4 my-4">
            <div id="order_summary" className="shadow-sm bg-white p-4 rounded">
              <h4 className="border-bottom pb-3 font-weight-bold">Order Summary</h4>
              <p className="d-flex justify-content-between">
                <span>Subtotal:</span>
                <span className="order-summary-values font-weight-bold">
                  ₹{itemsPrice.toFixed(2)}
                </span>
              </p>
              <p className="d-flex justify-content-between">
                <span>Delivery Charges:</span>
                <span className="order-summary-values">₹{deliveryCharge}</span>
              </p>
              <p className="d-flex justify-content-between">
                <span>Tax (5%):</span>
                <span className="order-summary-values">₹{taxPrice}</span>
              </p>

              <hr />

              <p className="d-flex justify-content-between font-weight-bold h5">
                <span>Total:</span>
                <span className="order-summary-values text-success">
                  ₹{finalTotal}
                </span>
              </p>

              <hr />

              <button
                id="checkout_btn"
                className="btn btn-primary btn-block py-2 font-weight-bold text-white w-100"
                onClick={processToPayment}
              >
                Proceed to Payment ➔
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConfirmOrder;
