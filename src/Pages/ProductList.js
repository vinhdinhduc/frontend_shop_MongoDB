import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import Header from "../Components/Headers";
import fallback from "../assets/image/fallback.jpg";
import "./ProductList.scss";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [error, setError] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [deletedProductsCount, setDeletedProductsCount] = useState(0);
  const [selectAll, setSelectAll] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    brand: "",
    minPrice: "",
    maxPrice: "",
    color: "",
    size: "",
    stockStatus: "",
  });
  const [sort, setSort] = useState("");

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = new URLSearchParams({
          ...filters,
          sort,
        }).toString();
        const [productsRes, trashCountRes] = await Promise.all([
          axios.get(`http://localhost:8080/api/products?${params}`),
          axios.get("http://localhost:8080/api/products/trash"),
        ]);

        setProducts(productsRes.data.filter((p) => !p.deleted));
        setDeletedProductsCount(trashCountRes.data.count);
      } catch (err) {
        setError("Không thể tải dữ liệu");
        toast.error("Lỗi kết nối server");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filters, sort]);

  const handleDeleteProduct = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
      try {
        await axios.put(`http://localhost:8080/api/products/soft-delete/${id}`);
        setProducts(products.filter((p) => p._id !== id));
        setDeletedProductsCount((prev) => prev + 1);
        toast.success("Đã chuyển vào thùng rác");
      } catch (error) {
        toast.error("Xóa thất bại");
      }
    }
  };

  const handleSelectProduct = (id) => {
    setSelectedProducts((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    const newSelected = selectAll ? [] : products.map((p) => p._id);
    setSelectedProducts(newSelected);
    setSelectAll(!selectAll);
  };

  const handleSoftDeleteSelected = async () => {
    if (selectedProducts.length === 0) {
      toast.warn("Vui lòng chọn ít nhất một sản phẩm");
      return;
    }

    if (window.confirm(`Xóa ${selectedProducts.length} sản phẩm đã chọn?`)) {
      try {
        await axios.put(
          "http://localhost:8080/api/products/soft-delete-multiple",
          {
            ids: selectedProducts,
          }
        );

        setProducts((prev) =>
          prev.filter((p) => !selectedProducts.includes(p._id))
        );
        setDeletedProductsCount((prev) => prev + selectedProducts.length);
        setSelectedProducts([]);
        setSelectAll(false);
        toast.success(`Đã xóa ${selectedProducts.length} sản phẩm`);
      } catch (error) {
        toast.error("Xóa hàng loạt thất bại");
      }
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  if (loading) return <div className="loading">Đang tải sản phẩm...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <>
      <Header />
      <div className="product-list">
        {user?.role === "admin" && (
          <div className="admin-controls">
            <div className="action-buttons">
              <button
                className="btn-primary"
                onClick={() => navigate("/add-product")}
              >
                <i className="fas fa-plus"></i> Thêm mới
              </button>
              <button
                className="btn-danger"
                onClick={handleSoftDeleteSelected}
                disabled={selectedProducts.length === 0}
              >
                <i className="fas fa-trash-alt"></i> Xóa đã chọn
              </button>
              <button
                className="btn-secondary"
                onClick={() => navigate("/trash")}
              >
                <i className="fas fa-trash-restore"></i> Thùng rác (
                {deletedProductsCount})
              </button>
            </div>
            <div className="selection-control">
              <label>
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={handleSelectAll}
                />
                Chọn tất cả
              </label>
              <span className="selected-count">
                {selectedProducts.length} đã chọn
              </span>
            </div>
          </div>
        )}

        <div className="filter-section">
          <div className="filter-grid">
            <input
              type="text"
              name="search"
              placeholder="Tìm theo tên..."
              value={filters.search}
              onChange={handleFilterChange}
            />
            <select
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
            >
              <option value="">Tất cả danh mục</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
            <select
              name="brand"
              value={filters.brand}
              onChange={handleFilterChange}
            >
              <option value="">Tất cả thương hiệu</option>
              {brands.map((brand) => (
                <option key={brand._id} value={brand.name}>
                  {brand.name}
                </option>
              ))}
            </select>

            <input
              type="number"
              name="minPrice"
              placeholder="Giá từ"
              value={filters.minPrice}
              onChange={handleFilterChange}
            />
            <input
              type="number"
              name="maxPrice"
              placeholder="Đến giá"
              value={filters.maxPrice}
              onChange={handleFilterChange}
            />
            <input
              type="text"
              name="color"
              placeholder="Màu sắc"
              value={filters.color}
              onChange={handleFilterChange}
            />
            <input
              type="text"
              name="size"
              placeholder="Kích thước"
              value={filters.size}
              onChange={handleFilterChange}
            />
            <select
              name="stockStatus"
              value={filters.stockStatus}
              onChange={handleFilterChange}
            >
              <option value="">Tình trạng</option>
              <option value="inStock">Còn hàng</option>
              <option value="outOfStock">Hết hàng</option>
            </select>
          </div>
          <div className="sort-section">
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="">Sắp xếp theo</option>
              <option value="priceAsc">Giá: Thấp đến cao</option>
              <option value="priceDesc">Giá: Cao đến thấp</option>
            </select>
          </div>
        </div>

        <div className="product-grid">
          {products.map((product) => (
            <div
              key={product._id}
              className={`product-card ${
                selectedProducts.includes(product._id) ? "selected" : ""
              }`}
            >
              {user?.role === "admin" && (
                <div className="selection-overlay">
                  <input
                    type="checkbox"
                    checked={selectedProducts.includes(product._id)}
                    onChange={() => handleSelectProduct(product._id)}
                  />
                </div>
              )}
              <div className="product-media">
                <img
                  src={
                    `http://localhost:8080${product.images?.[0]}` || fallback
                  }
                  alt={product.title}
                  onError={(e) => (e.target.src = fallback)}
                />
                {product.quantity <= 0 && (
                  <div className="stock-badge">HẾT HÀNG</div>
                )}
              </div>
              <div className="product-info">
                <h3>{product.title}</h3>
                <div className="meta-info">
                  <span className="sku">SKU: {product.sku}</span>
                  <span className="category">{product.category}</span>
                </div>
                <div className="price-section">
                  <span className="price">
                    {product.pricing.toLocaleString()}₫
                  </span>
                  <span className="stock">Tồn kho: {product.quantity}</span>
                </div>
                <div className="action-buttons">
                  <Link to={`/products/${product._id}`} className="btn-detail">
                    <i className="fas fa-eye"></i> Chi tiết
                  </Link>
                  {user?.role === "admin" && (
                    <>
                      <button
                        className="btn-edit"
                        onClick={() =>
                          navigate(`/products/edit/${product._id}`)
                        }
                      >
                        <i className="fas fa-edit"></i> Sửa
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => handleDeleteProduct(product._id)}
                      >
                        <i className="fas fa-trash-alt"></i> Xóa
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default ProductList;
