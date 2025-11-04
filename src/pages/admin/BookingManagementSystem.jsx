import React, { useState, useMemo, useEffect, useCallback } from "react";
import BookingDetailModal from "./BookingDetailModal";
import { useBookings } from "../../hooks/useBookings";

const BookingManagementSystem = () => {
  const [selectedTour, setSelectedTour] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const { 
    bookings, 
    loading, 
    error, 
    fetchBookings, 
    changeBookingStatus,
    removeBooking 
  } = useBookings(true); // true for admin

  // Sample tours data - replace with actual API call
  const tours = [
    { id: '1', name: 'Himalayan Trek', category: 'Adventure', destination: 'Himalayas' },
    { id: '2', name: 'Kerala Backwaters', category: 'Cultural', destination: 'Kerala' },
    { id: '3', name: 'Rajasthan Heritage', category: 'Cultural', destination: 'Rajasthan' },
    { id: '4', name: 'Goa Beach Tour', category: 'Leisure', destination: 'Goa' },
  ];

  // Fetch bookings on component mount
  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  // Filter and search logic
  const filteredBookings = useMemo(() => {
    if (!bookings || !Array.isArray(bookings)) return [];
    
    return bookings.filter(booking => {
      const tourMatch = selectedTour === 'all' || booking.tourId === selectedTour;
      const statusMatch = statusFilter === 'all' || booking.bookingStatus === statusFilter;
      const dateMatch = !dateFilter || 
        (booking.travelDate && booking.travelDate.includes(dateFilter)) ||
        (booking.createdAt && booking.createdAt.includes(dateFilter));
      const searchMatch = !searchTerm || 
        booking.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.bookingReference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.customerEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.tour?.name?.toLowerCase().includes(searchTerm.toLowerCase());
      
      return tourMatch && statusMatch && dateMatch && searchMatch;
    });
  }, [bookings, selectedTour, statusFilter, dateFilter, searchTerm]);

  // Pagination logic
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentBookings = filteredBookings.slice(startIndex, startIndex + itemsPerPage);

  const openBookingModal = (booking) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };

  const handleConfirm = async (bookingId) => {
    try {
      await changeBookingStatus(bookingId, 'confirmed');
      await fetchBookings(); // Refresh the list
      setIsModalOpen(false);
    } catch (error) {
      console.error('Failed to confirm booking:', error);
    }
  };

  const handleCancel = async (bookingId) => {
    try {
      await changeBookingStatus(bookingId, 'cancelled');
      await fetchBookings(); // Refresh the list
      setIsModalOpen(false);
    } catch (error) {
      console.error('Failed to cancel booking:', error);
    }
  };

  const handleDelete = async (bookingId) => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      try {
        await removeBooking(bookingId);
        await fetchBookings(); // Refresh the list
      } catch (error) {
        console.error('Failed to delete booking:', error);
      }
    }
  };

  const resetFilters = () => {
    setSelectedTour('all');
    setStatusFilter('all');
    setDateFilter('');
    setSearchTerm('');
    setCurrentPage(1);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
      confirmed: { color: 'bg-green-100 text-green-800', label: 'Confirmed' },
      cancelled: { color: 'bg-red-100 text-red-800', label: 'Cancelled' },
    };
    
    const config = statusConfig[status] || { color: 'bg-gray-100 text-gray-800', label: status };
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  if (loading && bookings.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Booking Management</h1>
          <p className="text-gray-600 mt-2">Manage and monitor all tour bookings</p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span className="text-red-800">{error}</span>
            </div>
          </div>
        )}

        {/* Filters Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
            {/* Tour Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tour</label>
              <select 
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={selectedTour}
                onChange={(e) => {
                  setSelectedTour(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="all">All Tours</option>
                {tours.map(tour => (
                  <option key={tour.id} value={tour.id}>
                    {tour.name}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select 
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            
            {/* Date Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Travel Date</label>
              <input
                type="date"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={dateFilter}
                onChange={(e) => {
                  setDateFilter(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
            
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <input
                type="text"
                placeholder="Name, reference, email..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
            
            {/* Clear Filters */}
            <div className="flex items-end">
              <button 
                className="w-full p-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                onClick={resetFilters}
              >
                Clear Filters
              </button>
            </div>
          </div>
          
          {/* Results Count */}
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Showing {filteredBookings.length} of {bookings.length} bookings
            </div>
            {loading && (
              <div className="flex items-center text-sm text-blue-600">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                Updating...
              </div>
            )}
          </div>
        </div>

        {/* Bookings Grid */}
        {currentBookings.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your filters or search terms</p>
            <button 
              onClick={resetFilters}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {currentBookings.map(booking => (
                <div 
                  key={booking.id} 
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-md transition-all duration-200 hover:border-gray-300"
                  onClick={() => openBookingModal(booking)}
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-semibold text-lg text-gray-900 truncate">{booking.customerName}</h3>
                    {getStatusBadge(booking.bookingStatus)}
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-2">Ref: <span className="font-mono">{booking.bookingReference}</span></p>
                  <p className="text-sm font-medium text-blue-600 mb-3 truncate">
                    {booking.tour?.name || booking.tourName || 'Unknown Tour'}
                  </p>
                  
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Guests:</span>
                      <span className="font-medium">{booking.numberOfTravelers}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Amount:</span>
                      <span className="font-semibold text-green-600">₹{booking.totalAmount?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Payment:</span>
                      <span className="capitalize">{booking.paymentMethod}</span>
                    </div>
                    {booking.travelDate && (
                      <div className="flex justify-between">
                        <span>Travel Date:</span>
                        <span className="text-gray-900">{new Date(booking.travelDate).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                    <span className="text-xs text-gray-500">
                      {new Date(booking.createdAt).toLocaleDateString()}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(booking.id);
                      }}
                      className="text-red-600 hover:text-red-800 p-1 rounded transition-colors"
                      title="Delete booking"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => prev - 1)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-2 border rounded-lg transition-colors ${
                      currentPage === page 
                        ? 'bg-blue-600 text-white border-blue-600' 
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}

        {/* Modal */}
        <BookingDetailModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          booking={selectedBooking}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
          isLoading={loading}
        />
      </div>
    </div>
  );
};

export default BookingManagementSystem;