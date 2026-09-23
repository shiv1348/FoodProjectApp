import { configureStore } from "@reduxjs/toolkit";
import restaurantReducer from "./slices/restaurantSlice";
import menuReducer from "./slices/menuSlice";
import cartReducer from "./slices/cartSlice";
import userReducer from "./slices/userSlice";
import orderReducer from "./slices/orderSlice";
import aiReducer from "./slices/aiSlice";

const store = configureStore({
  reducer: {
    restaurants: restaurantReducer,
    menus: menuReducer,
    cart: cartReducer,
    auth: userReducer,
    order: orderReducer,
    ai: aiReducer,
  },
});

export default store;