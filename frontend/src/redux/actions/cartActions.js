import {
  addToCart,
  updateCartQuantity,
  removeCartItem,
  saveDeliveryInfo,
  clearCart,
} from "../slices/cartSlice";

export const addItemToCart =
  (foodItem, quantity = 1, restaurantId) =>
  (dispatch) => {
    const itemData = {
      fooditem: foodItem._id,
      name: foodItem.name,
      price: foodItem.price,
      image: foodItem.images?.[0]?.url || "/images/placeholder.png",
      stock: foodItem.stock,
      quantity,
      restaurant: restaurantId || foodItem.restaurant,
    };

    dispatch(addToCart(itemData));
  };

export const updateItemQuantity = (foodItemId, quantity) => (dispatch) => {
  dispatch(updateCartQuantity({ foodItemId, quantity }));
};

export const removeItemFromCart = (foodItemId) => (dispatch) => {
  dispatch(removeCartItem(foodItemId));
};

export const saveDeliveryAddress = (data) => (dispatch) => {
  dispatch(saveDeliveryInfo(data));
};

export const clearCartItems = () => (dispatch) => {
  dispatch(clearCart());
};
