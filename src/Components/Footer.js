import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faInstagram,
  faYoutube,
  faTiktok,
} from "@fortawesome/free-brands-svg-icons";
import "./Footer.scss";
import { faEnvelope, faHome, faPhone } from "@fortawesome/free-solid-svg-icons";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* About Section */}
        <div className="footer-section">
          <h4 className="footer-title">Về chúng tôi</h4>
          <p className="footer-text">
            Chuyên cung cấp các sản phẩm chất lượng cao với giá cả hợp lý
          </p>
          <div className="contact-info">
            <p>
              <FontAwesomeIcon icon={faPhone} /> 0123 456 789
            </p>
            <p>
              <FontAwesomeIcon icon={faEnvelope} /> vinhdinh568@gmail.com
            </p>
            <p>
              <FontAwesomeIcon icon={faHome} /> Bắc Yên, Sơn La
            </p>
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-section">
          <h4 className="footer-title">Liên kết nhanh</h4>
          <ul className="footer-links">
            <li>
              <Link to="/about">Về chúng tôi</Link>
            </li>
            <li>
              <Link to="/products">Sản phẩm</Link>
            </li>
            <li>
              <Link to="/policy">Chính sách bảo mật</Link>
            </li>
            <li>
              <Link to="/terms">Điều khoản sử dụng</Link>
            </li>
          </ul>
        </div>

        {/* Social Media */}
        <div className="footer-section">
          <h4 className="footer-title">Kết nối với chúng tôi</h4>
          <div className="social-icons">
            <a href="#" target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faFacebook} />
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faInstagram} />
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faYoutube} />
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faTiktok} />
            </a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="footer-bottom">
        <p>© 2025 YourShop. DucVinh_Dev</p>
      </div>
    </footer>
  );
}

export default Footer;
