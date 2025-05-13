import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleLeft,
  faTrashArrowUp,
} from "@fortawesome/free-solid-svg-icons";
import Header from "../Components/Headers";
import "./TrashList.scss";

function TrashList() {
  const [deletedProducts, setDeletedProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchDeletedProducts = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/products/trash"
        );
        setDeletedProducts(response.data);
      } catch (error) {
        toast.error("Lỗi tải thùng rác");
      }
    };

    if (user?.role === "admin") {
      fetchDeletedProducts();
    }
  }, [user]);

  const handleRestore = async (id) => {
    try {
      await axios.put(`http://localhost:8080/api/products/restore/${id}`);
      setDeletedProducts(deletedProducts.filter((p) => p._id !== id));
      toast.success("Khôi phục thành công");
    } catch (error) {
      toast.error("Khôi phục thất bại");
    }
  };

  const handleForceDelete = async (id) => {
    if (window.confirm("Xóa vĩnh viễn sẽ không thể khôi phục!")) {
      try {
        await axios.delete(
          `http://localhost:8080/api/products/force-delete/${id}`
        );
        setDeletedProducts(deletedProducts.filter((p) => p._id !== id));
        toast.success("Xóa vĩnh viễn thành công");
      } catch (error) {
        toast.error("Xóa thất bại");
      }
    }
  };
  const handleEmptyTrash = async () => {
    if (deletedProducts.length === 0) {
      toast.warn("Thùng rác trống, không có gì để dọn dẹp!", {
        position: "top-center",
      });

      return;
    }
    if (
      window.confirm(
        "Bạn có chắc chắn muốn dọn sạch thùng rác? Hành động này sẽ không thể khôi phục! "
      )
    ) {
      try {
        await axios.delete("http://localhost:8080/api/products/trash/empty");
        setDeletedProducts([]);
        toast.success("Thùng rác đã được dọn sạch");
      } catch (error) {
        toast.error("Lỗi khi dọn sạch thùng rác");
      }
    }
  };

  return (
    <>
      <div className="trash-container">
        <FontAwesomeIcon
          icon={faCircleLeft}
          className="back"
          onClick={() => navigate(-1)}
        />
        <h2>
          Thùng rác <FontAwesomeIcon icon={faTrashArrowUp} />
        </h2>

        <div className="trash-actions">
          <button className="empty-trash" onClick={() => handleEmptyTrash()}>
            Dọn sạch thùng rác
          </button>
        </div>

        <div className="trash-list">
          {deletedProducts.map((product) => (
            <div key={product._id} className="trash-item">
              <div className="product-info">
                <h3>{product.title}</h3>
                <p>
                  Đã xóa: {new Date(product.deletedAt).toLocaleDateString()}
                </p>
              </div>

              <div className="actions">
                <button
                  className="restore-btn"
                  onClick={() => handleRestore(product._id)}
                >
                  Khôi phục
                </button>
                <button
                  className="delete-permanently-btn"
                  onClick={() => handleForceDelete(product._id)}
                >
                  Xóa vĩnh viễn
                </button>
              </div>
            </div>
          ))}

          {deletedProducts.length === 0 && (
            <div className="empty-trash-message">Thùng rác trống</div>
          )}
        </div>
      </div>
    </>
  );
}

export default TrashList;
