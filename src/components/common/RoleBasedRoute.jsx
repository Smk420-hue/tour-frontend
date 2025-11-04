// src/components/common/RoleBasedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";

/**
 * RoleBasedRoute
 * @param {ReactNode} children - The protected component(s) to render
 * @param {Array<string>} roles - Array of allowed roles, e.g., ['admin', 'employee']
 */
const RoleBasedRoute = ({ children, roles }) => {
  const { user } = useAuthContext();

  if (!user) {
    // User is not logged in
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(user.role)) {
    // User role is not allowed
    return <Navigate to="/unauthorized" replace />;
  }

  // User is authorized
  return children;
};

export default RoleBasedRoute;
