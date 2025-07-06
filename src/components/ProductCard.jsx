



import React from "react";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  // Make sure size is always treated as array
  const sizes =
    Array.isArray(product.size) ? product.size : product.size ? [product.size] : [];

  return (
    <div
      onClick={() => navigate(`/product/${product._id}`)}
      className="cursor-pointer  rounded-xl overflow-hidden bg-[#FFF2F2] transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
    >
      {/* Image container with consistent aspect ratio and added margin */}
      <div className="relative pb-[125%] overflow-hidden m-3 ">
        <img
          src={product.images[0]}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover rounded-lg "
        />
      </div>
      
      {/* Product details */}
      <div className="p-4">
        <h2 className="font-medium text-gray-800 text-base sm:text-lg line-clamp-1 ">
          {product.name}
        </h2>

        {/* ✅ Only show Sizes if NOT Sarees and sizes exist */}
        {product.category !== "Sarees" && sizes.length > 0 && (
          <p className="text-gray-500 text-sm">
            Sizes: {sizes.join(", ")}
          </p>
        )}

        <p className="font-semibold text-gray-900 mt-1">₹{product.price}</p>
      </div>
    </div>
  );
};

export default ProductCard;