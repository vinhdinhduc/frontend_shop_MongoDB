import React from "react";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";
import "./Cart.scss";

const Cart = () => {
  const { cartItems, removeFromCart, clearCart } = useCart();
  console.log("🔍 [Cart page] cartItems:", cartItems);

  const calculateTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.productId.pricing * item.quantity,
      0
    );
  };

  return (
    <div className="cart-page">
      <h1>Giỏ hàng của bạn</h1>

      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <p>Giỏ hàng trống</p>
          <Link to="/products" className="continue-shopping">
            Tiếp tục mua sắm
          </Link>
        </div>
      ) : (
        <div className="cart-content">
          <div className="cart-items">
            {cartItems.map((item) => (
              <div key={item._id} className="cart-item">
                <div className="item-image">
                  <img
                    src={item.productId.images?.[0] || "/fallback.jpg"}
                    alt={item.productId.title}
                  />
                </div>

                <div className="item-details">
                  <h3>{item.productId.title}</h3>
                  <div className="item-meta">
                    <p>
                      Màu: <span>{item.color}</span>
                    </p>
                    <p>
                      Size: <span>{item.size}</span>
                    </p>
                    <p>
                      Số lượng: <span>{item.quantity}</span>
                    </p>
                    <p className="price">
                      {item.productId.pricing.toLocaleString()}₫/sản phẩm
                    </p>
                  </div>
                </div>

                <div className="item-actions">
                  <button
                    className="remove-btn"
                    onClick={() => removeFromCart(item._id)}
                  >
                    Xóa
                  </button>
                  <p className="item-total">
                    Tổng:{" "}
                    {(item.productId.pricing * item.quantity).toLocaleString()}₫
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h2>Tổng thanh toán</h2>
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

            <div className="cart-buttons">
              <button className="clear-cart" onClick={clearCart}>
                Xóa giỏ hàng
              </button>
              <Link to="/checkout" className="checkout-btn">
                Thanh toán
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
