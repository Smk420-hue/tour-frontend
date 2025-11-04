// src/pages/BookingPage.jsx
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useBookings } from "../../hooks/useBookings";
import {
  CurrencyRupeeIcon,
  UserGroupIcon,
  CalendarIcon,
  MapPinIcon,
  ClockIcon,
  TagIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/solid";

const BookingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { handleBookingSubmit, loading, error, success } = useBookings();
  
  // Get all data passed from BookingWidget
  const { tour, guests, totalPrice, pricePerPerson, discount, subtotal } = location.state || {};
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    paymentMethod: "online",
  });

  const [errors, setErrors] = useState({});

  // Redirect if no booking data
  if (!tour) {
    navigate('/');
    return null;
  }

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone is required";
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Phone must be 10 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      // Prepare booking data according to your API structure
      const bookingData = {
        tourId: tour.id,
        tourName: tour.title,
        guests: guests,
        totalAmount: totalPrice,
        customerInfo: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone
        },
        paymentMethod: formData.paymentMethod,
        status: formData.paymentMethod === 'online' ? 'pending' : 'confirmed',
        // Include additional tour details that might be needed
        tourDetails: {
          duration: tour.duration,
          departureDate: tour.departureDate,
          returnDate: tour.returnDate,
          location: tour.location,
          image: tour.image
        }
      };

    // In handleSubmit function of BookingPage.jsx
const result = await handleBookingSubmit(bookingData);

if (result && result.success) {
  navigate('/booking-success', { 
    state: { 
      bookingId: result.bookingId, // This will be the bookingReference
      tour: tour,
      bookingDetails: bookingData,
      customerInfo: formData,
      paymentMethod: formData.paymentMethod
    }
  });
}
    } catch (error) {
      console.error("Booking failed:", error);
      setErrors({ submit: "Booking failed. Please try again." });
    }
  };

  const formatPrice = (price) => new Intl.NumberFormat("en-IN").format(price || 0);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Complete Your Booking</h1>
          <p className="text-gray-600 mt-2">Review your booking details and fill in your information</p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm">✓</span>
            </div>
            <span className="text-green-700 font-medium">{success}</span>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
            <ExclamationTriangleIcon className="w-6 h-6 text-red-500 flex-shrink-0" />
            <span className="text-red-700 font-medium">{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <h2 className="text-xl font-semibold mb-6">Tour Details</h2>
              
              {/* Tour Summary */}
              <div className="flex items-start gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                {tour.image && (
                  <img 
                    src={tour.image} 
                    alt={tour.title}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                )}
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{tour.title}</h3>
                  <div className="grid grid-cols-2 gap-2 mt-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="w-4 h-4" />
                      <span>{new Date(tour.departureDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ClockIcon className="w-4 h-4" />
                      <span>{tour.duration} days</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <UserGroupIcon className="w-4 h-4" />
                      <span>{guests} {guests > 1 ? 'Guests' : 'Guest'}</span>
                    </div>
                    {tour.location && (
                      <div className="flex items-center gap-2">
                        <MapPinIcon className="w-4 h-4" />
                        <span>{tour.location}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Personal Information Form */}
              <h2 className="text-xl font-semibold mb-6">Personal Information</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                        errors.name ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter your full name"
                      disabled={loading}
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter your email"
                      disabled={loading}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                    )}
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      errors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your 10-digit phone number"
                    disabled={loading}
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                  )}
                </div>

                {/* Payment Method */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    Payment Method *
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <label className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                      formData.paymentMethod === 'online' 
                        ? 'border-indigo-500 bg-indigo-50' 
                        : 'border-gray-300'
                    } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="online"
                        checked={formData.paymentMethod === 'online'}
                        onChange={handleInputChange}
                        className="sr-only"
                        disabled={loading}
                      />
                      <div className="text-center">
                        <div className="font-semibold">Online Payment</div>
                        <div className="text-sm text-gray-600 mt-1">Pay now securely</div>
                      </div>
                    </label>

                    <label className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                      formData.paymentMethod === 'cash' 
                        ? 'border-indigo-500 bg-indigo-50' 
                        : 'border-gray-300'
                    } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cash"
                        checked={formData.paymentMethod === 'cash'}
                        onChange={handleInputChange}
                        className="sr-only"
                        disabled={loading}
                      />
                      <div className="text-center">
                        <div className="font-semibold">Pay Later</div>
                        <div className="text-sm text-gray-600 mt-1">Pay in cash on tour day</div>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-indigo-600 text-white py-4 rounded-xl font-semibold hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 text-lg flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      {formData.paymentMethod === 'online' ? 'Processing Payment...' : 'Confirming Booking...'}
                    </>
                  ) : (
                    `Complete Booking - ₹${formatPrice(totalPrice)}`
                  )}
                </button>

                {errors.submit && (
                  <p className="text-red-500 text-center">{errors.submit}</p>
                )}
              </form>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
              <h2 className="text-xl font-semibold mb-6 border-b pb-4">Booking Summary</h2>
              
              {/* Price Breakdown */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Price per person</span>
                  <span className="font-medium">₹{formatPrice(pricePerPerson)}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Number of guests</span>
                  <span className="font-medium">{guests}</span>
                </div>

                {discount > 0 && (
                  <>
                    <div className="flex justify-between items-center text-gray-600">
                      <span>Original price</span>
                      <span>₹{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between items-center text-green-600">
                      <span className="flex items-center gap-1">
                        <TagIcon className="w-4 h-4" />
                        Discount
                      </span>
                      <span>-₹{formatPrice(discount)}</span>
                    </div>
                  </>
                )}

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between items-center text-lg font-semibold">
                    <span>Total Amount</span>
                    <span className="flex items-center text-indigo-600">
                      <CurrencyRupeeIcon className="w-5 h-5" />
                      {formatPrice(totalPrice)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Booking Details */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="font-semibold mb-3">Booking Details</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Tour:</span>
                    <span className="font-medium text-right">{tour.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Duration:</span>
                    <span className="font-medium">{tour.duration} days</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Departure:</span>
                    <span className="font-medium">{new Date(tour.departureDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Guests:</span>
                    <span className="font-medium">{guests} {guests > 1 ? 'persons' : 'person'}</span>
                  </div>
                </div>
              </div>

              {/* Payment Method Info */}
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">
                  {formData.paymentMethod === 'online' ? 'Online Payment' : 'Pay Later'}
                </h4>
                <p className="text-sm text-blue-700">
                  {formData.paymentMethod === 'online' 
                    ? 'You will be redirected to secure payment gateway after submitting this form.'
                    : 'You can pay the amount in cash when you arrive for the tour.'
                  }
                </p>
              </div>

              {/* Important Notes */}
              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h4 className="font-semibold text-yellow-800 mb-2">Important</h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• Free cancellation up to 24 hours</li>
                  <li>• Confirmation email will be sent</li>
                  <li>• Bring valid ID for verification</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;