import React, { useState } from "react";
import { Link, Route, Routes, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Search from "./Search";
import { logout } from "../../redux/actions/userActions";
import { toggleFoodGenieChat } from "../../redux/actions/aiActions";
import { toast } from "react-toastify";
import "../../App.css";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [deliveryLocation, setDeliveryLocation] = useState(
    () => localStorage.getItem("selectedCity") || "MG Road, Bengaluru"
  );

  const { cartItems } = useSelector((state) => state.cart || { cartItems: [] });
  const { user, isAuthenticated } = useSelector((state) => state.auth || {});

  const totalCartCount = (cartItems || []).reduce(
    (acc, item) => acc + (item.quantity || 1),
    0
  );

  const logoutHandler = () => {
    dispatch(logout());
    setDropdownOpen(false);
    toast.success("Logged out successfully");
    navigate("/");
  };

  const handleLocationChange = () => {
    const newLoc = prompt("Enter delivery address or city:", deliveryLocation);
    if (newLoc && newLoc.trim()) {
      setDeliveryLocation(newLoc.trim());
      localStorage.setItem("selectedCity", newLoc.trim());
      toast.info(`📍 Delivery location set to: ${newLoc.trim()}`);
    }
  };

  return (
    <nav className="navbar row sticky-top align-items-center">
      {/* logo & location */}
      <div className="col-12 col-md-4 d-flex align-items-center">
        <Link to="/" className="mr-3">
          <img src="/images/logo.webp" alt="FoodApp Logo" className="logo" style={{ maxHeight: "48px", width: "auto" }} />
        </Link>
        <button
          className="btn btn-sm btn-outline-light d-flex align-items-center gap-1 rounded-pill px-3 py-1 header-loc-btn text-truncate"
          onClick={handleLocationChange}
          title="Click to change location"
          style={{ fontSize: "0.85rem", maxWidth: "200px" }}
        >
          <span>📍</span>
          <span className="text-truncate">{deliveryLocation}</span>
        </button>
      </div>

      {/* search bar and search icon */}
      <div className="col-12 col-md-4 mt-2 mt-md-0">
        <Routes>
          <Route path="/" element={<Search />} />
          <Route path="/eats/stores/search/:keyword" element={<Search />} />
          <Route path="*" element={<Search />} />
        </Routes>
      </div>

      {/* Food Genie, Cart & Login / User Profile */}
      <div className="col-12 col-md-4 mt-2 mt-md-0 text-center d-flex align-items-center justify-content-end pr-4 gap-2">
        {/* Food Genie Button */}
        <button
          className="btn btn-sm btn-purple-genie text-white fw-bold px-3 py-1 rounded-pill mr-2 d-flex align-items-center gap-1 shadow-sm"
          onClick={() => dispatch(toggleFoodGenieChat(true))}
          title="Ask Food Genie for AI Recommendations"
          style={{ background: "linear-gradient(135deg, #8a2be2, #4a00e0)", border: "none" }}
        >
          <span>🧞</span>
          <span>Food Genie</span>
        </button>

        {/* Cart */}
        <Link to="/cart" style={{ textDecoration: "none" }} className="mr-3">
          <span id="cart" className="mr-2">
            🛒 Cart
          </span>
          <span id="cart_count">{totalCartCount}</span>
        </Link>

        {/* User Auth */}
        {isAuthenticated && user ? (
          <div className="position-relative d-inline-block">
            <button
              className="btn text-white d-flex align-items-center bg-transparent border-0"
              type="button"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              style={{ outline: "none", cursor: "pointer" }}
            >
              <figure className="avatar avatar-nav mb-0 mr-2">
                <img
                  src={user.avatar?.url || "/images/images.png"}
                  alt={user.name}
                  className="rounded-circle"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/images/images.png";
                  }}
                />
              </figure>
              <span className="font-weight-bold text-white">
                {user.name?.split(" ")[0]} ▼
              </span>
            </button>

            {dropdownOpen && (
              <div
                className="dropdown-menu show position-absolute"
                style={{
                  right: 0,
                  top: "100%",
                  zIndex: 1050,
                  backgroundColor: "#ffffff",
                  boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
                  borderRadius: "8px",
                  minWidth: "160px",
                }}
              >
                <Link
                  className="dropdown-item py-2"
                  to="/eats/orders/me/myOrders"
                  onClick={() => setDropdownOpen(false)}
                >
                  📦 My Orders
                </Link>
                <Link
                  className="dropdown-item py-2"
                  to="/users/me"
                  onClick={() => setDropdownOpen(false)}
                >
                  👤 Profile
                </Link>
                <div className="dropdown-divider"></div>
                <button
                  className="dropdown-item py-2 text-danger"
                  onClick={logoutHandler}
                >
                  🚪 Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/users/login" className="btn btn-warning ml-3 px-3 py-1 font-weight-bold">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Header;