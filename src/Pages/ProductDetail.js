import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./ProductDetail.scss";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

function ProductDetail() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/products/${productId}`
        );
        setProduct(response.data);
      } catch (err) {
        setError("Không thể tải thông tin sản phẩm");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleAddToCart = () => {
    if (!isLoggedIn) {
      alert("Vui lòng đăng nhập để thêm vào giỏ hàng");
      return;
    }

    if (!selectedColor || !selectedSize) {
      alert("Vui lòng chọn đầy đủ thông tin sản phẩm");
      return;
    }

    addToCart({
      ...product,
      selectedColor,
      selectedSize,
      quantity,
    });
  };

  if (loading) return <div className="loading">Đang tải...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="product-detail">
      {/* Product Images */}
      <div className="product-gallery">
        <div className="main-image">
          <img src={product.images[0]} alt={product.title} />
        </div>
        <div className="thumbnail-list">
          {product.images.map((img, index) => (
            <img key={index} src={img} alt={`Thumbnail ${index + 1}`} />
          ))}
        </div>
      </div>

      {/* Product Info */}
      <div className="product-info">
        <h1 className="product-title">{product.title}</h1>
        <div className="product-sku">SKU: {product.sku}</div>
        <div className="product-price">{product.pricing.toLocaleString()}₫</div>

        {/* Attributes */}
        <div className="product-attributes">
          <div className="attribute">
            <label>Màu sắc:</label>
            <div className="color-selector">
              {product.attributes.map((attr, index) => (
                <button
                  key={index}
                  className={`color-option ${
                    selectedColor === attr.color ? "active" : ""
                  }`}
                  style={{ backgroundColor: attr.color }}
                  onClick={() => setSelectedColor(attr.color)}
                  title={attr.color}
                />
              ))}
            </div>
          </div>

          <div className="attribute">
            <label>Kích thước:</label>
            <div className="size-selector">
              {product.attributes.map((attr, index) => (
                <button
                  key={index}
                  className={`size-option ${
                    selectedSize === attr.size ? "active" : ""
                  }`}
                  onClick={() => setSelectedSize(attr.size)}
                  disabled={attr.stock === 0}
                >
                  {attr.size}
                  {attr.stock === 0 && (
                    <span className="sold-out">Hết hàng</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="quantity-selector">
            <label>Số lượng:</label>
            <input
              type="number"
              min="1"
              max={product.quantity}
              value={quantity}
              onChange={(e) =>
                setQuantity(
                  Math.max(1, Math.min(product.quantity, e.target.value))
                )
              }
            />
            <span className="stock">Còn lại: {product.quantity}</span>
          </div>
        </div>

        <button
          className="add-to-cart-btn"
          onClick={handleAddToCart}
          disabled={product.quantity === 0}
        >
          {product.quantity === 0 ? "Hết hàng" : "Thêm vào giỏ hàng"}
        </button>

        {/* Product Specifications */}
        <div className="product-specs">
          <h2>Thông số kỹ thuật</h2>
          <div className="spec-item">
            <span>Danh mục:</span>
            <span>{product.category}</span>
          </div>
          <div className="spec-item">
            <span>Thương hiệu:</span>
            <span>{product.brand}</span>
          </div>
          <div className="spec-item">
            <span>Model:</span>
            <span>{product.manufacture_details.model_number}</span>
          </div>
          <div className="spec-item">
            <span>Ngày phát hành:</span>
            <span>
              {new Date(
                product.manufacture_details.release_date
              ).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Shipping Details */}
        <div className="shipping-details">
          <h2>Thông tin vận chuyển</h2>
          <div className="detail-grid">
            <div className="detail-item">
              <span>Trọng lượng:</span>
              <span>{product.shipping_details.weight} kg</span>
            </div>
            <div className="detail-item">
              <span>Kích thước:</span>
              <span>
                {product.shipping_details.width} x{" "}
                {product.shipping_details.height} x{" "}
                {product.shipping_details.depth} cm
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
