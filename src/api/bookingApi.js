// src/api/bookingApi.js
import axiosInstance from "./axiosInstance";



export const getMyBookings = async () => {
  const { data } = await axiosInstance.get("/bookings/my");
  return data;
};

export const getAllBookings = async () => {
  const { data } = await axiosInstance.get("/bookings");
  return data;
};



export const updateBookingStatus = async (id, status, token) => {
  const { data } = await axiosInstance.patch(
    `/bookings/${id}/status`,
    { status }, // ✅ Request body
    {
      headers: { Authorization: `Bearer ${token}` }, // ✅ Config object
    }
  );
  return data;
};


export const deleteBooking = async (id) => {
  const { data } = await axiosInstance.delete(`/bookings/${id}`);
  return data;
};

// ✅ Create a booking
export const createBooking = async (bookingData) => {
  const { data } = await axiosInstance.post("/bookings", bookingData);
  return data;
};
// src/api/bookingApi.js
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/bookings";

// ✅ Fetch all bookings
export const getBookings = async (token) => {
  const res = await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// ✅ Create a booking
// export const createBooking = async (data, token) => {
//   const res = await axios.post(API_URL, data, {
//     headers: { Authorization: `Bearer ${token}` },
//   });
//   return res.data;
// };

// ✅ Get booking by ID
export const getBookingById = async (id, token) => {
  const res = await axios.get(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// ✅ Cancel booking (the missing one)
export const cancelBooking = async (id, token) => {
  const res = await axios.delete(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// ✅ Update booking (optional)
export const updateBooking = async (id, data, token) => {
  const res = await axios.put(`${API_URL}/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

