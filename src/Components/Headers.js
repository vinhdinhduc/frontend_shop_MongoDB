import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCartShopping,
  faUser,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify"; // Import react-toastify
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../context/AuthContext"; // Giả sử bạn đã có AuthContext
import "./Header.scss";
import shoppe from "../assets/image/shoppe.jpg";

function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoggedIn, user, logout } = useAuth(); // Lấy trạng thái đăng nhập từ Context

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
              <li className="nav_item">
                <Link
                  to="/"
                  className={`nav_link ${
                    location.pathname === "/" ? "active" : ""
                  }`}
                >
                  Trang chủ
                </Link>
              </li>
              <li className="nav_item">
                <Link
                  to="/products"
                  className={`nav_link ${
                    location.pathname === "/products" ? "active" : ""
                  }`}
                >
                  Sản Phẩm
                </Link>
              </li>
              <li className="nav_item">
                <Link
                  to="/about"
                  className={`nav_link ${
                    location.pathname === "/about" ? "active" : ""
                  }`}
                >
                  Về chúng tôi
                </Link>
              </li>
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
                <span className="user-email">{user?.email}</span>
              </Link>
              <button onClick={handleLogout} className="logout-button">
                <FontAwesomeIcon icon={faSignOutAlt} />
              </button>
              <Link to="/cart" className="cart-button">
                <span className="cart-icon">
                  <FontAwesomeIcon icon={faCartShopping} />
                </span>
                <span className="cart-count">{user?.cart?.length || 0}</span>
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

              <Link onClick={handleCartClick} className="cart-button">
                <span className="cart-icon">
                  <FontAwesomeIcon icon={faCartShopping} />
                </span>
                <span className="cart-count">0</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
