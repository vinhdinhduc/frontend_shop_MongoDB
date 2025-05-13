import { useState } from "react";

const CheckoutPage = () => {
  const [showCheckout, setShowCheckout] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    cardNumber: "",
    expiryDate: "",
    cvc: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Xử lý logic thanh toán ở đây
    alert("Thanh toán thành công!");
    setShowCheckout(false);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-gray-800 text-white p-6 text-center">
        <h1 className="text-2xl mb-4">Website Bán Hàng</h1>
        <button
          onClick={() => setShowCheckout(true)}
          className="bg-green-500 hover:bg-green-600 px-6 py-2 rounded"
        >
          Mua Ngay
        </button>
      </header>

      {showCheckout && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Thông tin thanh toán</h2>
              <button
                onClick={() => setShowCheckout(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="email" className="block mb-2 font-medium">
                  Email:
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  placeholder="nhập email của bạn..."
                />
              </div>

              <div className="mb-4">
                <label htmlFor="cardNumber" className="block mb-2 font-medium">
                  Số thẻ:
                </label>
                <input
                  type="text"
                  id="cardNumber"
                  required
                  pattern="[0-9\s]{13,19}"
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  placeholder="1234 5678 9012 3456"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label
                    htmlFor="expiryDate"
                    className="block mb-2 font-medium"
                  >
                    Hết hạn:
                  </label>
                  <input
                    type="text"
                    id="expiryDate"
                    required
                    placeholder="MM/YY"
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="cvc" className="block mb-2 font-medium">
                    CVC:
                  </label>
                  <input
                    type="text"
                    id="cvc"
                    required
                    placeholder="123"
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded transition-colors"
              >
                Xác nhận thanh toán
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;
