import React from "react";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";

const StickyCartBar = () => {
  const location = useLocation();
  const { cartItems } = useSelector((state) => state.cart || {});

  // Do not show sticky cart bar on the checkout/cart pages themselves
  const hideOnPaths = ["/cart", "/delivery", "/confirm", "/payment", "/success"];
  if (hideOnPaths.includes(location.pathname)) {
    return null;
  }

  if (!cartItems || cartItems.length === 0) {
    return null;
  }

  const totalQuantity = cartItems.reduce((acc, item) => acc + (item.quantity || 1), 0);
  const totalPrice = cartItems.reduce((acc, item) => acc + (item.quantity || 1) * (item.price || 0), 0);

  return (
    <div className="sticky-cart-bar-wrapper">
      <div className="container">
        <div className="sticky-cart-bar shadow-lg d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-3">
            <div className="cart-badge-icon">
              🛒
              <span className="cart-count-pill">{totalQuantity}</span>
            </div>
            <div>
              <div className="fw-bold text-white fs-6">
                Your Cart &bull; {totalQuantity} {totalQuantity === 1 ? "item" : "items"}
              </div>
              <div className="text-warning fw-bold fs-5">
                ₹{totalPrice.toLocaleString("en-IN")}
              </div>
            </div>
          </div>

          <Link to="/cart" id="view_cart_sticky_btn" className="btn btn-warning fw-bold px-4 py-2 rounded-pill text-dark shadow-sm">
            View Cart &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
};

export default StickyCartBar;
