import React, { useEffect } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Layout & Core Views
import Header from "./Components/layout/Header";
import Footer from "./Components/layout/Footer";
import Home from "./Components/Home";
import Menu from "./Components/Menu";

// Cart & Checkout Views
import Cart from "./Components/cart/Cart";
import Delivery from "./Components/cart/Delivery";
import ConfirmOrder from "./Components/cart/ConfirmOrder";
import Payment from "./Components/cart/Payment";
import OrderSuccess from "./Components/cart/OrderSuccess";

// Order Views
import ListOrders from "./Components/order/ListOrders";
import OrderDetails from "./Components/order/OrderDetails";

// User Auth Views
import Login from "./Components/user/Login";
import Register from "./Components/user/Register";
import Profile from "./Components/user/Profile";
import UpdateProfile from "./Components/user/UpdateProfile";

import { loadUser } from "./redux/actions/userActions";

// AI & Analytics Global Widgets
import FoodGenieChat from "./Components/ai/FoodGenieChat";
import StickyCartBar from "./Components/cart/StickyCartBar";
import ReviewAnalyticsModal from "./Components/analytics/ReviewAnalyticsModal";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  return (
    <>
      <ToastContainer position="top-right" autoClose={2500} />
      <Router>
        <div className="App">
          <Header />
          <div className="container container-fluids min-vh-100 pb-5">
            <Routes>
              {/* Home & Search */}
              <Route path="/" element={<Home />} />
              <Route path="/eats/stores/search/:keyword" element={<Home />} />

              {/* Menus */}
              <Route path="/eats/stores/:id/menus" element={<Menu />} />

              {/* Cart & Checkout */}
              <Route path="/cart" element={<Cart />} />
              <Route path="/delivery" element={<Delivery />} />
              <Route path="/confirm" element={<ConfirmOrder />} />
              <Route path="/payment" element={<Payment />} />
              <Route path="/success" element={<OrderSuccess />} />

              {/* Orders */}
              <Route path="/eats/orders/me/myOrders" element={<ListOrders />} />
              <Route path="/eats/orders/:id" element={<OrderDetails />} />

              {/* User Authentication */}
              <Route path="/users/login" element={<Login />} />
              <Route path="/users/signup" element={<Register />} />
              <Route path="/users/me" element={<Profile />} />
              <Route path="/users/me/update" element={<UpdateProfile />} />
            </Routes>
          </div>
          <StickyCartBar />
          <FoodGenieChat />
          <ReviewAnalyticsModal />
          <Footer />
        </div>
      </Router>
    </>
  );
}

export default App;
