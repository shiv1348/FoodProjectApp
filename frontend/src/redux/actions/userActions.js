import api from "../../utils/api";
import {
  loginRequest,
  loginSuccess,
  loginFail,
  registerRequest,
  registerSuccess,
  registerFail,
  loadUserRequest,
  loadUserSuccess,
  loadUserFail,
  logoutSuccess,
  logoutFail,
  updateProfileRequest,
  updateProfileSuccess,
  updateProfileFail,
  clearAuthErrors,
} from "../slices/userSlice";

// Login
export const login = (email, password) => async (dispatch) => {
  try {
    dispatch(loginRequest());

    const { data } = await api.post(
      "/v1/auth/login",
      { email, password },
      { headers: { "Content-Type": "application/json" } }
    );

    const user = data.data?.user || data.user;
    if (data.token) {
      localStorage.setItem("token", data.token);
    }
    dispatch(loginSuccess(user));
    return { success: true };
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.response?.data?.errMessage ||
      error.message ||
      "Login failed";
    dispatch(loginFail(message));
    return { success: false, error: message };
  }
};

// Register
export const register = (userData) => async (dispatch) => {
  try {
    dispatch(registerRequest());

    const { data } = await api.post("/v1/auth/signup", userData, {
      headers: { "Content-Type": "application/json" },
    });

    const user = data.data?.user || data.user;
    if (data.token) {
      localStorage.setItem("token", data.token);
    }
    dispatch(registerSuccess(user));
    return { success: true };
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.response?.data?.errMessage ||
      error.message ||
      "Registration failed";
    dispatch(registerFail(message));
    return { success: false, error: message };
  }
};

// Load Logged in User
export const loadUser = () => async (dispatch) => {
  try {
    dispatch(loadUserRequest());

    const token = localStorage.getItem("token");
    const headers = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const { data } = await api.get("/v1/auth/me", { headers });

    dispatch(loadUserSuccess(data.user));
  } catch (error) {
    dispatch(loadUserFail());
  }
};

// Logout User
export const logout = () => async (dispatch) => {
  try {
    await api.get("/v1/auth/logout");
    localStorage.removeItem("token");
    dispatch(logoutSuccess());
  } catch (error) {
    dispatch(
      logoutFail(error.response?.data?.message || "Failed to logout")
    );
  }
};

// Update Profile
export const updateProfile = (userData) => async (dispatch) => {
  try {
    dispatch(updateProfileRequest());

    const token = localStorage.getItem("token");
    const headers = { "Content-Type": "application/json" };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const { data } = await api.put("/v1/auth/me/update", userData, { headers });

    dispatch(updateProfileSuccess(data.user));
    return { success: true };
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.response?.data?.errMessage ||
      error.message ||
      "Update profile failed";
    dispatch(updateProfileFail(message));
    return { success: false, error: message };
  }
};

// Clear Errors
export const clearErrors = () => (dispatch) => {
  dispatch(clearAuthErrors());
};
