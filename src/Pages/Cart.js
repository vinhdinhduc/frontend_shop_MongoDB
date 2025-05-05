import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import "./Cart.scss";
import fallbackImage from "../assets/image/fallback.jpg";

function Cart() {
  const { isLoggedIn } = useAuth();
  const { cartItems, updateQuantity, removeItem, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!isLoggedIn) {
      navigate("/login?redirect=/cart");
      return;
    }
    navigate("/checkout");
  };

  const calculateTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.product.pricing * item.quantity,
      0
    );
  };

  if (cartItems.length === 0) {
    return (
      <div className="empty-cart">
        <h2>Giỏ hàng trống</h2>
        <Link to="/products" className="continue-shopping">
          Tiếp tục mua sắm
        </Link>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h1 className="cart-title">Giỏ hàng của bạn</h1>

      <div className="cart-content">
        <div className="cart-items">
          {cartItems.map((item) => (
            <div key={item.product._id} className="cart-item">
              <div className="product-info">
                <img
                  src={item.product.images[0] || fallbackImage}
                  alt={item.product.title}
                  className="product-image"
                />
                <div className="product-details">
                  <h3 className="product-title">{item.product.title}</h3>
                  <p className="product-price">
                    {item.product.pricing.toLocaleString()}₫
                  </p>
                </div>
              </div>

              <div className="quantity-controls">
                <button
                  onClick={() =>
                    updateQuantity(item.product._id, item.quantity - 1)
                  }
                  disabled={item.quantity <= 1}
                >
                  -
                </button>
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) =>
                    updateQuantity(
                      item.product._id,
                      Math.max(1, e.target.value)
                    )
                  }
                />
                <button
                  onClick={() =>
                    updateQuantity(item.product._id, item.quantity + 1)
                  }
                >
                  +
                </button>
              </div>

              <div className="item-total">
                {(item.product.pricing * item.quantity).toLocaleString()}₫
              </div>

              <button
                className="remove-item"
                onClick={() => removeItem(item.product._id)}
              >
                ×
              </button>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h3>Tổng đơn hàng</h3>
          <div className="summary-row">
            <span>Tạm tính:</span>
            <span>{calculateTotal().toLocaleString()}₫</span>
          </div>
          <div className="summary-row">
            <span>Phí vận chuyển:</span>
            <span>Miễn phí</span>
          </div>
          <div className="summary-row total">
            <span>Tổng cộng:</span>
            <span>{calculateTotal().toLocaleString()}₫</span>
          </div>
          <button
            className="checkout-button"
            onClick={handleCheckout}
            disabled={loading}
          >
            {loading ? "Đang xử lý..." : "Tiến hành thanh toán"}
          </button>
          <button className="clear-cart" onClick={clearCart}>
            Xóa toàn bộ giỏ hàng
          </button>
        </div>
      </div>
    </div>
  );
}

export default Cart;
