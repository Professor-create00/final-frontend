import React, { useEffect, useState } from "react";
import axios from "axios";
import { FiTrash2, FiClock, FiUser, FiPhone, FiMapPin, FiPackage } from "react-icons/fi";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });
  const [isDeleting, setIsDeleting] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/orders`);
        setOrders(res.data);
      } catch (err) {
        showNotification("Failed to fetch orders", "error");
      }
    };

    fetchOrders();
  }, []);

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: "", type: "" }), 3000);
  };

  const handleDelete = async (orderId) => {
    setIsDeleting(orderId);
    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/orders/${orderId}`);
      setOrders(orders.filter((o) => o._id !== orderId));
      showNotification("Order deleted successfully", "success");
    } catch (err) {
      console.error("Error deleting order:", err);
      showNotification("Failed to delete order", "error");
    } finally {
      setIsDeleting(null);
    }
  };

  const Notification = () => {
    if (!notification.show) return null;

    const bgColor = notification.type === "success" 
      ? "bg-green-100 text-green-800 border-green-200" 
      : "bg-red-100 text-red-800 border-red-200";

    return (
      <div className={`fixed top-4 right-4 z-50 px-4 py-2 rounded-md shadow-lg border ${bgColor} flex items-center gap-2`}>
        {notification.message}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-2 sm:px-4 py-6 font-sans">
      <Notification />
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center gap-2">
          <FiPackage className="text-black" /> Order Management
        </h1>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <p className="text-gray-500">No orders found</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden md:block">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center gap-1">
                      <FiUser size={14} /> Customer
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center gap-1">
                      <FiPhone size={14} /> Phone
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center gap-1">
                      <FiMapPin size={14} /> Address
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Products
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center gap-1">
                      <FiClock size={14} /> Date
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.customerName}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.phone}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500 max-w-xs">
                      {order.address}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500">
                      <div className="space-y-2">
                        {order.products.map((item, idx) => (
                          <div key={idx} className="flex items-start gap-3">
                            {item.product?.images?.[0] ? (
                              <img
                                src={item.product.images[0]}
                                alt={item.product.name}
                                className="w-10 h-10 object-cover rounded"
                              />
                            ) : (
                              <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
                                <FiPackage className="text-gray-400" />
                              </div>
                            )}
                            <div>
                              <p className="font-medium">
                                {item.product?.name || "Deleted Product"}
                              </p>
                              <p className="text-gray-500 text-xs">Qty: {item.quantity}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleString()}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        onClick={() => handleDelete(order._id)}
                        disabled={isDeleting === order._id}
                        className="p-2 text-gray-500 hover:text-red-500 disabled:opacity-50"
                        title="Delete Order"
                      >
                        {isDeleting === order._id ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                        ) : (
                          <FiTrash2 size={16} />
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-4 p-4">
            {orders.map((order) => (
              <div key={order._id} className="border rounded-lg p-4 shadow-sm">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-medium flex items-center gap-2">
                      <FiUser size={14} className="text-gray-500" />
                      {order.customerName}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                      <FiPhone size={14} className="text-gray-400" />
                      {order.phone}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(order._id)}
                    disabled={isDeleting === order._id}
                    className="p-1.5 text-gray-500 hover:text-red-500 disabled:opacity-50"
                  >
                    {isDeleting === order._id ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                    ) : (
                      <FiTrash2 size={16} />
                    )}
                  </button>
                </div>

                <div className="mb-3">
                  <h4 className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-1">
                    <FiMapPin size={14} className="text-gray-400" />
                    Address
                  </h4>
                  <p className="text-sm text-gray-500">{order.address}</p>
                </div>

                <div className="mb-3">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Products</h4>
                  <div className="space-y-3">
                    {order.products.map((item, idx) => (
                      <div key={idx} className="flex gap-3">
                        {item.product?.images?.[0] ? (
                          <img
                            src={item.product.images[0]}
                            alt={item.product.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                            <FiPackage className="text-gray-400" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-sm">
                            {item.product?.name || "Deleted Product"}
                          </p>
                          <p className="text-gray-500 text-xs">Qty: {item.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <FiClock size={14} className="text-gray-400" />
                  <span>{new Date(order.createdAt).toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;