/**
 * PublicOnlyRoute component to restrict access to routes for authenticated users.
 * If a user is logged in, it redirects them to the page they came from or to the home page.
 * Otherwise, it renders the children (usually public pages like login or register).
 * 
 * @component
 * @param {object} props
 * @param {React.ReactNode} props.children - The child components to render if the user is not authenticated.
 * @returns {React.ReactNode} The children components if not authenticated, otherwise redirects.
 *
 * @example
 * <PublicOnlyRoute>
 *   <Login />
 * </PublicOnlyRoute>
 */
import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../AuthContext";

const PublicOnlyRoute = ({ children }) => {
  const { isLoggedIn, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) {
    return <div>Loading...</div>; // Or your custom loading indicator
  }

  if (isLoggedIn) {
    // Redirect to the page user attempted to access before login or home page
    const from = location.state?.from?.pathname || "/";
    return <Navigate to={from} replace />;
  }

  return children;
};

export default PublicOnlyRoute;
