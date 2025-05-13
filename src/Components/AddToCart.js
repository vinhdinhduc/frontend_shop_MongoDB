import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const AddToCart = ({ product }) => {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedAttribute, setSelectedAttribute] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    // Kiểm tra đăng nhập
    if (!user) {
      toast.info("Vui lòng đăng nhập để thêm vào giỏ hàng");
      navigate("/login");
      return;
    }

    // Validate lựa chọn
    if (!selectedColor || !selectedSize) {
      toast.error("Vui lòng chọn đầy đủ thông tin sản phẩm");
      return;
    }

    // Kiểm tra tồn kho
    const selectedAttribute = product.attributes.find(
      (attr) => attr.color === selectedColor && attr.size === selectedSize
    );

    if (!selectedAttribute || selectedAttribute.stock < 1) {
      toast.error("Sản phẩm đã hết hàng");
      return;
    }

    // Thêm vào giỏ hàng
    addToCart({
      id: `${product._id}-${selectedColor}-${selectedSize}`,
      product,
      color: selectedColor,
      size: selectedSize,
      quantity,
      price: product.pricing,
    });
  };

  return (
    <div className="add-to-cart-form">
      <div className="selection-group">
        <select
          value={selectedColor}
          onChange={(e) => setSelectedColor(e.target.value)}
          required
        >
          <option value="">Chọn màu</option>
          {[...new Set(product.attributes.map((attr) => attr.color))].map(
            (color) => (
              <option key={color} value={color}>
                {color}
              </option>
            )
          )}
        </select>

        <select
          value={selectedSize}
          onChange={(e) => setSelectedSize(e.target.value)}
          required
        >
          <option value="">Chọn size</option>
          {[...new Set(product.attributes.map((attr) => attr.size))].map(
            (size) => (
              <option key={size} value={size}>
                {size}
              </option>
            )
          )}
        </select>

        <input
          type="number"
          min="1"
          max={selectedAttribute?.stock || product.quantity}
          value={quantity}
          onChange={(e) =>
            setQuantity(
              Math.max(
                1,
                Math.min(
                  selectedAttribute?.stock || product.quantity,
                  Number(e.target.value)
                )
              )
            )
          }
        />
      </div>

      <button className="add-to-cart-button" onClick={handleAddToCart}>
        Thêm vào giỏ hàng
      </button>
    </div>
  );
};

export default AddToCart;
