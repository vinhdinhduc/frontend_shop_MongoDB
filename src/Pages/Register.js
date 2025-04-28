import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";
import "./Register.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    //Validate
    if (formData.password !== formData.confirmPassword) {
      setError("Mật khẩu không khớp");
      setLoading(false);
      return;
    }
    try {
      const response = await axios.post(
        "http://localhost:8080/api/auth/register",
        {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }
      );

      console.log("API Response:", response.data); // Kiểm tra phản hồi từ API

      if (response.data.success) {
        login({
          ...response.data.user,
          token: response.data.token,
        });

        navigate("/login"); // Chuyển hướng đến trang chủ
        toast.success("Đăng kí thành công!", {
          position: "top-center",
        });
      }
    } catch (e) {
      console.error("Register error:", e);
      setError(e.response?.data?.message || "Đăng kí thất bại!");
    } finally {
      setLoading(false);
    }
  };

  const handleOnchage = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const handleShowHidePassword = () => {
    setShowPassword(!showPassword);
  };
  const handleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };
  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleSubmit}>
        <h2>Tạo tài khoản</h2>
        {error && <div className="error-message">{error}</div>}
        <div className="form-group">
          <label> Họ Và Tên</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleOnchage}
            placeholder="Nhập họ và tên"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="">Nhập Email</label>
          <input
            type="text"
            name="email"
            value={formData.email}
            onChange={handleOnchage}
            placeholder="Nhập email"
            required
          />
        </div>
        <div className="form-group password-input">
          <label htmlFor="">Nhập mật khẩu</label>
          <div className="input-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleOnchage}
              placeholder="Nhập mật khẩu"
              required
            />
            <FontAwesomeIcon
              icon={showPassword ? faEyeSlash : faEye}
              className="password-toggle"
              onClick={handleShowHidePassword}
            />
          </div>
        </div>
        <div className="form-group password-input">
          <label htmlFor="">Nhập lại mật khẩu</label>
          <div className="input-wrapper">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleOnchage}
              placeholder="Nhập lại mật khẩu"
              required
            />
            <FontAwesomeIcon
              icon={showConfirmPassword ? faEyeSlash : faEye}
              className="password-toggle"
              onClick={handleShowConfirmPassword}
            />
          </div>
        </div>
        <button className="register-button" type="submit" disabled={loading}>
          {loading ? "Đang xử lý" : "Đăng ký"}
        </button>
        <div className="login-link">
          Đã có tài khoản?<Link to="/login">Đăng nhập ngay</Link>
        </div>
      </form>
    </div>
  );
}

export default Register;
