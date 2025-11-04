// src/pages/BookingSuccess.jsx
import { useLocation, Link } from "react-router-dom";
import { 
  CheckCircleIcon, 
  CreditCardIcon, 
  BanknotesIcon,
  EnvelopeIcon,
  PhoneIcon 
} from "@heroicons/react/24/solid";

const BookingSuccess = () => {
  const location = useLocation();
  const { bookingId, tour, bookingDetails, customerInfo } = location.state || {};

  if (!bookingId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-2xl">⚠️</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Invalid Booking</h1>
          <p className="text-gray-600 mb-6">Please check your booking details.</p>
          <Link
            to="/"
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors block"
          >
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  const isOnlinePayment = bookingDetails?.paymentMethod === 'online';
  const isCashPayment = bookingDetails?.paymentMethod === 'cash';

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        {/* Success Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center mb-8">
          <CheckCircleIcon className="w-20 h-20 text-green-500 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {isOnlinePayment ? 'Payment Processing!' : 'Booking Confirmed!'}
          </h1>
          <p className="text-gray-600 text-lg mb-2">
            Thank you <strong>{customerInfo?.name}</strong>, 
            {isOnlinePayment 
              ? ' your booking has been received and payment is being processed.'
              : ' your booking has been successfully confirmed!'
            }
          </p>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
            <p className="text-green-700 font-semibold">
              Booking Reference: <span className="font-mono">{bookingId}</span>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Booking Details */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-6 border-b pb-4">Booking Details</h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Tour Package:</span>
                <span className="font-semibold text-right">{tour?.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Duration:</span>
                <span className="font-semibold">{tour?.duration} days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Departure Date:</span>
                <span className="font-semibold">
                  {new Date(tour?.departureDate).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Number of Guests:</span>
                <span className="font-semibold">{bookingDetails?.guests}</span>
              </div>
              <div className="flex justify-between text-lg border-t pt-4">
                <span className="text-gray-900 font-bold">Total Amount:</span>
                <span className="text-indigo-600 font-bold">
                  ₹{bookingDetails?.totalAmount?.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>

          {/* Payment & Next Steps */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-6 border-b pb-4 flex items-center gap-2">
              {isOnlinePayment ? (
                <>
                  <CreditCardIcon className="w-6 h-6 text-blue-500" />
                  Payment Information
                </>
              ) : (
                <>
                  <BanknotesIcon className="w-6 h-6 text-green-500" />
                  Payment Instructions
                </>
              )}
            </h2>

            {isOnlinePayment && (
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-800 mb-2">Payment Processing</h3>
                  <p className="text-blue-700 text-sm">
                    Your payment is being securely processed. You will receive a confirmation email 
                    once the payment is successful.
                  </p>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-700">What happens next?</h4>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      Payment verification (usually within 2 hours)
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      Confirmation email with e-ticket
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      Tour guide contact details 3 days before departure
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {isCashPayment && (
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="font-semibold text-green-800 mb-2">Pay on Arrival</h3>
                  <p className="text-green-700 text-sm">
                    Please bring the exact amount in cash when you arrive for the tour.
                  </p>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-700">Next Steps:</h4>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      Arrive 30 minutes before tour start time
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      Bring valid photo ID for verification
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      Have the exact amount ready in cash
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      Look for our representative with company ID
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {/* Contact Information */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <EnvelopeIcon className="w-4 h-4" />
                Contact Information
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Email:</span>
                  <span className="font-medium">{customerInfo?.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Phone:</span>
                  <span className="font-medium">{customerInfo?.phone}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Important Notes */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mt-8">
          <h3 className="text-lg font-semibold mb-4">Important Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <span className="text-yellow-500 mt-0.5">•</span>
                <span>Free cancellation up to 24 hours before departure</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-yellow-500 mt-0.5">•</span>
                <span>Bring valid government-issued photo ID</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <span className="text-yellow-500 mt-0.5">•</span>
                <span>Confirmation voucher will be emailed to you</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-yellow-500 mt-0.5">•</span>
                <span>Contact support for any changes or queries</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <Link
            to="/my-bookings"
            className="flex-1 bg-indigo-600 text-white py-4 rounded-xl font-semibold hover:bg-indigo-700 transition-colors text-center"
          >
            View My Bookings
          </Link>
          <Link
            to="/"
            className="flex-1 bg-white text-gray-700 py-4 rounded-xl font-semibold hover:bg-gray-50 border border-gray-300 transition-colors text-center"
          >
            Browse More Tours
          </Link>
          <button
            onClick={() => window.print()}
            className="flex-1 bg-white text-gray-700 py-4 rounded-xl font-semibold hover:bg-gray-50 border border-gray-300 transition-colors"
          >
            Print Confirmation
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccess;