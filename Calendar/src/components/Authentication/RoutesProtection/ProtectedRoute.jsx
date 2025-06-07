// ProtectedRoute.jsx
import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../AuthContext";

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) {
    return <div>Loading...</div>; // Or your custom loading component
  }

  if (!isLoggedIn) {
    return <Navigate to="/public" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;


