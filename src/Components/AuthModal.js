import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./AuthModal.scss";

function AuthModal({ show, onClose }) {
  const navigate = useNavigate();

  if (!show) return null;

  return (
    <div className="auth-modal-overlay">
      <div className="auth-modal">
        <h3>Bạn cần đăng nhập</h3>
        <p>Vui lòng đăng nhập hoặc đăng ký để tiếp tục</p>

        <div className="modal-actions">
          <button className="btn-login" onClick={() => navigate("/login")}>
            Đăng nhập
          </button>
          <button
            className="btn-register"
            onClick={() => navigate("/register")}
          >
            Đăng ký
          </button>
          <button className="btn-cancel" onClick={onClose}>
            Hủy bỏ
          </button>
        </div>
      </div>
    </div>
  );
}

export default AuthModal;
