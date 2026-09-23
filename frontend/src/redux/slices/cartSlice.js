import { createSlice } from "@reduxjs/toolkit";

const getSavedCartItems = () => {
  try {
    const saved = localStorage.getItem("cartItems");
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    return [];
  }
};

const getSavedDeliveryInfo = () => {
  try {
    const saved = localStorage.getItem("deliveryInfo");
    return saved ? JSON.parse(saved) : {};
  } catch (e) {
    return {};
  }
};

const getSavedRestaurant = () => {
  try {
    const saved = localStorage.getItem("restaurant");
    return saved ? JSON.parse(saved) : null;
  } catch (e) {
    return null;
  }
};

const initialState = {
  cartItems: getSavedCartItems(),
  restaurant: getSavedRestaurant(),
  deliveryInfo: getSavedDeliveryInfo(),
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const isItemExist = state.cartItems.find(
        (i) => i.fooditem === item.fooditem
      );

      // If item belongs to a different restaurant, reset cart to new restaurant
      if (state.restaurant && item.restaurant && state.restaurant !== item.restaurant) {
        state.cartItems = [item];
        state.restaurant = item.restaurant;
      } else {
        if (!state.restaurant && item.restaurant) {
          state.restaurant = item.restaurant;
        }

        if (isItemExist) {
          state.cartItems = state.cartItems.map((i) =>
            i.fooditem === isItemExist.fooditem ? item : i
          );
        } else {
          state.cartItems.push(item);
        }
      }

      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
      localStorage.setItem("restaurant", JSON.stringify(state.restaurant));
    },

    updateCartQuantity: (state, action) => {
      const { foodItemId, quantity } = action.payload;
      const item = state.cartItems.find((i) => i.fooditem === foodItemId);
      if (item) {
        item.quantity = quantity;
      }
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },

    removeCartItem: (state, action) => {
      state.cartItems = state.cartItems.filter(
        (i) => i.fooditem !== action.payload
      );
      if (state.cartItems.length === 0) {
        state.restaurant = null;
        localStorage.removeItem("restaurant");
      }
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },

    saveDeliveryInfo: (state, action) => {
      state.deliveryInfo = action.payload;
      localStorage.setItem("deliveryInfo", JSON.stringify(action.payload));
    },

    clearCart: (state) => {
      state.cartItems = [];
      state.restaurant = null;
      localStorage.removeItem("cartItems");
      localStorage.removeItem("restaurant");
    },
  },
});

export const {
  addToCart,
  updateCartQuantity,
  removeCartItem,
  saveDeliveryInfo,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
