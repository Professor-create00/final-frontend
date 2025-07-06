import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../components/ProductCard";
import { Link } from "react-router-dom";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if mobile on component mount and window resize
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768); // 768px is common breakpoint
    };

    checkIfMobile(); // Initial check
    window.addEventListener('resize', checkIfMobile);

    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/products`);
        setProducts(res.data);
      } catch (err) {
        console.error("❌ Error fetching products:", err);
      }
    };

    fetchProducts();
  }, []);

  const categories = [
    { name: "Sarees", title: "Beautiful Sarees Collection" },
    { name: "Salwar Kurti", title: "Trendy Salwar Kurtis" },
    { name: "Nighty", title: "Comfortable Nightwear" },
    { name: "Pickle", title: "Homemade Pickles" },
    { name: "Masalas", title: "Organic Masalas" },
  ];

  return (
    <div>
      {/* Video Section - Different video for mobile/desktop */}
      <div className="w-full h-[70vh] overflow-hidden relative">
        <video
          autoPlay
          muted
          playsInline
          className="w-full h-full object-cover"
          key={isMobile ? "mobile" : "desktop"} // Force re-render on change
        >
          <source 
            src={isMobile ? "/mobilevideo.mp4" : "/vid2.mp4"} 
            type="video/mp4" 
          />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Products Section */}
      <div className="container mx-auto px-4 py-8">
        {categories.map(({ name, title }) => {
          const categoryProducts = products
            .filter((p) => p.category.toLowerCase() === name.toLowerCase())
            .slice(0, 4);

          if (categoryProducts.length === 0) return null;

          return (
            <div key={name} className="mb-10">
              <h2 className="text-xl sm:text-2xl font-bold text-center mb-4">
                {title}
              </h2>
              <div className="flex justify-center mt-4">
                <Link
                  to={`/category/${name}`}
                  className="bg-[#328E6E] text-white px-6 py-2 rounded hover:bg-[#5A827E] transition text-sm sm:text-base"
                >
                  View All
                </Link>
              </div>
              <div className="flex gap-4 overflow-x-auto sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:gap-6 mt-4">
                {categoryProducts.map((product) => (
                  <div key={product._id} className="flex-shrink-0 w-40 sm:w-auto">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      <footer className="bg-gray-900 text-white py-6 mt-12">
  <div className="container mx-auto px-4 text-center">
    <p className="text-sm md:text-base">
      Made with ❤️ and ☕ by Lakhan Sharan
    </p>
  </div>
</footer>
    </div>
  );
};

export default Home;