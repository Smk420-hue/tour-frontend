import { createContext, useContext, useState } from "react";
import {
  createBooking,
  getMyBookings,
  cancelBooking,
} from "../api/bookingApi";

const BookingContext = createContext();

export const BookingProvider = ({ children }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const data = await getMyBookings();
      setBookings(data.bookings);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const bookTour = async (tourId, bookingData) => {
    try {
      setLoading(true);
      const data = await createBooking(tourId, bookingData);
      setBookings((prev) => [...prev, data.booking]);
      return data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const cancelMyBooking = async (bookingId) => {
    try {
      await cancelBooking(bookingId);
      setBookings((prev) => prev.filter((b) => b.id !== bookingId));
    } catch (error) {
      console.error("Error cancelling booking:", error);
    }
  };

  return (
    <BookingContext.Provider
      value={{
        bookings,
        loading,
        fetchBookings,
        bookTour,
        cancelMyBooking,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBookingContext = () => useContext(BookingContext);
