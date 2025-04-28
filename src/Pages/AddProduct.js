import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "./AddProduct.scss";

function AddProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [product, setProduct] = useState({
    title: "",
    sku: "",
    category: "",
    pricing: "",
    quantity: "",
    description: "",
    brand: "",
    images: [],
    videos: [],
    attributes: [{ color: "", size: "", stock: "" }],
    manufacture_details: { model_number: "", release_date: "" },
    shipping_details: { weight: "", width: "", height: "", depth: "" },
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      const fetchProduct = async () => {
        try {
          const response = await axios.get(
            `http://localhost:8080/api/products/${id}`
          );
          setProduct({
            ...response.data,
            manufacture_details: response.data.manufacture_details || {
              model_number: "",
              release_date: "",
            },
            shipping_details: response.data.shipping_details || {
              weight: "",
              width: "",
              height: "",
              depth: "",
            },
          });
        } catch (error) {
          toast.error("Không thể tải dữ liệu sản phẩm");
        }
      };
      fetchProduct();
    }
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
    const newAttributes = [...product.attributes];
    newAttributes[index] = { ...newAttributes[index], [name]: value };
    setProduct({ ...product, attributes: newAttributes });
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
        product[key].forEach((file) => formData.append(key, file));
      } else if (
        key === "attributes" ||
        key === "manufacture_details" ||
        key === "shipping_details"
      ) {
        formData.append(key, JSON.stringify(product[key]));
      } else {
        formData.append(key, product[key]);
      }
    });

    console.log("FormData:", [...formData.entries()]);

    try {
      if (isEditMode) {
        await axios.put(`http://localhost:8080/api/products/${id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Cập nhật sản phẩm thành công");
      } else {
        await axios.post("http://localhost:8080/api/products", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Thêm sản phẩm thành công");
      }
      navigate("/products");
    } catch (error) {
      console.error(
        "Lỗi khi thêm sản phẩm:",
        error.response?.data || error.message
      );
      const errorMessage =
        error.response?.data?.message || "Thêm sản phẩm thất bại";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-product">
      <h2>{isEditMode ? "Sửa sản phẩm" : "Thêm sản phẩm"}</h2>
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
          <label>Hình ảnh</label>
          <input
            type="file"
            name="images"
            multiple
            accept="image/jpeg,image/png"
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
          <label>Trọng lượng (kg)</label>
          <input
            type="number"
            name="shipping_details.weight"
            value={product.shipping_details.weight}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Chiều rộng (cm)</label>
          <input
            type="number"
            name="shipping_details.width"
            value={product.shipping_details.width}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Chiều cao (cm)</label>
          <input
            type="number"
            name="shipping_details.height"
            value={product.shipping_details.height}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Chiều sâu (cm)</label>
          <input
            type="number"
            name="shipping_details.depth"
            value={product.shipping_details.depth}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Thuộc tính (Màu sắc, Kích thước, Số lượng)</label>
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
                className="remove-attribute"
                onClick={() => removeAttribute(index)}
              >
                Xóa
              </button>
            </div>
          ))}
          <button
            type="button"
            className="add-attribute"
            onClick={addAttribute}
          >
            Thêm thuộc tính
          </button>
        </div>
        <button type="submit" className="submit-button" disabled={loading}>
          {loading
            ? "Đang xử lý..."
            : isEditMode
            ? "Cập nhật"
            : "Thêm sản phẩm"}
        </button>
      </form>
    </div>
  );
}

export default AddProduct;
