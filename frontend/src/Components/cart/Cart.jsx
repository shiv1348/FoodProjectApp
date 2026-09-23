import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faIndianRupeeSign, faTrash } from "@fortawesome/free-solid-svg-icons";
import {
  updateItemQuantity,
  removeItemFromCart,
} from "../../redux/actions/cartActions";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { cartItems } = useSelector((state) => state.cart || { cartItems: [] });
  const { isAuthenticated } = useSelector((state) => state.auth || {});

  const increaseQty = (foodItemId, quantity, stock) => {
    if (quantity < stock) {
      dispatch(updateItemQuantity(foodItemId, quantity + 1));
    }
  };

  const decreaseQty = (foodItemId, quantity) => {
    if (quantity > 1) {
      dispatch(updateItemQuantity(foodItemId, quantity - 1));
    } else {
      dispatch(removeItemFromCart(foodItemId));
    }
  };

  const removeCartItemHandler = (foodItemId) => {
    dispatch(removeItemFromCart(foodItemId));
  };

  const checkoutHandler = () => {
    if (isAuthenticated) {
      navigate("/delivery");
    } else {
      navigate("/users/login?redirect=delivery");
    }
  };

  // Price calculations
  const itemsPrice = (cartItems || []).reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const totalUnits = (cartItems || []).reduce(
    (acc, item) => acc + item.quantity,
    0
  );
  const deliveryCharge = itemsPrice > 0 ? 55 : 0;
  const taxPrice = Number((0.05 * itemsPrice).toFixed(2));
  const finalTotal = (itemsPrice + deliveryCharge + taxPrice).toFixed(2);

  return (
    <div className="container container-fluid mt-4">
      {(!cartItems || cartItems.length === 0) ? (
        <div className="text-center my-5 py-5">
          <h2>Your Cart is Empty 🛒</h2>
          <p className="text-muted mt-2">
            Looks like you haven't added anything to your cart yet.
          </p>
          <Link to="/" className="btn btn-primary mt-3 px-4 py-2">
            Explore Restaurants
          </Link>
        </div>
      ) : (
        <>
          <h2 className="mt-4 mb-4">
            Your Cart: <b>{cartItems.length} items</b>
          </h2>

          <div className="row d-flex justify-content-between">
            {/* Cart Items List */}
            <div className="col-12 col-lg-8">
              {cartItems.map((item) => (
                <div key={item.fooditem}>
                  <hr />
                  <div className="cart-item">
                    <div className="row align-items-center">
                      <div className="col-4 col-lg-3">
                        <img
                          src={item.image || "/images/placeholder.png"}
                          alt={item.name}
                          height="90"
                          width="115"
                          className="rounded"
                          style={{ objectFit: "cover" }}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src =
                              "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop";
                          }}
                        />
                      </div>

                      <div className="col-5 col-lg-3">
                        <h5 className="font-weight-bold mb-1">{item.name}</h5>
                        <p id="card_item_price" className="mb-0">
                          <FontAwesomeIcon icon={faIndianRupeeSign} size="xs" />{" "}
                          {item.price}
                        </p>
                      </div>

                      <div className="col-4 col-lg-3 mt-4 mt-lg-0">
                        <div className="stockCounter d-flex align-items-center">
                          <button
                            className="btn btn-danger btn-sm minus"
                            onClick={() =>
                              decreaseQty(item.fooditem, item.quantity)
                            }
                          >
                            -
                          </button>

                          <input
                            type="number"
                            className="form-control text-center mx-2"
                            value={item.quantity}
                            readOnly
                            style={{ width: "50px" }}
                          />

                          <button
                            className="btn btn-primary btn-sm plus"
                            onClick={() =>
                              increaseQty(
                                item.fooditem,
                                item.quantity,
                                item.stock
                              )
                            }
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div className="col-4 col-lg-1 mt-4 mt-lg-0">
                        <button
                          id="delete_cart_item"
                          onClick={() => removeCartItemHandler(item.fooditem)}
                          className="btn btn-light text-danger"
                          title="Remove item"
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </div>

                      <div className="col-4 col-lg-2 text-right">
                        <span className="font-weight-bold">
                          ₹{item.price * item.quantity}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <hr />
            </div>

            {/* Order Summary Card */}
            <div className="col-12 col-lg-4 my-4">
              <div id="order_summary" className="shadow-sm bg-white">
                <h4 className="border-bottom pb-3 font-weight-bold">
                  Order Summary
                </h4>
                <p className="d-flex justify-content-between">
                  <span>Subtotal:</span>
                  <span className="order-summary-values font-weight-bold">
                    {totalUnits} (Units)
                  </span>
                </p>
                <p className="d-flex justify-content-between">
                  <span>Items Price:</span>
                  <span className="order-summary-values">₹{itemsPrice.toFixed(2)}</span>
                </p>
                <p className="d-flex justify-content-between">
                  <span>Delivery Charges:</span>
                  <span className="order-summary-values">₹{deliveryCharge}</span>
                </p>
                <p className="d-flex justify-content-between">
                  <span>Tax (5% GST):</span>
                  <span className="order-summary-values">₹{taxPrice}</span>
                </p>

                <hr />

                <p className="d-flex justify-content-between font-weight-bold h5">
                  <span>Final Total:</span>
                  <span className="order-summary-values text-success">
                    ₹{finalTotal}
                  </span>
                </p>

                <hr />

                <button
                  id="checkout_btn"
                  className="btn btn-primary btn-block text-white font-weight-bold py-2"
                  onClick={checkoutHandler}
                >
                  Check Out ➔
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
