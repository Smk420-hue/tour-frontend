// src/hooks/useAuth.js
import { useState, useEffect, useCallback } from "react";
import { loginUser, registerUser, getProfile, logoutUser } from "../api/authApi";

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch logged-in user on mount
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      const savedUser = localStorage.getItem("userInfo");

      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const profile = await getProfile();
        const profileUser = profile.user || profile.users || profile; // ✅ handle both
        setUser(profileUser);
        localStorage.setItem("userInfo", JSON.stringify(profileUser));
      } catch (err) {
        console.error("Error fetching profile:", err);
        localStorage.removeItem("token");
        localStorage.removeItem("userInfo");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // ✅ Login
  const login = useCallback(async (credentials) => {
    setError(null);
    setLoading(true);
    try {
      const data = await loginUser(credentials);
      const loggedUser = data.user || data.users; // ✅ adjust for backend
      localStorage.setItem("token", data.token);
      localStorage.setItem("userInfo", JSON.stringify(loggedUser));
      setUser(loggedUser);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ Register
  const register = useCallback(async (userData) => {
    setError(null);
    setLoading(true);
    try {
      const data = await registerUser(userData);
      const newUser = data.user || data.users;
      localStorage.setItem("token", data.token);
      localStorage.setItem("userInfo", JSON.stringify(newUser));
      setUser(newUser);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ Logout
  const logout = useCallback(() => {
    logoutUser();
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");
    setUser(null);
  }, []);

  return { user, loading, error, login, register, logout };
};
