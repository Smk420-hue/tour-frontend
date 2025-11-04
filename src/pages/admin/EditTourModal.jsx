// src/components/admin/EditTourModal.jsx
import { useState, useEffect } from "react";
import { useTours } from "../../hooks/useTours";
import LoadingSpinner from "../common/LoadingSpinner";

const EditTourModal = ({ tour, isOpen, onClose }) => {
  const { updateTour } = useTours();
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    duration: "",
    seats: "",
    category: "",
    tourType: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (tour) setFormData({ ...tour });
  }, [tour]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await updateTour(tour.id, formData);
    setLoading(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded w-96 relative">
        <h2 className="text-xl font-bold mb-4">Edit Tour</h2>
        {loading ? (
          <LoadingSpinner />
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input
              type="text"
              name="title"
              placeholder="Title"
              value={formData.title}
              onChange={handleChange}
              className="border p-2 rounded"
              required
            />
            <input
              type="number"
              name="price"
              placeholder="Price"
              value={formData.price}
              onChange={handleChange}
              className="border p-2 rounded"
              required
            />
            <input
              type="number"
              name="duration"
              placeholder="Duration (days)"
              value={formData.duration}
              onChange={handleChange}
              className="border p-2 rounded"
              required
            />
            <input
              type="number"
              name="seats"
              placeholder="Seats"
              value={formData.seats}
              onChange={handleChange}
              className="border p-2 rounded"
              required
            />
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="border p-2 rounded"
            >
              <option value="">Select Category</option>
              <option value="domestic">Domestic</option>
              <option value="international">International</option>
            </select>
            <select
              name="tourType"
              value={formData.tourType}
              onChange={handleChange}
              className="border p-2 rounded"
            >
              <option value="">Select Tour Type</option>
              <option value="group">Group</option>
              <option value="special">Special</option>
              <option value="customizable">Customizable</option>
            </select>
            <div className="flex justify-end gap-2 mt-3">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1 bg-gray-400 rounded hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default EditTourModal;
