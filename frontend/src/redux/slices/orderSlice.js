import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  orders: [],
  order: null,
  loading: false,
  error: null,
  success: false,
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    // CREATE ORDER
    createOrderRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    createOrderSuccess: (state, action) => {
      state.loading = false;
      state.order = action.payload;
      state.success = true;
    },
    createOrderFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    createOrderReset: (state) => {
      state.success = false;
    },

    // MY ORDERS
    myOrdersRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    myOrdersSuccess: (state, action) => {
      state.loading = false;
      state.orders = action.payload;
    },
    myOrdersFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // ORDER DETAILS
    orderDetailsRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    orderDetailsSuccess: (state, action) => {
      state.loading = false;
      state.order = action.payload;
    },
    orderDetailsFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    clearOrderErrors: (state) => {
      state.error = null;
    },
  },
});

export const {
  createOrderRequest,
  createOrderSuccess,
  createOrderFail,
  createOrderReset,
  myOrdersRequest,
  myOrdersSuccess,
  myOrdersFail,
  orderDetailsRequest,
  orderDetailsSuccess,
  orderDetailsFail,
  clearOrderErrors,
} = orderSlice.actions;

export default orderSlice.reducer;
