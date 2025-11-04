// src/components/booking/BookingWidget.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  UserGroupIcon,
  ClockIcon,
  CurrencyRupeeIcon,
  ShieldCheckIcon,
  XMarkIcon,
  ArrowDownTrayIcon,
} from "@heroicons/react/24/solid";
import { useTours } from "../../hooks/useTours";

const BookingWidget = ({ tour }) => {
  const [guests, setGuests] = useState(1);
  const [error, setError] = useState("");
  const [downloadLoading, setDownloadLoading] = useState(false);
  const navigate = useNavigate();
  const { downloadTourPdf } = useTours();

  const formatPrice = (price) => new Intl.NumberFormat("en-IN").format(price || 0);

  const totalPrice = tour.price * guests;

  const discountPercentage =
    tour.originalPrice && tour.originalPrice > tour.price
      ? Math.round(((tour.originalPrice - tour.price) / tour.originalPrice) * 100)
      : 0;

  const validateBooking = () => {
    if (guests < 1) return "Number of guests must be at least 1";
    if (tour.seats - tour.bookedSeats < guests)
      return `Only ${tour.seats - tour.bookedSeats} seats available`;
    return null;
  };

  const handleBookNow = () => {
    const validationError = validateBooking();
    if (validationError) {
      setError(validationError);
      return;
    }

    // Navigate to booking page with ALL booking details
    navigate('/booking', {
      state: {
        tour: tour,
        guests: guests,
        totalPrice: totalPrice,
        pricePerPerson: tour.price,
        discount: tour.originalPrice ? (tour.originalPrice - tour.price) * guests : 0,
        subtotal: tour.originalPrice ? tour.originalPrice * guests : totalPrice
      }
    });
  };

  const handleDownloadPDF = async () => {
    setDownloadLoading(true);
    try {
      await downloadTourPdf(tour.id);
    } catch (error) {
      console.error('Download failed:', error);
      setError('Failed to download PDF. Please try again.');
    } finally {
      setDownloadLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
      {/* Price */}
      <div className="text-center mb-6">
        <div className="flex items-baseline justify-center gap-1 mb-2">
          <CurrencyRupeeIcon className="w-6 h-6 text-gray-900" />
          <span className="text-4xl font-bold text-gray-900">{formatPrice(tour.price)}</span>
          <span className="text-gray-500">/person</span>
        </div>
        {tour.originalPrice && tour.originalPrice > tour.price && (
          <div className="flex items-center justify-center gap-2">
            <span className="text-lg text-gray-400 line-through">
              ₹{formatPrice(tour.originalPrice)}
            </span>
            <span className="bg-green-100 text-green-600 px-2 py-1 rounded-full text-sm font-medium">
              Save {discountPercentage}% (₹{formatPrice(tour.originalPrice - tour.price)})
            </span>
          </div>
        )}
      </div>

      {/* Tour Info */}
      <div className="space-y-4 mb-6 p-4 bg-gray-50 rounded-xl">
        <div className="flex items-center gap-3">
          <ClockIcon className="w-5 h-5 text-indigo-500" />
          <div>
            <div className="text-sm text-gray-500">Duration</div>
            <div className="font-semibold">{tour.duration || "N/A"} days</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <UserGroupIcon className="w-5 h-5 text-indigo-500" />
          <div>
            <div className="text-sm text-gray-500">Available Seats</div>
            <div
              className={`font-semibold ${
                tour.seats - tour.bookedSeats < 5 ? "text-red-500" : "text-green-600"
              }`}
            >
              {tour.seats - tour.bookedSeats} {tour.seats - tour.bookedSeats === 1 ? "seat" : "seats"} left
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <ClockIcon className="w-5 h-5 text-indigo-500" />
          <div>
            <div className="text-sm text-gray-500">Tour Dates</div>
            <div className="font-semibold">
              {new Date(tour.departureDate).toLocaleDateString()} -{" "}
              {new Date(tour.returnDate).toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>

      {/* Guests */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Number of Guests</label>
        <input
          type="number"
          min="1"
          max={tour.seats - tour.bookedSeats}
          value={guests}
          onChange={(e) => {
            setGuests(Math.max(1, Math.min(parseInt(e.target.value) || 1, tour.seats - tour.bookedSeats)));
            setError("");
          }}
          className="w-full border border-gray-300 rounded-lg px-4 py-3 text-center focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>

      {/* Price Summary */}
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-600">Total Amount:</span>
          <span className="font-semibold text-lg">₹{formatPrice(totalPrice)}</span>
        </div>
        {tour.originalPrice && (
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500">You save:</span>
            <span className="text-green-600 font-semibold">
              ₹{formatPrice((tour.originalPrice - tour.price) * guests)}
            </span>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
          <XMarkIcon className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-3">
        {/* Book Now Button */}
        <button
          onClick={handleBookNow}
          disabled={tour.seats - tour.bookedSeats <= 0}
          className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-4 rounded-xl font-semibold hover:from-indigo-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-300"
        >
          {tour.seats - tour.bookedSeats <= 0 ? "Sold Out" : `Book Now - ₹${formatPrice(totalPrice)}`}
        </button>

        {/* Download PDF Button */}
        <button
          onClick={handleDownloadPDF}
          disabled={downloadLoading}
          className="w-full flex items-center justify-center gap-2 border border-gray-300 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          {downloadLoading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Downloading PDF...</span>
            </>
          ) : (
            <>
              <ArrowDownTrayIcon className="w-5 h-5" />
              <span>Download Tour Details (PDF)</span>
            </>
          )}
        </button>
      </div>

      {/* Security Badge */}
      <div className="flex items-center justify-center gap-2 text-sm text-gray-500 p-3 bg-gray-50 rounded-lg mt-4">
        <ShieldCheckIcon className="w-5 h-5 text-green-500" />
        <span>Secure booking • 24/7 support • Free cancellation</span>
      </div>
    </div>
  );
};

export default BookingWidget;