import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FiEdit2, FiTrash2, FiPlus, FiShoppingBag, FiList } from "react-icons/fi";

const categories = ["All", "Sarees", "Salwar Kurti", "Nighty", "Pickle", "Masalas"];

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [notification, setNotification] = useState({ 
    show: false, 
    message: "", 
    type: "", // 'success', 'error', or 'loading'
    loading: false 
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/products`);
        setProducts(res.data);
      } catch (err) {
        showNotification("Failed to fetch products", "error");
      }
    };

    fetchProducts();
  }, []);

  const showNotification = (message, type, loading = false) => {
    setNotification({ show: true, message, type, loading });
    setTimeout(() => {
      setNotification(prev => prev.show ? { ...prev, show: false } : prev);
    }, 3000);
  };

  const handleDelete = async (productId) => {
    showNotification("Deleting product...", "loading", true);
    
    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/products/${productId}`);
      setProducts(products.filter((p) => p._id !== productId));
      showNotification("Product deleted successfully", "success");
    } catch (err) {
      console.error("Error deleting product:", err);
      showNotification("Failed to delete product", "error");
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    const query = searchQuery.toLowerCase();
    let matchesSearch = product.name.toLowerCase().includes(query);

    const priceMatch = query.match(/under\s*(\d+)|below\s*(\d+)/);
    if (priceMatch) {
      const priceLimit = parseInt(priceMatch[1] || priceMatch[2]);
      matchesSearch = product.price <= priceLimit;
    }

    return matchesCategory && matchesSearch;
  });

  const Notification = () => {
    if (!notification.show) return null;

    let bgColor = "bg-blue-100 text-blue-800 border-blue-200";
    if (notification.type === "success") bgColor = "bg-green-100 text-green-800 border-green-200";
    if (notification.type === "error") bgColor = "bg-red-100 text-red-800 border-red-200";

    return (
      <div className={`fixed top-4 right-4 z-50 px-4 py-2 rounded-md shadow-lg border ${bgColor} flex items-center gap-2`}>
        {notification.loading && (
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-800"></div>
        )}
        {notification.message}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-2 sm:px-4 py-4">
      <Notification />
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
        <h1 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
          <FiShoppingBag className="text-gray-700" /> Admin Products
        </h1>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => navigate("/admin/orders")}
            className="flex items-center gap-1 bg-blue-500 text-white px-3 py-1.5 rounded text-sm hover:bg-blue-600"
          >
            <FiList size={14} /> Orders
          </button>
          <button
            onClick={() => navigate("/admin/products/add")}
            className="flex items-center gap-1 bg-green-500 text-white px-3 py-1.5 rounded text-sm hover:bg-green-600"
          >
            <FiPlus size={14} /> Add Product
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 border border-gray-300 px-3 py-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border border-gray-300 px-3 py-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Products Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-2 px-3 border text-left text-xs sm:text-sm font-medium text-gray-700">Image</th>
              <th className="py-2 px-3 border text-left text-xs sm:text-sm font-medium text-gray-700">Name</th>
              <th className="py-2 px-3 border text-left text-xs sm:text-sm font-medium text-gray-700 hidden sm:table-cell">Category</th>
              <th className="py-2 px-3 border text-left text-xs sm:text-sm font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <tr key={product._id}>
                  <td className="py-2 px-3 border">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded"
                    />
                  </td>
                  <td className="py-2 px-3 border text-xs sm:text-sm">
                    <div className="font-medium">{product.name}</div>
                    <div className="text-gray-500 sm:hidden">{product.category}</div>
                    <div className="text-gray-500 text-xs">₹{product.price}</div>
                  </td>
                  <td className="py-2 px-3 border text-xs sm:text-sm hidden sm:table-cell">
                    {product.category}
                  </td>
                  <td className="py-2 px-3 border">
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/admin/products/edit/${product._id}`)}
                        className="p-1.5 bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
                        title="Edit"
                      >
                        <FiEdit2 size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="p-1.5 bg-red-100 text-red-600 rounded hover:bg-red-200"
                        title="Delete"
                      >
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="py-4 text-center text-sm text-gray-500">
                  No products found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminProducts;