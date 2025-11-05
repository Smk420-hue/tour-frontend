// src/components/layout/Layout.jsx
import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { logoutUser } from "../../api/authApi";

const Layout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove token using your existing logout helper
    logoutUser();

    // Clear user data
    localStorage.removeItem("userInfo");

    // Redirect to login or home
    navigate("/login");

    // Optional: force re-render
    window.location.reload();
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar handleLogout={handleLogout} />
      <main className="flex-1 container mx-auto px-4 py-6">
        <Outlet /> {/* Nested route content will render here */}
      </main>
      <div className="z-0 overflow-hidden" >
      <Footer  />
      </div>
    </div>
  );
};

export default Layout;
