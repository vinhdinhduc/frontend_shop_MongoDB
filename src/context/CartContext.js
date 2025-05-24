import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";
import { toast } from "react-toastify";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [] }); // Khởi tạo cart với items là mảng rỗng
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, token } = useAuth();

  // Đưa hàm fetchCartFromServer ra ngoài useEffect
  const fetchCartFromServer = async () => {
    setLoading(true);
    try {
      if (!user || !token) {
        setCart({ items: [] }); // Cập nhật cả cart khi không có user hoặc token
        return;
      }
      const res = await axios.get(
        `http://localhost:8080/api/cart/${user._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("Dữ liệu trả về từ API:", res.data);
      setCart(res.data || { items: [] }); // Gán cho cart
      console.log("[CartContext] Fetched cart:", res.data);
    } catch (error) {
      console.error("[CartContext] Lỗi khi lấy giỏ hàng:", error);
      toast.error("Không thể lấy giỏ hàng");
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartFromServer();
  }, [user, token]);
  const updateQuantity = async (productId, newQuantity) => {
    try {
      await axios.put(
        `http://localhost:8080/api/cart/${user._id}/${productId}`,
        { quantity: newQuantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCart((prev) => ({
        ...prev,
        items: prev.items.map((item) =>
          item.productId._id === productId
            ? { ...item, quantity: newQuantity }
            : item
        ),
      }));
    } catch (error) {
      toast.error("Cập nhật số lượng thất bại");
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    try {
      await axios.post(
        `http://localhost:8080/api/cart`,
        { productId, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Sau khi thêm thành công, gọi lại fetchCartFromServer để cập nhật giỏ hàng
      fetchCartFromServer();
      toast.success("Thêm vào giỏ hàng thành công", { position: "top-center" });
    } catch (error) {
      console.error("Lỗi khi thêm vào giỏ hàng:", error);
      setError(error.message);
      toast.error("Không thể thêm vào giỏ hàng");
    }
  };

  const removeFromCart = async (productId) => {
    try {
      await axios.delete(
        `http://localhost:8080/api/cart/${user._id}/${productId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Sau khi xóa thành công, gọi lại fetchCartFromServer để cập nhật giỏ hàng
      fetchCartFromServer();
    } catch (error) {
      console.error("Lỗi khi xóa khỏi giỏ hàng:", error);
      setError(error.message);
      toast.error("Không thể xóa khỏi giỏ hàng");
    }
  };

  const clearCart = () => {
    setCart({ items: [] });
  };

  const value = {
    cart,
    loading,
    error,
    addToCart,
    removeFromCart,
    clearCart,
    updateQuantity,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  return useContext(CartContext);
};
