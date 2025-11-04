import React from "react";

const BookingsTable = ({ bookings }) => {
  return (
    <div className="overflow-x-auto bg-white rounded shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left">Booking Ref</th>
            <th className="px-4 py-2 text-left">Tour</th>
            <th className="px-4 py-2 text-left">Customer</th>
            <th className="px-4 py-2 text-left">Travel Date</th>
            <th className="px-4 py-2 text-left">Status</th>
            <th className="px-4 py-2 text-left">Amount</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map(b => (
            <tr key={b.id} className="hover:bg-gray-100">
              <td className="px-4 py-2">{b.bookingReference}</td>
              <td className="px-4 py-2">{b.Tour.title}</td>
              <td className="px-4 py-2">{b.User.name}</td>
              <td className="px-4 py-2">{new Date(b.travelDate).toLocaleDateString()}</td>
              <td className="px-4 py-2">{b.bookingStatus}</td>
              <td className="px-4 py-2">₹{b.totalAmount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BookingsTable;
