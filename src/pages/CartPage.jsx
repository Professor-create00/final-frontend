

import React, { useEffect, useState } from "react";
import { getCart, updateQuantity, removeFromCart, clearCart } from "../utils/cart";
import axios from "axios";
import { FiTrash2, FiPlus, FiMinus, FiShoppingCart } from "react-icons/fi";

const CartPage = () => {
const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [orderData, setOrderData] = useState({
    customerName: "",
    phone: "",
    address: "",
  });
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });

  useEffect(() => {
    const items = getCart();
    setCartItems(items);
    calculateTotal(items);
  }, []);

  const calculateTotal = (items) => {
    const totalPrice = items.reduce(
      (acc, item) => acc + item.product.price * item.quantity,
      0
    );
    setTotal(totalPrice);
  };

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: "", type: "" }), 3000);
  };

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity <= 0) return;
    updateQuantity(productId, newQuantity);
    const updatedItems = getCart();
    setCartItems(updatedItems);
    calculateTotal(updatedItems);
  };

  const handleRemove = (productId) => {
    removeFromCart(productId);
    const updatedItems = getCart();
    setCartItems(updatedItems);
    calculateTotal(updatedItems);
    showNotification("Item removed from cart", "info");
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setOrderData((prev) => ({ ...prev, [name]: value }));
  };

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    setIsPlacingOrder(true);
    try {
      const orderPayload = {
        customerName: orderData.customerName,
        phone: orderData.phone,
        address: orderData.address,
        products: cartItems.map((item) => ({
          product: item.product._id,
          quantity: item.quantity,
        })),
      };

      await axios.post( `${import.meta.env.VITE_API_BASE_URL}/orders`, orderPayload);
      
      showNotification("Order placed successfully!", "success");
      clearCart();
      setCartItems([]);
      setTotal(0);
      setShowForm(false);
      setOrderData({ customerName: "", phone: "", address: "" });
    } catch (err) {
      console.error("Failed to place order:", err);
      showNotification("Failed to place order", "error");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <FiShoppingCart className="mx-auto text-5xl text-gray-400 mb-4" />
        <h1 className="text-2xl font-medium text-gray-700 mb-2">Your cart is empty</h1>
        <p className="text-gray-500">Start shopping to add items to your cart</p>
      </div>
    );
  }
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Notification */}
      {notification.show && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-md shadow-lg transition-all duration-300 ${
          notification.type === "success" 
            ? "bg-green-100 text-green-800 border border-green-200" 
            : notification.type === "error"
              ? "bg-red-100 text-red-800 border border-red-200"
              : "bg-blue-100 text-blue-800 border border-blue-200"
        }`}>
          {notification.message}
        </div>
      )}

      <h1 className="text-2xl font-bold text-gray-800 mb-8">Your Shopping Cart</h1>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Cart Items */}
   
        {/* Cart Items */}
        <div className="md:col-span-2 bg-white rounded-lg shadow-sm overflow-hidden">
          {cartItems.map((item) => (
            <div key={item.product._id} className="p-4 border-b last:border-b-0">
              {/* Mobile View (stacked) */}
              <div className="md:hidden">
                <div className="flex items-start">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="ml-4 flex-1 min-w-0">
                    <h2 className="font-medium text-gray-800 text-base line-clamp-2">
                      {item.product.name}
                    </h2>
                    <p className="text-gray-600 text-base mt-1">₹{item.product.price}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-4 pl-24">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => handleQuantityChange(item.product._id, item.quantity - 1)}
                      className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600"
                    >
                      <FiMinus size={18} />
                    </button>
                    <span className="w-8 text-center font-medium text-base">{item.quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(item.product._id, item.quantity + 1)}
                      className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600"
                    >
                      <FiPlus size={18} />
                    </button>
                  </div>
                  <button
                    onClick={() => handleRemove(item.product._id)}
                    className="flex items-center text-red-500 hover:text-red-600"
                  >
                    <FiTrash2 size={20} className="ml-2" />
         
                  </button>
                </div>
              </div>

              {/* Desktop View (inline) */}
              <div className="hidden md:flex items-center justify-between">
                <div className="flex items-center flex-1">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="ml-6 min-w-0">
                    <h2 className="font-medium text-gray-800 text-base line-clamp-1">
                      {item.product.name}
                    </h2>
                    <p className="text-gray-600 text-base mt-1">₹{item.product.price}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => handleQuantityChange(item.product._id, item.quantity - 1)}
                      className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600"
                    >
                      <FiMinus size={18} />
                    </button>
                    <span className="w-8 text-center font-medium text-base">{item.quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(item.product._id, item.quantity + 1)}
                      className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600"
                    >
                      <FiPlus size={18} />
                    </button>
                  </div>
                  <button
                    onClick={() => handleRemove(item.product._id)}
                    className="p-2 text-gray-500 hover:text-red-500"
                  >
                    <FiTrash2 size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Order Summary */}
        <div className="bg-white rounded-lg shadow-sm p-6 h-fit sticky top-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Order Summary</h2>
          
          <div className="space-y-3 mb-6">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">₹{total.toLocaleString()}</span>
            </div>
          
            <div className="border-t pt-3 flex justify-between">
              <span className="text-gray-800 font-semibold">Total</span>
              <span className="text-lg font-bold text-gray-900">₹{total.toLocaleString()}</span>
            </div>
          </div>

          <button
            onClick={() => setShowForm(true)}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium transition"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>

      {/* Checkout Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <form
            onSubmit={handleOrderSubmit}
            className="bg-white rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Shipping Information</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    name="customerName"
                    value={orderData.customerName}
                    onChange={handleFormChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={orderData.phone}
                    onChange={handleFormChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Shipping Address</label>
                  <textarea
                    name="address"
                    value={orderData.address}
                    onChange={handleFormChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    rows="4"
                    required
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  disabled={isPlacingOrder}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 rounded-md text-white ${
                    isPlacingOrder
                      ? "bg-green-400 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700"
                  }`}
                  disabled={isPlacingOrder}
                >
                  {isPlacingOrder ? "Processing..." : "Place Order"}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>

     
  );
};

export default CartPage;