// src/api/carouselApi.js
import axiosInstance from "./axiosInstance";

export const getCarousels = async () => {
  const response = await axiosInstance.get("/carousel");
  return response.data;
};

export const getAllCarousels = async () => {
  const response = await axiosInstance.get("/carousel/all");
  return response.data;
};

export const getCarousel = async (id) => {
  const response = await axiosInstance.get(`/carousel/${id}`);
  return response.data;
};

export const createCarousel = async (formData) => {
  const response = await axiosInstance.post("/carousel", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const updateCarousel = async (id, formData) => {
  const response = await axiosInstance.put(`/carousel/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const deleteCarousel = async (id) => {
  const response = await axiosInstance.delete(`/carousel/${id}`);
  return response.data;
};

export const toggleCarousel = async (id) => {
  const response = await axiosInstance.patch(`/carousel/${id}/toggle`);
  return response.data;
};