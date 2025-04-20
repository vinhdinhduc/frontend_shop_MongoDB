function ProductItem() {
  return (
    <div className="product-item">
      <h2>Product Name</h2>
      <img src="product-image.jpg" alt="Product" />
      <p>Description of the product.</p>
      <p>Price: $XX.XX</p>
      <button>Add to Cart</button>
      <button>View Details</button>
    </div>
  );
}

export default ProductItem;
