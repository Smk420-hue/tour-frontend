// src/hooks/useBookings.js
import { useState, useEffect, useCallback } from "react";
import {
  createBooking,
  getMyBookings,
  getAllBookings,
  getBookingById,
  updateBookingStatus,
  deleteBooking,
} from "../api/bookingApi";

export const useBookings = (isAdmin = false) => {
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState("");

  // ✅ Fetch bookings (admin or user)
  const fetchBookings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = isAdmin ? await getAllBookings() : await getMyBookings();
      setBookings(data.bookings || data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  }, [isAdmin]);

  // ✅ Fetch single booking
  const fetchBookingById = useCallback(async (id) => {
    setLoading(true);
    try {
      const data = await getBookingById(id);
      setSelectedBooking(data.booking || data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load booking details");
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ Create / Update / Delete
  const bookTour = useCallback(async (bookingData) => await createBooking(bookingData), []);
  const changeBookingStatus = useCallback(
    async (id, status) => await updateBookingStatus(id, status),
    []
  );
  const removeBooking = useCallback(async (id) => await deleteBooking(id), []);

  //
  const handleBookingSubmit = useCallback(
    async (bookingData) => {
      setLoading(true);
      setError("");
      setSuccess("");

      try
   {
        const response = await createBooking(bookingData);
        setSuccess("Booking successful!");
        return response;
      } catch (err) {
        const message =
          err.response?.data?.message || "Booking failed. Please try again.";
        setError(message);
        throw err; // ✅ Important: re-throw the error
      } finally {
        setLoading(false);
      }
    },
    []
  );
  // ✅ Clear messages
  const clearMessages = useCallback(() => {
    setError("");
    setSuccess("");
  }, []);

  return {
    bookings,
    selectedBooking,
    loading,
    error,
    success,
    fetchBookings,
    fetchBookingById,
    bookTour,
    changeBookingStatus,
    removeBooking,
    handleBookingSubmit,
    clearMessages,
  };
};
