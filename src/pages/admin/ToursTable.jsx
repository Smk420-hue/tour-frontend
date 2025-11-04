import React from "react";

const ToursTable = ({ tours, onEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto bg-white rounded shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left">Title</th>
            <th className="px-4 py-2 text-left">Category</th>
            <th className="px-4 py-2 text-left">Type</th>
            <th className="px-4 py-2 text-left">Price</th>
            <th className="px-4 py-2 text-left">Duration</th>
            <th className="px-4 py-2 text-left">Available Seats</th>
            <th className="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tours.map(tour => (
            <tr key={tour.id} className="hover:bg-gray-100">
              <td className="px-4 py-2">{tour.title}</td>
              <td className="px-4 py-2">{tour.category}</td>
              <td className="px-4 py-2">{tour.tourType}</td>
              <td className="px-4 py-2">₹{tour.price}</td>
              <td className="px-4 py-2">{tour.duration} days</td>
              <td className="px-4 py-2">{tour.availableSeats}</td>
              <td className="px-4 py-2 space-x-2">
                <button
                  onClick={() => onEdit(tour)}
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(tour.id)}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ToursTable;
