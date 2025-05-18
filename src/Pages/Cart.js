import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import "./Cart.scss";

const Cart = () => {
  const { user } = useAuth();
  const { cart, removeFromCart } = useCart();
  const [selectAll, setSelectAll] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const navigate = useNavigate();

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
    navigate("/checkout", { state: { selectedItems } });
  };

  const handleSelectAll = () => {
    if (!cart?.items) return;
    if (selectAll) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cart.items.map((item) => item.productId._id));
    }
    setSelectAll(!selectAll);
  };

  const totalItems = selectedItems.length;
  const totalAmount =
    cart?.items
      ?.filter((item) => selectedItems.includes(item.productId._id))
      ?.reduce(
        (sum, item) => sum + item.productId.pricing * item.quantity,
        0
      ) || 0;

  return (
    <div className="cart">
      <header className="cart__header">
        <h1>
          <span onClick={() => navigate(-1)}>Shop Sale</span> | Giỏ hàng
        </h1>
      </header>

      <div className="cart__container">
        <section className="cart__products">
          <div className="cart__products-list">
            {cart?.items?.map((item) => (
              <div key={item.productId._id} className="cart__product">
                <div className="cart__product-select">
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item.productId._id)}
                    onChange={() => handleSelectItem(item.productId._id)}
                  />
                </div>

                <div className="cart__product-info">
                  <h4>{item.productId?.title || "Không có tiêu đề"}</h4>
                  <div className="cart__product-type">
                    Phân loại: {item?.attributes || "Không có phân loại"}
                  </div>
                </div>

                <div className="cart__product-actions">
                  <div className="cart__product-price">
                    ₫{item.productId?.pricing?.toLocaleString()}
                  </div>
                  <div className="cart__product-quantity">
                    Số lượng:{" "}
                    <input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(e) => console.log("Change quantity")}
                    />
                  </div>
                  <button
                    className="cart__product-delete"
                    onClick={() => removeFromCart(item.productId._id)}
                  >
                    Xóa
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="cart__summary">
          <div className="cart__summary-header">
            <div className="cart__summary-select-all">
              <input
                type="checkbox"
                checked={selectAll}
                onChange={handleSelectAll}
              />
              <span>Chọn Tất Cả ({cart?.items?.length || 0})</span>
            </div>
            <div className="cart__summary-actions">
              <button>Xóa</button>
              <button>Lưu vào mục Đã thích</button>
            </div>
          </div>

          <div className="cart__summary-total">
            <div className="cart__summary-row">
              <span>Tổng cộng ({totalItems} Sản phẩm):</span>
              <span className="cart__summary-amount">
                ₫{totalAmount.toLocaleString()}
              </span>
            </div>
            <button className="cart__summary-checkout" onClick={handleBuyNow}>
              Mua Hàng
            </button>
          </div>

          <div className="cart__summary-coupon">
            <input placeholder="Chọn hoặc nhập mã" />
            <button>Áp dụng</button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Cart;
