// src/api/authApi.js
import axiosInstance from "./axiosInstance";

export const registerUser = async (userData) => {
  const { data } = await axiosInstance.post("/auth/register", userData);
  return data;
};

export const loginUser = async (credentials) => {
  const { data } = await axiosInstance.post("/auth/login", credentials);
  if (data.token) {
    localStorage.setItem("token", data.token);
    // Store user info for quick access
    if (data.user) {
      localStorage.setItem("userInfo", JSON.stringify(data.user));
    }
  }
  return data;
};

export const getProfile = async () => {
  try {
    const { data } = await axiosInstance.get("/auth/profile");
    // Store user info for quick access
    localStorage.setItem("userInfo", JSON.stringify(data));
    return data;
  } catch (error) {
    console.error("Error fetching profile:", error);
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    await axiosInstance.post("/auth/logout");
  } catch (error) {
    console.error("Logout failed:", error);
  } finally {
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");
  }
};