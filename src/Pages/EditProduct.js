import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "./EditProduct.scss";

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    title: "",
    sku: "",
    category: "",
    pricing: "",
    quantity: "",
    description: "",
    brand: "",
    images: [], // File mới
    oldImages: [], // Ảnh cũ
    videos: [],
    attributes: [{ color: "", size: "", stock: "" }],
    manufacture_details: { model_number: "", release_date: "" },
    shipping_details: { weight: "", width: "", height: "", depth: "" },
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/products/${id}`);
        setProduct({
          ...res.data,
          oldImages: res.data.images || [],
          images: [],
          videos: [],
          manufacture_details: res.data.manufacture_details || {
            model_number: "",
            release_date: "",
          },
          shipping_details: res.data.shipping_details || {
            weight: "",
            width: "",
            height: "",
            depth: "",
          },
        });
      } catch (err) {
        console.error(err);
        toast.error("Không tải được dữ liệu sản phẩm");
      }
    };

    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setProduct({
        ...product,
        [parent]: { ...product[parent], [child]: value },
      });
    } else {
      setProduct({ ...product, [name]: value });
    }
  };

  const handleFileChange = (e, type) => {
    const files = Array.from(e.target.files);
    setProduct({ ...product, [type]: files });
  };

  const handleAttributeChange = (index, e) => {
    const { name, value } = e.target;
    const updatedAttributes = [...product.attributes];
    updatedAttributes[index][name] = value;
    setProduct({ ...product, attributes: updatedAttributes });
  };

  const addAttribute = () => {
    setProduct({
      ...product,
      attributes: [...product.attributes, { color: "", size: "", stock: "" }],
    });
  };

  const removeAttribute = (index) => {
    setProduct({
      ...product,
      attributes: product.attributes.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();

    Object.keys(product).forEach((key) => {
      if (key === "images" || key === "videos") {
        if (product[key].length > 0) {
          product[key].forEach((file) => formData.append(key, file));
        }
      } else if (
        key === "attributes" ||
        key === "manufacture_details" ||
        key === "shipping_details"
      ) {
        formData.append(key, JSON.stringify(product[key]));
      } else if (key !== "oldImages" && product[key] !== null ) {
        formData.append(key, product[key]);
      }
    });

    try {
      await axios.put(`http://localhost:8080/api/products/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Cập nhật sản phẩm thành công");
      navigate("/products");
    } catch (err) {
      console.error(err);
      toast.error("Cập nhật sản phẩm thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="edit-product">
      <h2>Sửa sản phẩm</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Tên sản phẩm</label>
          <input
            type="text"
            name="title"
            value={product.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>SKU</label>
          <input
            type="text"
            name="sku"
            value={product.sku}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Danh mục</label>
          <input
            type="text"
            name="category"
            value={product.category}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Giá</label>
          <input
            type="number"
            name="pricing"
            value={product.pricing}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Số lượng</label>
          <input
            type="number"
            name="quantity"
            value={product.quantity}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Ảnh sản phẩm hiện tại:</label>
          <div className="image-preview">
            {product.oldImages.map((img, index) => (
              <img
                key={index}
                src={`http://localhost:8080/uploads/${img}`}
                alt="preview"
                width="100"
                style={{ marginRight: "10px", objectFit: "cover" }}
              />
            ))}
          </div>
        </div>

        <div className="form-group">
          <label>Thay đổi hình ảnh mới</label>
          <input
            type="file"
            name="images"
            multiple
            accept="image/*"
            onChange={(e) => handleFileChange(e, "images")}
          />
        </div>

        <div className="form-group">
          <label>Video</label>
          <input
            type="file"
            name="videos"
            multiple
            accept="video/mp4"
            onChange={(e) => handleFileChange(e, "videos")}
          />
        </div>

        <div className="form-group">
          <label>Mô tả</label>
          <textarea
            name="description"
            value={product.description}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Thương hiệu</label>
          <input
            type="text"
            name="brand"
            value={product.brand}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Số model</label>
          <input
            type="text"
            name="manufacture_details.model_number"
            value={product.manufacture_details.model_number}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Ngày phát hành</label>
          <input
            type="date"
            name="manufacture_details.release_date"
            value={
              product.manufacture_details.release_date
                ? new Date(product.manufacture_details.release_date)
                    .toISOString()
                    .split("T")[0]
                : ""
            }
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Thuộc tính</label>
          {product.attributes.map((attr, index) => (
            <div key={index} className="attribute-group">
              <input
                type="text"
                name="color"
                placeholder="Màu sắc"
                value={attr.color}
                onChange={(e) => handleAttributeChange(index, e)}
              />
              <input
                type="text"
                name="size"
                placeholder="Kích thước"
                value={attr.size}
                onChange={(e) => handleAttributeChange(index, e)}
              />
              <input
                type="number"
                name="stock"
                placeholder="Số lượng"
                value={attr.stock}
                onChange={(e) => handleAttributeChange(index, e)}
              />
              <button
                type="button"
                onClick={() => removeAttribute(index)}
                className="remove-attribute"
              >
                Xóa
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addAttribute}
            className="add-attribute"
          >
            Thêm thuộc tính
          </button>
        </div>

        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? "Đang lưu..." : "Cập nhật sản phẩm"}
        </button>
      </form>
    </div>
  );
}

export default EditProduct;
