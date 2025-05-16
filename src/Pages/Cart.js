import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import "./Cart.scss";

const Cart = () => {
  console.log("Cart component rendered");
  const { user } = useAuth();
  const { cart, removeFromCart, clearCart } = useCart();
  console.log("cart=======:", cart);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const navigate = useNavigate();
  // Xử lý chọn từng sản phẩm
  const handleSelectItem = (productId) => {
    setSelectedItems((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };
  const handleBuyNow = () => {
    if (selectedItems.length === 0) {
      alert("Vui lòng chọn ít nhất một sản phẩm để mua");
      return;
    }
    navigate("/checkout", {
      state: { selectedItems },
    });
  };

  // Xử lý chọn tất cả
  const handleSelectAll = () => {
    if (!cart?.items) return;
    if (selectAll) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cart.items.map((item) => item.productId._id));
    }
    setSelectAll(!selectAll);
  };

  // Tính tổng số sản phẩm đã chọn
  const totalItems = selectedItems.length;

  // Tính tổng tiền các sản phẩm đã chọn
  const totalAmount =
    cart?.items
      ?.filter((item) => selectedItems.includes(item.productId._id))
      ?.reduce(
        (sum, item) => sum + item.productId.pricing * item.quantity,
        0
      ) || 0;

  // Xử lý thay đổi số lượng
  const handleQuantityChange = (productId, e) => {};

  // if (loading) return <div>Đang tải giỏ hàng...</div>;
  // if (error) return <div className="error">{error}</div>;

  return (
    <div className="cart-page">
      <header className="cart-header">
        <h1>
          <span onClick={() => navigate(-1)}>Shop Sale</span> | Giỏ hàng
        </h1>
      </header>

      <div className="cart-container">
        <section className="product-list">
          {cart?.items?.map((item) => {
            console.log("Item:", item);
            return (
              <div key={item.productId._id} className="product-item">
                <div className="product-select">
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item.productId._id)}
                    onChange={() => handleSelectItem(item.productId._id)}
                  />
                </div>

                <div className="product-info">
                  <h4>{item.productId?.title || "Không có tiêu đề"}</h4>
                  <div className="product-type">
                    Phân loại: {item?.attributes || "Không có phân loại"}
                  </div>
                </div>

                <div className="product-actions">
                  <div className="price">
                    ₫{item.productId?.pricing?.toLocaleString()}
                  </div>
                  <div className="quantity">
                    Số lượng:{" "}
                    <input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(e) =>
                        handleQuantityChange(item.productId._id, e)
                      }
                    />
                  </div>
                  <button
                    className="delete-btn"
                    onClick={() => removeFromCart(item.productId._id)}
                  >
                    Xóa
                  </button>
                </div>
              </div>
            );
          })}
        </section>
        {/* Cart Summary */}
        <section className="cart-summary">
          <div className="summary-header">
            <div className="select-all">
              <input
                type="checkbox"
                checked={selectAll}
                onChange={handleSelectAll}
              />
              <span>Chọn Tất Cả ({cart?.items?.length || 0})</span>
            </div>
            <div className="action-buttons">
              <button>Xóa</button>
              <button>Lưu vào mục Đã thích</button>
            </div>
          </div>

          <div className="total-section">
            <div className="total-info">
              <span>Tổng cộng ({totalItems} Sản phẩm):</span>
              <span className="total-amount">
                ₫{totalAmount.toLocaleString()}
              </span>
            </div>
            <button className="checkout-btn" onClick={handleBuyNow}>
              Mua Hàng
            </button>
          </div>

          <div className="coupon-section">
            <input placeholder="Chọn hoặc nhập mã" />
            <button>Áp dụng</button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Cart;
