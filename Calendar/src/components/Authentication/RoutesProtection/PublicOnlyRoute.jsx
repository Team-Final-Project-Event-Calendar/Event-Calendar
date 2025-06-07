// PublicOnlyRoute.jsx
import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../AuthContext";

const PublicOnlyRoute = ({ children }) => {
  const { isLoggedIn, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) {
    return <div>Loading...</div>; 
  }

  if (isLoggedIn) {
    const from = location.state?.from?.pathname || "/";
    return <Navigate to={from} replace />;
  }

  return children;
};

export default PublicOnlyRoute;