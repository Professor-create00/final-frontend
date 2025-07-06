import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getCart } from "../utils/cart";
import { ShoppingCart, Menu } from "lucide-react";

const Navbar = () => {
  const [cartCount, setCartCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const isAdminLoggedIn = !!localStorage.getItem("adminToken");

  useEffect(() => {
    const cart = getCart();
    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
    setCartCount(totalItems);

    const handleStorageChange = () => {
      const updatedCart = getCart();
      const updatedTotal = updatedCart.reduce((acc, item) => acc + item.quantity, 0);
      setCartCount(updatedTotal);
    };
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center p-4">
        {/* Logo */}
        <Link to="/" className="text-xl sm:text-2xl font-bold text-gray-800">
          Baba Boutique
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex space-x-4">
          <Link to="/" className="hover:text-blue-600 text-md">Home</Link>
          <Link to="/category/Sarees" className="hover:text-blue-600 text-md">Sarees</Link>
          <Link to="/category/Salwar Kurti" className="hover:text-blue-600 text-md">Salwar Kurti</Link>
          <Link to="/category/Nighty" className="hover:text-blue-600 text-md">Nighty</Link>
          <Link to="/category/Pickle" className="hover:text-blue-600 text-md">Pickles</Link>
          <Link to="/category/Masalas" className="hover:text-blue-600 text-md">Masalas</Link>
        </div>

        {/* Desktop Right Side */}
        <div className="hidden md:flex items-center space-x-4">
          <Link
            to="/cart"
            className="relative flex items-center text-gray-800 hover:text-blue-600"
          >
            <ShoppingCart className="w-6 h-6" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Admin Button */}
          {isAdminLoggedIn ? (
            <button
              onClick={() => navigate("/admin/products")}
              className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
            >
              Admin Dashboard
            </button>
          ) : (
            <button
              onClick={() => navigate("/admin/login")}
              className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
            >
              Admin Login
            </button>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden focus:outline-none"
        >
          <Menu className="w-7 h-7 text-gray-800" />
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 px-4 py-3 space-y-3">
          <Link to="/" className="block hover:text-blue-600">Home</Link>
          <Link to="/category/Sarees" className="block hover:text-blue-600">Sarees</Link>
          <Link to="/category/Salwar Kurti" className="block hover:text-blue-600">Salwar Kurti</Link>
          <Link to="/category/Nighty" className="block hover:text-blue-600">Nighty</Link>
          <Link to="/category/Pickle" className="block hover:text-blue-600">Pickles</Link>
          <Link to="/category/Masalas" className="block hover:text-blue-600">Masalas</Link>

          {/* Cart Icon */}
          <Link
            to="/cart"
            className="relative flex items-center text-gray-800 hover:text-blue-600"
          >
            <ShoppingCart className="w-6 h-6 mr-2" />
            Cart
            {cartCount > 0 && (
              <span className="ml-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Admin Button */}
          {isAdminLoggedIn ? (
            <button
              onClick={() => navigate("/admin/products")}
              className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 w-full"
            >
              Admin Dashboard
            </button>
          ) : (
            <button
              onClick={() => navigate("/admin/login")}
              className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 w-full"
            >
              Admin Login
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
