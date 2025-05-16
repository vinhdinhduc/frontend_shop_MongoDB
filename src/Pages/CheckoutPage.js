// CheckoutPage.jsx
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Footer from "../Components/Footer";
import "./CheckoutPage.scss";
import { faMessage, faRocket } from "@fortawesome/free-solid-svg-icons";
import { Navigate, useNavigate } from "react-router-dom";

const CheckoutPage = () => {
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [voucher, setVoucher] = useState("");
  const navigate = useNavigate();

  // Dữ liệu mẫu
  const address = {
    name: "Đức Vình",
    phone: "(+84) 349229870",
    fullAddress:
      "Xóm trọ Quỳnh anh, Bản Dửn, xã Chiềng Ngần, TP.Sơn La, Sơn La",
  };

  const products = [
    {
      id: 1,
      name: "Quần Jean Đen Nam Ống rộng",
      variant: "TOJ50000_Den.34",
      price: 149000,
      quantity: 1,
      insurance: 1199,
    },
  ];

  const shippingFee = 428700;
  const total =
    products.reduce((sum, p) => sum + p.price * p.quantity, 0) + shippingFee;

  return (
    <>
      <div className="checkout-page">
        <header className="checkout-header">
          <h1>
            <span onClick={() => navigate("/")}>Shop sale </span>| Thanh Toán
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
            <div key={product.id} className="product-item">
              <div className="product-info">
                <h3>{product.name}</h3>
                <div className="variant">Loại: {product.variant}</div>
                <div className="insurance">
                  <span>Bảo hiểm Thời trang</span>
                  <span>₫{product.insurance.toLocaleString()}</span>
                </div>
              </div>

              <div className="price-info">
                <div className="price-row">
                  <span>Đơn giá</span>
                  <span>₫{product.price.toLocaleString()}</span>
                </div>
                <div className="price-row">
                  <span>Số lượng</span>
                  <span>{product.quantity}</span>
                </div>
                <div className="price-row total">
                  <span>Thành tiền</span>
                  <span>
                    ₫{(product.price * product.quantity).toLocaleString()}
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
          <button className="order-btn">Đặt hàng</button>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default CheckoutPage;
