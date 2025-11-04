import React, { useState, useEffect } from "react";

const BookingDetailModal = ({ 
  open, 
  onClose, 
  booking, 
  onConfirm, 
  onCancel,
  isLoading = false 
}) => {
  const [activeTab, setActiveTab] = useState('details');
  const [notes, setNotes] = useState('');
  
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    
    if (open) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [open, onClose]);

  // Reset tabs when modal opens/closes
  useEffect(() => {
    if (open) {
      setActiveTab('details');
      setNotes(booking?.specialRequirements || '');
    }
  }, [open, booking]);

  if (!open || !booking) return null;

  const handleConfirm = () => {
    onConfirm(booking.id);
  };

  const handleCancel = () => {
    onCancel(booking.id);
  };

  const renderTabContent = () => {
    switch(activeTab) {
      case 'details':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Reference</label>
                <p className="font-semibold text-gray-900">{booking.bookingReference}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Status</label>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  booking.bookingStatus === 'confirmed' ? 'bg-green-100 text-green-800' :
                  booking.bookingStatus === 'cancelled' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {booking.bookingStatus}
                </span>
              </div>
            </div>
            
            <div className="border-t pt-3">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Customer Information</h3>
              <div className="grid grid-cols-1 gap-2">
                <div>
                  <label className="text-xs text-gray-500">Full Name</label>
                  <p className="font-medium">{booking.customerName}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-500">Email</label>
                    <p className="text-sm">{booking.customerEmail}</p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Phone</label>
                    <p className="text-sm">{booking.customerPhone}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t pt-3">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Booking Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500">Number of Travelers</label>
                  <p className="font-medium">{booking.numberOfTravelers}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-500">Total Amount</label>
                  <p className="font-medium text-green-600">₹{booking.totalAmount?.toLocaleString()}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-500">Payment Method</label>
                  <p className="text-sm capitalize">{booking.paymentMethod}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-500">Travel Date</label>
                  <p className="text-sm">{booking.travelDate ? new Date(booking.travelDate).toLocaleDateString() : 'Not specified'}</p>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'tour':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Tour Name</label>
              <p className="font-semibold text-gray-900">{booking.tour?.name || booking.tourName || 'N/A'}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Destination</label>
                <p className="text-sm">{booking.tour?.destination || 'N/A'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Duration</label>
                <p className="text-sm">{booking.tour?.duration || booking.duration || 'N/A'} days</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Category</label>
                <p className="text-sm capitalize">{booking.tour?.category || 'N/A'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Difficulty</label>
                <p className="text-sm capitalize">{booking.tour?.difficulty || 'N/A'}</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Description</label>
              <p className="text-sm text-gray-600">
                {booking.tour?.description || 'No description available.'}
              </p>
            </div>
          </div>
        );
      
      case 'notes':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Special Requirements</label>
              <textarea 
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Add special requirements or notes about this booking..."
                rows="4"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
            
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-xs text-blue-700">
                <strong>Note:</strong> These notes are for internal use and will be visible to tour operators.
              </p>
            </div>
            
            <button 
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              disabled={!notes.trim()}
            >
              Save Notes
            </button>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 p-4 transition-opacity duration-300"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden transform transition-transform duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Booking Details</h2>
            <p className="text-sm text-gray-500 mt-1">Manage booking information</p>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <div className="flex px-6">
            {[
              { key: 'details', label: 'Details', icon: '📋' },
              { key: 'tour', label: 'Tour Info', icon: '🏔️' },
              { key: 'notes', label: 'Notes', icon: '📝' }
            ].map(tab => (
              <button
                key={tab.key}
                className={`flex items-center px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === tab.key 
                    ? 'border-blue-600 text-blue-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab(tab.key)}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        
        {/* Content */}
        <div className="p-6 max-h-[400px] overflow-y-auto">
          {renderTabContent()}
        </div>
        
        {/* Action Buttons */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          {booking.bookingStatus !== "confirmed" && booking.bookingStatus !== "cancelled" && (
            <button
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center"
              onClick={handleConfirm}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Confirm Booking
                </>
              )}
            </button>
          )}
          
          {booking.bookingStatus !== "cancelled" && (
            <button
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center"
              onClick={handleCancel}
              disabled={isLoading}
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Cancel Booking
            </button>
          )}
          
          <button
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailModal;