import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faIndianRupeeSign } from "@fortawesome/free-solid-svg-icons";
import {
  addItemToCart,
  updateItemQuantity,
  removeItemFromCart,
} from "../redux/actions/cartActions";
import { toast } from "react-toastify";

const Fooditem = ({ fooditem, restaurant }) => {
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.cart);

  const cartItem = (cartItems || []).find((i) => i.fooditem === fooditem._id);
  const inCart = !!cartItem;
  const quantity = cartItem ? cartItem.quantity : 0;

  // Add button click
  const addToCartHandler = () => {
    dispatch(addItemToCart(fooditem, 1, restaurant));
    toast.success(`${fooditem.name} added to cart!`, {
      autoClose: 1500,
    });
  };

  // Increase quantity
  const increaseQty = () => {
    if (quantity < fooditem.stock) {
      dispatch(updateItemQuantity(fooditem._id, quantity + 1));
    } else {
      toast.error(`Only ${fooditem.stock} items available in stock`);
    }
  };

  // Decrease quantity
  const decreaseQty = () => {
    if (quantity > 1) {
      dispatch(updateItemQuantity(fooditem._id, quantity - 1));
    } else {
      dispatch(removeItemFromCart(fooditem._id));
      toast.info(`${fooditem.name} removed from cart`, { autoClose: 1500 });
    }
  };

  return (
    <div className="col-sm-12 col-md-6 col-lg-3 my-3">
      <div className="card p-3 rounded shadow-sm">
        <img
          className="card-img-top mx-auto food-image rounded"
          src={fooditem.images?.[0]?.url || "/images/placeholder.png"}
          alt={fooditem.name}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src =
              "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop";
          }}
        />

        <div className="card-body d-flex flex-column">
          <h5 className="card-title font-weight-bold">{fooditem.name}</h5>

          <p className="fooditem_des">{fooditem.description}</p>

          <p className="card-text text-dark font-weight-bold">
            <FontAwesomeIcon icon={faIndianRupeeSign} size="xs" /> {fooditem.price}
          </p>

          {/* BUTTON LOGIC */}
          {!inCart ? (
            <button
              type="button"
              id="cart_btn"
              className="btn btn-primary mt-2"
              disabled={fooditem.stock === 0}
              onClick={addToCartHandler}
            >
              Add to Cart
            </button>
          ) : (
            <div className="stockCounter d-flex align-items-center mt-2">
              <button
                className="btn btn-danger btn-sm"
                onClick={decreaseQty}
                style={{ width: "35px" }}
              >
                -
              </button>

              <input
                type="number"
                className="form-control text-center mx-2"
                value={quantity}
                readOnly
                style={{ width: "50px" }}
              />

              <button
                className="btn btn-primary btn-sm"
                onClick={increaseQty}
                style={{ width: "35px" }}
              >
                +
              </button>
            </div>
          )}

          <hr />

          <p className="mb-0">
            Status:{" "}
            <span className={fooditem.stock > 0 ? "greenColor" : "redColor"}>
              {fooditem.stock > 0 ? "In Stock" : "Out of Stock"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Fooditem;