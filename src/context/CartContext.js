// CartContext.js - không dùng reducer, dùng state thuần và load giỏ hàng từ backend
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const { user, token } = useAuth();

  const fetchCartFromServer = async () => {
    if (!user?._id || !token) return;

    try {
      const res = await axios.get(
        `http://localhost:8080/api/cart/${user._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCartItems(res.data.items || []);
      console.log("[CartContext] Fetched from server:", res.data.items);
    } catch (error) {
      console.error("[CartContext] Lỗi khi lấy giỏ hàng:", error);
      toast.error("Không thể lấy giỏ hàng");
    }
  };

  useEffect(() => {
    if (user && token) {
      fetchCartFromServer();
    }
  }, [user, token]);

  const addToCart = async (productId, quantity = 1) => {
    if (!user?._id || !token) {
      toast.warn("Vui lòng đăng nhập trước");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:8080/api/cart",
        { productId, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Đã thêm vào giỏ hàng");
      fetchCartFromServer();
    } catch (error) {
      console.error("[CartContext] Lỗi khi thêm:", error);
      toast.error("Không thể thêm vào giỏ hàng");
    }
  };

  const removeFromCart = (productId) => {
    setCartItems((prev) => prev.filter((item) => item.productId !== productId));
    toast.info("Đã xóa sản phẩm");
  };

  const clearCart = () => {
    setCartItems([]);
    toast.info("Đã xóa toàn bộ giỏ hàng");
  };

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
