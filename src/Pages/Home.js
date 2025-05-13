import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Home.scss";
import Header from "../Components/Headers";
import Footer from "../Components/Footer";

function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          axios.get("http://localhost:8080/api/products"),
          axios.get("http://localhost:8080/api/categories"),
        ]);
        setProducts(productsRes.data);
        setCategories(categoriesRes.data);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <Header />
      <div className="home-page">
        {/* Hero Banner */}
        <section className="hero-banner">
          <div className="hero-content">
            <h1>Chào mừng bạn đến với Shop của chúng tôi!</h1>
            <p>Ưu đãi giảm giá cực lớn mùa hè này!</p>
            <Link to="/products" className="cta-button">
              Khám phá ngay
            </Link>
          </div>
        </section>

        {/* Categories Section */}
        <section className="categories-section">
          <h2 className="section-title">Danh mục nổi bật</h2>
          <div className="categories-grid">
            {categories.map((category) => (
              <Link
                to={`/products?category=${category.name}`}
                key={category._id}
                className="category-card"
              >
                <img src={category.image} alt={category.name} />
                <h3>{category.name}</h3>
              </Link>
            ))}
          </div>
        </section>

        {/* Featured Products */}
        <section className="featured-products">
          <h2 className="section-title">Sản phẩm nổi bật</h2>
          <div className="products-grid">
            {products.map((product) => (
              <div key={product._id} className="product-card">
                <Link to={`/product/${product._id}`}>
                  <img src={product.image} alt={product.name} />
                </Link>
                <div className="product-info">
                  <h3>{product.name}</h3>
                  <p className="brand">{product.brand}</p>
                  <p className="price">{product.price.toLocaleString()}₫</p>
                  <Link to={`/product/${product._id}`} className="detail-link">
                    Xem chi tiết
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Promotion Banner */}
        <section className="promotion-banner">
          <div className="promotion-content">
            <h2>Ưu đãi đặc biệt cho bạn!</h2>
            <p>Miễn phí vận chuyển cho đơn hàng từ 500.000₫</p>
            <Link to="/products" className="promo-button">
              Mua ngay
            </Link>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}

export default Home;
