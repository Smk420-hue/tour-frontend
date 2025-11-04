import React from "react";

const BookingSummary = ({ tour, user, bookingDetails, onConfirm }) => {
  if (!tour || !user) return null;

  const { totalPrice, guests, date } = bookingDetails;

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mt-6 max-w-lg mx-auto border">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Booking Summary</h2>

      {/* Tour Info */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-700">{tour.title}</h3>
        <p className="text-gray-600 mt-1">{tour.shortDescription}</p>
        <div className="flex items-center justify-between mt-2">
          <span className="text-sm text-gray-500">Duration:</span>
          <span className="text-sm font-medium">{tour.duration} days</span>
        </div>
        <div className="flex items-center justify-between mt-1">
          <span className="text-sm text-gray-500">Location:</span>
          <span className="text-sm font-medium">{tour.state || "N/A"}</span>
        </div>
      </div>

      {/* User Info */}
      <div className="mb-4 border-t pt-3">
        <h4 className="text-md font-semibold text-gray-700 mb-1">Traveler Info</h4>
        <p className="text-sm text-gray-600">{user.name}</p>
        <p className="text-sm text-gray-600">{user.email}</p>
      </div>

      {/* Booking Details */}
      <div className="mb-4 border-t pt-3">
        <h4 className="text-md font-semibold text-gray-700 mb-2">Booking Details</h4>
        <div className="flex justify-between text-sm text-gray-600">
          <span>Guests:</span>
          <span>{guests}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-600 mt-1">
          <span>Date:</span>
          <span>{new Date(date).toLocaleDateString()}</span>
        </div>
        <div className="flex justify-between text-base font-semibold text-gray-800 mt-3">
          <span>Total Price:</span>
          <span>₹{totalPrice.toLocaleString()}</span>
        </div>
      </div>

      {/* Confirm Button */}
      <button
        onClick={onConfirm}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition duration-200"
      >
        Confirm Booking
      </button>
    </div>
  );
};

export default BookingSummary;
