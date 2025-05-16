import React from "react";
import { motion } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCartShopping,
  faUser,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../context/AuthContext";
import "./Header.scss";
import shoppe from "../assets/image/shoppe.jpg";
import { useCart } from "../context/CartContext";

function Header() {
  const location = useLocation();
  const { cart } = useCart();
  const navigate = useNavigate();
  const { isLoggedIn, user, logout } = useAuth();

  console.log("check usẻ", user);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleCartClick = () => {
    if (!isLoggedIn) {
      toast.warn("Bạn cần đăng nhập để sử dụng giỏ hàng", {
        position: "top-center",
      });
    } else {
      navigate("/cart");
    }
  };
  return (
    <header className="header">
      <div className="header_container">
        {/* Left side - Giữ nguyên */}
        <div className="header_left">
          <Link to="/" className="header_logo">
            <img src={shoppe} alt="Logo" />
          </Link>

          <nav className="header_nav">
            <ul className="nav_list">
              {[
                { path: "/", label: "Trang chủ" },
                { path: "/products", label: "Sản Phẩm" },
                { path: "/about", label: "Về chúng tôi" },
              ].map((item) => (
                <motion.li
                  key={item.path}
                  className={`nav_item ${
                    location.pathname === item.path ? "active" : ""
                  }`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link to={item.path} className="nav_link">
                    {item.label}
                  </Link>
                  {location.pathname === item.path && (
                    <motion.div
                      className="active-indicator"
                      layoutId="active-indicator"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </motion.li>
              ))}
            </ul>
          </nav>
        </div>
        {/* Header Search */}
        <div className="header_search">
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            className="search_input"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                navigate(`/products?search=${e.target.value}`);
              }
            }}
          />
          <button
            className="search_button"
            onClick={() => {
              const input = document.querySelector(".search_input");
              navigate(`/products?search=${input.value}`);
            }}
          >
            Tìm kiếm
          </button>
        </div>

        {/* Right side - Cập nhật */}
        <div className="header_right">
          {isLoggedIn ? (
            <div className="user-section">
              <Link to="/profile" className="user-info">
                <FontAwesomeIcon icon={faUser} className="user-icon" />
                <span className="user-email">{user?.name}</span>
              </Link>
              <button onClick={handleLogout} className="logout-button">
                <FontAwesomeIcon icon={faSignOutAlt} />
              </button>
              <Link to="/cart" className="cart-button">
                <span className="cart-icon">
                  <FontAwesomeIcon icon={faCartShopping} />
                </span>
                <span className="cart-count">{cart?.items?.length || 0}</span>
              </Link>
            </div>
          ) : (
            <div className="auth-section">
              <div className="auth-buttons">
                <Link to="/login" className="auth-button">
                  Đăng nhập
                </Link>
                <Link to="/register" className="auth-button">
                  Đăng ký
                </Link>
              </div>
              {isLoggedIn && (
                <Link onClick={handleCartClick} className="cart-button">
                  <span className="cart-icon">
                    <FontAwesomeIcon icon={faCartShopping} />
                  </span>
                  <span className="cart-count">{cart?.items?.length || 0}</span>
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
