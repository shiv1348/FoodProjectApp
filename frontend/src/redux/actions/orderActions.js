import api from "../../utils/api";
import {
  createOrderRequest,
  createOrderSuccess,
  createOrderFail,
  myOrdersRequest,
  myOrdersSuccess,
  myOrdersFail,
  orderDetailsRequest,
  orderDetailsSuccess,
  orderDetailsFail,
  clearOrderErrors,
} from "../slices/orderSlice";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  const headers = { "Content-Type": "application/json" };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
};

// Create Order
export const createOrder = (orderData) => async (dispatch) => {
  try {
    dispatch(createOrderRequest());

    const { data } = await api.post("/v1/order/new", orderData, {
      headers: getAuthHeaders(),
    });

    dispatch(createOrderSuccess(data.order));
    return { success: true, order: data.order };
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.response?.data?.errMessage ||
      error.message ||
      "Failed to create order";
    dispatch(createOrderFail(message));
    return { success: false, error: message };
  }
};

// Get Logged In User Orders
export const myOrders = () => async (dispatch) => {
  try {
    dispatch(myOrdersRequest());

    const { data } = await api.get("/v1/order/me/myOrders", {
      headers: getAuthHeaders(),
    });

    dispatch(myOrdersSuccess(data.orders || []));
  } catch (error) {
    dispatch(
      myOrdersFail(
        error.response?.data?.message ||
          error.response?.data?.errMessage ||
          error.message ||
          "Failed to fetch orders"
      )
    );
  }
};

// Get Order Details
export const getOrderDetails = (id) => async (dispatch) => {
  try {
    dispatch(orderDetailsRequest());

    const { data } = await api.get(`/v1/order/${id}`, {
      headers: getAuthHeaders(),
    });

    dispatch(orderDetailsSuccess(data.order));
  } catch (error) {
    dispatch(
      orderDetailsFail(
        error.response?.data?.message ||
          error.response?.data?.errMessage ||
          error.message ||
          "Failed to fetch order details"
      )
    );
  }
};

// Clear Errors
export const clearErrors = () => (dispatch) => {
  dispatch(clearOrderErrors());
};
