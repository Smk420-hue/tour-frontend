// src/PrivateRoute.jsx
import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

const PrivateRoute = ({ children, adminOnly = false }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAdminStatus = () => {
      try {
        const token = localStorage.getItem("token");
        const userInfo = localStorage.getItem("userInfo");
        
        if (!token) {
          setIsLoading(false);
          return;
        }

        if (userInfo) {
          const userData = JSON.parse(userInfo);
          setIsAdmin(userData.isAdmin === true || userData.role === 'admin');
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error("Error checking admin status:", error);
        setIsLoading(false);
      }
    };

    checkAdminStatus();
  }, []);

  // Show loading while checking authentication
  if (isLoading) {
    return <div>Loading...</div>; // Or your LoadingSpinner component
  }

  const token = localStorage.getItem("token");
  
  // Redirect to login if no token
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Redirect to home if adminOnly is true but user is not admin
  if (adminOnly && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PrivateRoute;