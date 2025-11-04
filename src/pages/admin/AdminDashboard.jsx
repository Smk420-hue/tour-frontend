// src/pages/admin/AdminDashboard.jsx
import { useState, useEffect } from "react";
import { useTours } from "../../hooks/useTours";
import { useAuth } from "../../hooks/useAuth";
import { getAllBookings, updateBookingStatus } from "../../api/bookingApi";

// Components
import TourCard from "../../components/tours/TourCard";
import CarouselPanel from "../../pages/admin/CarouselPanel";
import ReviewList from "../../components/review/ReviewList";
import CreateTourModal from "../../pages/admin/CreateTourModal";
import CreateEmployeeModal from "../../pages/admin/CreateEmployeeModal";
import AdminTour from "./AdminTour";
import BookingDetailModal from "./BookingDetailModal";
import BookingManagementSystem from "./BookingManagementSystem"; // Import the new component

const AdminDashboard = () => {
  const { user } = useAuth();
  const { tours, fetchTours } = useTours();

  const [activeTab, setActiveTab] = useState("tours");
  const [showTourModal, setShowTourModal] = useState(false);
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [bookingView, setBookingView] = useState("table"); // 'table' or 'card'

  useEffect(() => {
    fetchTours();
    const fetchBookings = async () => {
      try {
        const data = await getAllBookings();
        setBookings(data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };
    fetchBookings();
  }, []);

  // Confirm booking
const handleConfirm = async (id) => {
  try {
    await updateBookingStatus(id, "confirmed");
    // Refresh bookings
    const data = await getAllBookings();
    setBookings(data);
    setModalOpen(false);
  } catch (error) {
    console.error("Failed to confirm booking:", error);
    alert(error.response?.data?.message || "Failed to confirm booking");
  }
};

const handleCancel = async (id) => {
  try {
    await updateBookingStatus(id, "cancelled");
    // Refresh bookings
    const data = await getAllBookings();
    setBookings(data);
    setModalOpen(false);
  } catch (error) {
    console.error("Failed to cancel booking:", error);
    alert(error.response?.data?.message || "Failed to cancel booking");
  }
};
 

  const renderTabContent = () => {
    switch (activeTab) {
      case "tours":
        return (
          <div>
            <div className="flex justify-end mb-4">
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                onClick={() => setShowTourModal(true)}
              >
                Create Tour
              </button>
            </div>
            <AdminTour />
            {showTourModal && (
              <CreateTourModal
                onClose={() => {
                  setShowTourModal(false);
                  fetchTours();
                }}
              />
            )}
          </div>
        );

      case "bookings":
        return (
          <div className="p-6">
            {/* Header with View Toggle */}
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-gray-800">
                Booking Management
              </h1>
              
              {/* View Toggle Buttons */}
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">View:</span>
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setBookingView("table")}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      bookingView === "table"
                        ? "bg-white text-blue-600 shadow-sm"
                        : "text-gray-600 hover:text-gray-800"
                    }`}
                  >
                    Table View
                  </button>
                  <button
                    onClick={() => setBookingView("card")}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      bookingView === "card"
                        ? "bg-white text-blue-600 shadow-sm"
                        : "text-gray-600 hover:text-gray-800"
                    }`}
                  >
                    Card View
                  </button>
                </div>
              </div>
            </div>

            {/* Render either Table View or Card View */}
            {bookingView === "table" ? (
              // Original Table View
              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                {bookings.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Ref No
                          </th>
                          <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Customer
                          </th>
                          <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Email
                          </th>
                          <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Phone
                          </th>
                          <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Guests
                          </th>
                          <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Amount
                          </th>
                          <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Payment
                          </th>
                          <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="p-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {bookings.map((b) => (
                          <tr
                            key={b.id}
                            className="hover:bg-gray-50 cursor-pointer transition-colors"
                            onClick={() => {
                              setSelectedBooking(b);
                              setModalOpen(true);
                            }}
                          >
                            <td className="p-4 text-sm font-medium text-gray-900">
                              {b.bookingReference}
                            </td>
                            <td className="p-4 text-sm text-gray-900">
                              {b.customerName}
                            </td>
                            <td className="p-4 text-sm text-gray-600">
                              {b.customerEmail}
                            </td>
                            <td className="p-4 text-sm text-gray-600">
                              {b.customerPhone}
                            </td>
                            <td className="p-4 text-sm text-gray-600">
                              {b.numberOfTravelers}
                            </td>
                            <td className="p-4 text-sm font-semibold text-green-600">
                              ₹{b.totalAmount?.toLocaleString()}
                            </td>
                            <td className="p-4 text-sm text-gray-600 capitalize">
                              {b.paymentMethod}
                            </td>
                            <td className="p-4">
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  b.bookingStatus === "confirmed"
                                    ? "bg-green-100 text-green-800"
                                    : b.bookingStatus === "cancelled"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-yellow-100 text-yellow-800"
                                }`}
                              >
                                {b.bookingStatus}
                              </span>
                            </td>
                            <td className="p-4 text-center">
                              <button
                                className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedBooking(b);
                                  setModalOpen(true);
                                }}
                              >
                                View Details
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <svg
                      className="w-16 h-16 text-gray-400 mx-auto mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No bookings found
                    </h3>
                    <p className="text-gray-600">
                      There are no bookings to display at the moment.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              // New Card View using BookingManagementSystem
              <BookingManagementSystem />
            )}

            {/* Booking Detail Modal */}
            {modalOpen && selectedBooking && (
              <BookingDetailModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                booking={selectedBooking}
                onConfirm={handleConfirm}
                onCancel={handleCancel}
              />
            )}
          </div>
        );

      case "carousel":
        return <CarouselPanel />;

      case "employees":
        return (
          <div>
            <div className="flex justify-end mb-4">
              <button
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                onClick={() => setShowEmployeeModal(true)}
              >
                Create Employee
              </button>
            </div>
            {showEmployeeModal && (
              <CreateEmployeeModal
                onClose={() => {
                  setShowEmployeeModal(false);
                }}
              />
            )}
          </div>
        );

      case "reviews":
        return <ReviewList />;

      default:
        return null;
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Welcome back, {user?.name || "Admin"}! Manage your tours, bookings, and content.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        {[
          { key: "tours", label: "Tours", icon: "🏔️" },
          { key: "bookings", label: "Bookings", icon: "📋" },
          { key: "carousel", label: "Carousel", icon: "🖼️" },
          { key: "employees", label: "Employees", icon: "👥" },
          { key: "reviews", label: "Reviews", icon: "⭐" },
        ].map((tab) => (
          <button
            key={tab.key}
            className={`flex items-center px-4 py-3 rounded-lg capitalize font-medium transition-colors ${
              activeTab === tab.key
                ? "bg-blue-600 text-white shadow-md"
                : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
            }`}
            onClick={() => setActiveTab(tab.key)}
          >
            <span className="mr-2">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default AdminDashboard;