import "./ProductList.scss";
import axios from "axios";

import React, { useState, useEffect } from "react";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fakeProducts = [
      {
        id: 1,
        name: "Sản phẩm 1",
        price: 500000,
        image: "https://via.placeholder.com/150",
      },
      {
        id: 2,
        name: "Sản phẩm 2",
        price: 750000,
        image: "https://via.placeholder.com/150",
      },
    ];
    setProducts(fakeProducts);
    setLoading(false);
  }, []);
  if (loading) return <div>Đang tải...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="product-list">
      {products.map((product) => (
        <div key={product.id} className="product-item">
          <img src={product.image} alt={product.name} />
          <h3>{product.name}</h3>
          <p>{product.price} VNĐ</p>
          <button>Xem chi tiết</button>
        </div>
      ))}
    </div>
  );
}

export default ProductList;
