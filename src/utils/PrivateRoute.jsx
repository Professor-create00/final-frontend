import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("adminToken");

  if (!token) {
    // Not logged in
    return <Navigate to="/admin/login" replace />;
  }
  return children;
};

export default PrivateRoute;
