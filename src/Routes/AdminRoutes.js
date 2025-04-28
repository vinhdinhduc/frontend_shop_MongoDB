import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminRoute = ({ children }) => {
  const { user } = useAuth();

  // Kiểm tra nếu người dùng không phải admin
  if (!user || user.role !== "admin") {
    return <Navigate to="/" replace />; // Chuyển hướng về trang chủ
  }

  return children; // Hiển thị nội dung nếu là admin
};

export default AdminRoute;