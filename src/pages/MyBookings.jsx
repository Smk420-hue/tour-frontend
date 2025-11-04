import React, { useEffect } from "react";
import { useBookings } from "../hooks/useBookings";

const MyBookings = () => {
  const { bookings, fetchMyBookings } = useBookings();

  useEffect(() => {
    fetchMyBookings();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">My Bookings</h1>
      {bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <ul className="space-y-4">
          {bookings.map((b) => (
            <li key={b.id} className="border p-4 rounded shadow">
              <p><strong>Tour:</strong> {b.Tour.title}</p>
              <p><strong>Date:</strong> {b.travelDate}</p>
              <p><strong>Status:</strong> {b.bookingStatus}</p>
              <p><strong>Travelers:</strong> {b.numberOfTravelers}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyBookings;
