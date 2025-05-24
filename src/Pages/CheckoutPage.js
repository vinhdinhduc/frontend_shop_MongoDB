// CheckoutPage.jsx
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Footer from "../Components/Footer";
import "./CheckoutPage.scss";
import { faMessage, faRocket } from "@fortawesome/free-solid-svg-icons";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import axios from "axios";

const CheckoutPage = () => {
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [voucher, setVoucher] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();

  const address = {
    name: "Nguyễn Văn A",
    phone: "0123456789",
    fullAddress: "123 Đường ABC, Quận 1, TP.HCM",
  };
  const handlePlaceOrder = async () => {
    try {
      setLoading(true);
      const orderData = {
        userId: user._id,
        products: cart.items,
        shippingAddress: address.fullAddress,
        paymentMethod,
        totalAmount: total,
        voucherCode: voucher,
      };

      const response = await axios.post(
        "http://localhost:8080/api/orders",
        orderData,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      clearCart();
      toast.success("Đặt hàng thành công!");
    } catch (error) {
      toast.error("Đặt hàng thất bại : " + error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const shippingFee = 428700; // Hoặc lấy từ API
  const total =
    cart.items.reduce(
      (sum, item) => sum + item.productId.pricing * item.quantity,
      0
    ) + shippingFee;

  const products = cart.items;

  return (
    <>
      <div className="checkout-page">
        <header className="checkout-header">
          <h1>
            <span onClick={() => navigate(-1)}>Shop sale </span>| Thanh Toán
          </h1>
        </header>

        {/* Phần địa chỉ */}
        <section className="address-section">
          <div className="address-header">
            <h2>Địa Chỉ Nhận Hàng</h2>
            <button className="change-btn">Thay Đổi</button>
          </div>
          <div className="address-info">
            <p>
              <strong>
                {address.name} {address.phone}
              </strong>
            </p>
            <p>{address.fullAddress}</p>
          </div>
        </section>

        {/* Danh sách sản phẩm */}
        <section className="product-section">
          <div className="shop-header">
            <span>DRAGON STUDIO</span>
            <button className="chat-btn">
              Chat ngay <FontAwesomeIcon icon={faMessage} />
            </button>
          </div>

          {products.map((product) => (
            <div key={product.productId._id} className="product-item">
              <div className="product-info">
                <h3>{product.productId.title}</h3>
                <div className="variant">Loại: a</div>
                <div className="insurance">
                  <span>Bảo hiểm Thời trang</span>
                  <span>2000đ</span>
                </div>
              </div>

              <div className="price-info">
                <div className="price-row">
                  <span>Đơn giá</span>
                  <span>
                    ₫{product.productId.pricing.toLocaleString() || "0"}
                  </span>
                </div>
                <div className="price-row">
                  <span>Số lượng</span>
                  <span>{product.quantity}</span>
                </div>
                <div className="price-row total">
                  <span>Thành tiền</span>
                  <span>
                    ₫
                    {(
                      product.productId.pricing * product.quantity
                    ).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* Voucher và phương thức thanh toán */}
        <section className="payment-section">
          <div className="voucher-section">
            <input
              type="text"
              placeholder="Nhập mã Voucher"
              value={voucher}
              onChange={(e) => setVoucher(e.target.value)}
            />
            <button className="apply-btn">Áp dụng</button>
          </div>

          <div className="payment-methods">
            <label className={paymentMethod === "cod" ? "active" : ""}>
              <input
                type="radio"
                name="payment"
                value="cod"
                checked={paymentMethod === "cod"}
                onChange={() => setPaymentMethod("cod")}
              />
              Thanh toán khi nhận hàng
            </label>
          </div>
        </section>

        {/* Tổng kết */}
        <section className="summary-section">
          <div className="summary-row">
            <span>Tổng tiền hàng</span>
            <span>₫{total.toLocaleString()}</span>
          </div>
          <div className="summary-row">
            <span>Phí vận chuyển</span>
            <span>₫{shippingFee.toLocaleString()}</span>
          </div>
          <div className="summary-row total">
            <span>Tổng thanh toán</span>
            <span>₫{total.toLocaleString()}</span>
          </div>

          <div className="terms">
            Nhấn "Đặt hàng" đồng nghĩa với việc bạn đồng ý tuân theo{" "}
            <a href="/">Điều khoản của chúng tôi</a>
          </div>
          <button
            className="order-btn"
            onClick={handlePlaceOrder}
            disabled={loading}
          >
            {loading ? "Đang xử lý" : "Đặt hàng"}
          </button>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default CheckoutPage;
