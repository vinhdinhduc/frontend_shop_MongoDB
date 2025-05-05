import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faEyeSlash,
  faEnvelope,
  faLock,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { toast } from "react-toastify";
import "./Login.scss";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Basic validation
    if (!formData.email || !formData.password) {
      setError("Vui lòng điền đầy đủ thông tin");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8080/api/auth/login",
        formData
      );

      if (response.data.success) {
        login({
          ...response.data.user,
          token: response.data.token,
        });

        navigate("/");
        toast.success("Đăng nhập thành công!", {
          position: "top-center",
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || "Đăng nhập thất bại");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Đăng Nhập</h2>

        {error && <div className="error-message">{error}</div>}

        <div className="form-group">
          <label>
            Email <FontAwesomeIcon icon={faEnvelope} />
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Nhập email của bạn"
            required
          />
        </div>

        <div className="form-group password-input">
          <label>
            Mật khẩu <FontAwesomeIcon icon={faLock} />
          </label>
          <div className="input-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Nhập mật khẩu"
              required
            />

            <span className="password-toggle" onClick={handleShowPassword}>
              <FontAwesomeIcon icon={handleShowPassword ? faEyeSlash : faEye} />
            </span>
          </div>
        </div>

        <button type="submit" className="login-button" disabled={loading}>
          {loading ? "Đang xử lý..." : "Đăng Nhập"}
        </button>

        <div className="additional-options">
          <Link to="/forgot-password">Quên mật khẩu?</Link>
          <span>
            Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
          </span>
        </div>
      </form>
    </div>
  );
}

export default Login;
