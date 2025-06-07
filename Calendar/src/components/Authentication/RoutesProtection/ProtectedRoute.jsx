import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";


// For routes that require authentication
// Usage: <ProtectedRoute><YourComponent /></ProtectedRoute>
const ProtectedRoute = ({ children }) => {
  const { isLoggedIn } = useContext(AuthContext);

  if (!isLoggedIn) {
    return <Navigate to={window.location.pathname} replace />
  }

  return children;
};

export default ProtectedRoute;




