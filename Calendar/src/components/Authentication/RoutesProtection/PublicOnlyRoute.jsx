import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";


//For routes only for anonymous users.
// Usage: <PublicOnlyRoute><YourComponent /></PublicOnlyRoute>
const PublicOnlyRoute = ({ children }) => {
  const { isLoggedIn } = useContext(AuthContext);

  if (isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PublicOnlyRoute;
