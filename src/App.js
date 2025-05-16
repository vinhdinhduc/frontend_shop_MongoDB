import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import ProductList from "./Pages/ProductList";
import ProductDetail from "./Pages/ProductDetail";
import Cart from "./Pages/Cart";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import AddProduct from "./Pages/AddProduct";
import Register from "./Pages/Register";
import CheckoutPage from "./Pages/CheckoutPage";
import "./styles/globalstyle.scss";
import { ToastContainer, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "./context/AuthContext";
import EditProduct from "./Pages/EditProduct";
import TrashList from "./Pages/TrashList";
import { CartProvider } from "./context/CartContext";
import AdminRoute from "./Routes/AdminRoutes";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/products" element={<ProductList />} />
            <Route path="/add-product" element={<AddProduct />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route
              path="/products/edit/:id"
              element={
                <AdminRoute>
                  <EditProduct />
                </AdminRoute>
              }
            />
            <Route
              path="/trash"
              element={
                <AdminRoute>
                  <TrashList />
                </AdminRoute>
              }
            />
            <Route path="/product/:id" element={<ProductDetail />} />
          </Routes>
          <ToastContainer
            position="top-right"
            autoClose={1000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss={false}
            draggable
            pauseOnHover={false}
            theme="colored"
            transition={Bounce}
          />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
