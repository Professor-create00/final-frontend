import AddProduct from "./pages/admin/AddProduct";
import AdminProducts from "./pages/admin/AdminProducts";
import {   Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import ProductDetailPage from "./pages/ProductDetails";
import AdminOrders from "./pages/admin/AdminOrders";
import CategoryPage from "./pages/CategoryPage";
import CartPage from "./pages/CartPage";
import PrivateRoute from "./utils/PrivateRoute";
import EditProduct from "./pages/admin/EditProduct";
import AdminLogin from "./pages/AdminLogin";
const App = () => {
  return (
    <>
    <Navbar />
    
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/category/:categoryName" element={<CategoryPage/>} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/products" element={
          <PrivateRoute><AdminProducts /></PrivateRoute>} />
        <Route path="/admin/products/add" element={
          <PrivateRoute><AddProduct /></PrivateRoute>} />
        <Route path="/admin/orders" element={
          <PrivateRoute><AdminOrders /></PrivateRoute>} />
        <Route path="/admin/products/edit/:id" element={
          <PrivateRoute>< EditProduct/></PrivateRoute>} />
      </Routes>
  
    </>
  );
};

export default App;
