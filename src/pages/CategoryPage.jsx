
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ProductCard from "../components/ProductCard";

const CategoryPage = () => {
  const { categoryName } = useParams();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/products/category/${categoryName}`
        );
        setProducts(res.data);
        setFilteredProducts(res.data);
      } catch (err) {
        console.error("❌ Error fetching category products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategoryProducts();
  }, [categoryName]);

  useEffect(() => {
    const lowerQuery = query.toLowerCase();
    let priceFilter = null;

    // Detect "under" or "below" keywords for price
    const priceMatch = lowerQuery.match(/under\s*(\d+)|below\s*(\d+)/);
    if (priceMatch) {
      priceFilter = parseInt(priceMatch[1] || priceMatch[2]);
    }

    // Filter products
    let filtered = products.filter((product) =>
      product.name.toLowerCase().includes(lowerQuery.replace(/under\s*\d+|below\s*\d+/, "").trim())
    );
    if (priceFilter) {
      filtered = filtered.filter((product) => product.price <= priceFilter);
    }

    setFilteredProducts(filtered);
  }, [query, products]);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Centered Heading */}
      <div className="flex justify-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold capitalize text-center">
          {categoryName}
        </h1>
      </div>

      {/* Optimized Search Bar */}
      <div className="mb-6 flex justify-center">
        <div className="w-full max-w-md">
          <input
            type="text"
            placeholder="Search e.g. silk saree under 4000"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 text-sm sm:text-base"
          />
        </div>
      </div>

      {loading ? (
        <p className="text-center text-gray-600">Loading products...</p>
      ) : filteredProducts.length === 0 ? (
        <p className="text-center text-gray-600">No products found matching your search.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
          {filteredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryPage;