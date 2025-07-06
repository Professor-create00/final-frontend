import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { addToCart } from "../utils/cart";

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [orderData, setOrderData] = useState({ name: "", phone: "", address: "" });
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/products/${id}`);
        setProduct(res.data);
        setActiveImage(res.data.images[0]);
      } catch (err) {
        console.error("Error fetching product:", err);
        showNotification("Failed to load product", "error");
      }
    };

    fetchProduct();
  }, [id]);

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ ...notification, show: false }), 3000);
  };

  const handleAddToCart = () => {
    addToCart(product, 1);
    showNotification("Added to cart!", "success");
  };

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    setIsPlacingOrder(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/orders`, {
        products: [{ product: id, quantity: 1 }],
        customerName: orderData.name,
        phone: orderData.phone,
        address: orderData.address,
      });
      showNotification("Order placed successfully!", "success");
      setShowForm(false);
      setOrderData({ name: "", phone: "", address: "" });
    } catch (err) {
      console.error("Error placing order:", err.response?.data || err);
      showNotification("Failed to place order", "error");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  if (!product) return <p className="text-center mt-10 text-base font-medium">Loading product...</p>;

  return (
    <div className="container mx-auto px-4 py-8 font-sans relative">
      {/* Notification UI */}
      {notification.show && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-md shadow-lg transition-all duration-300 ${
          notification.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
        }`}>
          {notification.message}
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        {/* Left: Image Gallery */}
        <div className="flex-1">
          <img
            src={activeImage}
            alt={product.name}
            className="w-full h-[400px] sm:h-[500px] object-contain rounded-xl shadow-lg"
          />
          <div className="flex flex-wrap gap-3 mt-4">
            {product.images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`Thumbnail ${index}`}
                className={`w-14 h-14 sm:w-16 sm:h-16 object-cover rounded-md cursor-pointer border-2 transition-transform duration-300 hover:scale-105 ${
                  activeImage === img ? "border-green-500" : "border-gray-300"
                }`}
                onClick={() => setActiveImage(img)}
              />
            ))}
          </div>
        </div>

        {/* Right: Product Details */}
        <div className="flex-1">
          <h1 className="text-xl sm:text-2xl font-bold mb-3 text-gray-800">{product.name}</h1>
          <p className="text-gray-700 mb-4 text-sm sm:text-base leading-relaxed">{product.description}</p>
          
          {product.category !== "Sarees" && product.size && (
            <p className="text-gray-500 mb-5 text-sm sm:text-base">
              Size: <span className="font-medium">{product.size}</span>
            </p>
          )}

          <p className="text-lg sm:text-xl font-semibold mb-2 text-green-700">₹{product.price}</p>

          {/* Buttons - Always side by side */}
          <div className="flex flex-row gap-2 sm:gap-3 w-60">  
            {/* w-60 added by me above */}
            <button
              onClick={handleAddToCart}
              className="flex-1 bg-green-600 text-white px-3 py-2 rounded-md shadow text-sm sm:text-base hover:bg-green-700 transition"
            >
              Add to Cart
            </button>

            <button
              onClick={() => setShowForm(!showForm)}
              className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-md shadow text-sm sm:text-base hover:bg-blue-700 transition"
            >
              {showForm ? "Cancel" : "Buy Now"}
            </button>
          </div>

          {/* Order Form */}
          {showForm && (
            <form
              onSubmit={handleOrderSubmit}
              className="mt-5 p-4 border rounded-lg shadow bg-gray-50 space-y-3"
            >
              <h2 className="text-lg sm:text-xl font-semibold mb-3 text-gray-800">Place Your Order</h2>

              <div>
                <label className="block mb-1 font-medium text-gray-700 text-sm sm:text-base">Name</label>
                <input
                  type="text"
                  value={orderData.name}
                  onChange={(e) => setOrderData({ ...orderData, name: e.target.value })}
                  className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-400 text-sm sm:text-base"
                  required
                />
              </div>

              <div>
                <label className="block mb-1 font-medium text-gray-700 text-sm sm:text-base">Phone</label>
                <input
                  type="text"
                  value={orderData.phone}
                  onChange={(e) => setOrderData({ ...orderData, phone: e.target.value })}
                  className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-400 text-sm sm:text-base"
                  required
                />
              </div>

              <div>
                <label className="block mb-1 font-medium text-gray-700 text-sm sm:text-base">Address</label>
                <textarea
                  value={orderData.address}
                  onChange={(e) => setOrderData({ ...orderData, address: e.target.value })}
                  className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-400 text-sm sm:text-base"
                  rows="3"
                  required
                />
              </div>

              {isPlacingOrder && (
                <p className="text-blue-600 text-sm sm:text-base">⏳ Placing your order... Please wait.</p>
              )}

              <div className="flex justify-end">
                <button
                  type="submit"
                  className={`px-4 py-2 rounded-md text-white text-sm sm:text-base shadow ${
                    isPlacingOrder
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700"
                  } transition`}
                  disabled={isPlacingOrder}
                >
                  {isPlacingOrder ? "Placing..." : "Place Order"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;