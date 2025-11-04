// src/api/customTourApi.js
import axiosInstance from "./axiosInstance";



export const submitCustomTour = async (formData) => {
  try {
    const res = await axiosInstance.post("/custom-tours", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (error) {
    console.error("Error submitting custom tour:", error);
    throw error.response?.data || error;
  }
};
