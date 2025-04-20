import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./Components/Headers";
import Footer from "./Components/Footer";
import ProductList from "./Pages/ProductList";
import ProductDetail from "./Pages/ProductDetail";
import Cart from "./Pages/Cart";
import "./styles/globalstyle.scss";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/product" element={<ProductList />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
