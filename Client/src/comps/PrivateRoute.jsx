/* eslint-disable react/prop-types */
import { Navigate } from "react-router-dom";
import { useAuth } from "../Contexts/AuthContext";

const PrivateRoute = ({ children, requiredRole }) => {
  const { authState } = useAuth();

  // If token does not exist: User not logged in so redirect to the login page
  if (!authState.token) {
    return <Navigate to="/login" replace />;
  }

  // return to the 404 page if role not authorized
  if (authState.role !== requiredRole) {
    return <Navigate to="/404" replace />;
  }

  // Authorized so return children
  return children;
};

export default PrivateRoute;
