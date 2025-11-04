// src/components/admin/CreateTourModal.jsx
import { useState } from "react";
import { useTours } from "../../hooks/useTours";

const CreateTourModal = ({ onClose, onTourCreated }) => {
  const { createTour } = useTours();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [imageFiles, setImageFiles] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    price: "",
    duration: "",
    seats: "",
    capacity: "20",
    category: "domestic",
    tourType: "group",
    shortDescription: "",
    overview: "",
    destination: "",
    state: "",
    country: "India",
    discount: "0",
    isPopular: false,
    departureDate: "",
    returnDate: ""
  });

  const [itineraryItems, setItineraryItems] = useState([]);
  const [inclusionItems, setInclusionItems] = useState([""]);
  const [exclusionItems, setExclusionItems] = useState([""]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleImageChange = (e) => {
    setImageFiles(Array.from(e.target.files));
  };

  // Itinerary management
  const addItineraryItem = () => {
    setItineraryItems((prev) => [...prev, { title: "", description: "", activities: "" }]);
  };

  const updateItineraryItem = (index, field, value) => {
    const updated = [...itineraryItems];
    updated[index][field] = value;
    setItineraryItems(updated);
  };

  // Inclusion/Exclusion management
  const updateListItems = (items, setItems) => {
    setItems(items);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const submitData = new FormData();

      // Append basic form fields
      Object.keys(formData).forEach((key) => submitData.append(key, formData[key]));

      // Append filtered itineraries
      const filteredItineraries = itineraryItems.filter(
        (item) => item.title || item.description || item.activities
      );
      submitData.append("itineraries", JSON.stringify(filteredItineraries));

      // Append filtered inclusions and exclusions
      const filteredInclusions = inclusionItems.filter((i) => i.trim() !== "");
      submitData.append("inclusions", JSON.stringify(filteredInclusions));

      const filteredExclusions = exclusionItems.filter((i) => i.trim() !== "");
      submitData.append("exclusions", JSON.stringify(filteredExclusions));

      // Append images
      imageFiles.forEach((file) => submitData.append("images", file));

      await createTour(submitData);
      onTourCreated?.();
      onClose();
    } catch (err) {
      setError(err.message || "Failed to create tour");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Create New Tour</h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="title"
              placeholder="Tour Title"
              value={formData.title}
              onChange={handleChange}
              className="w-full border p-3 rounded"
              required
            />
            <input
              type="number"
              name="price"
              placeholder="Price"
              value={formData.price}
              onChange={handleChange}
              className="w-full border p-3 rounded"
              step="0.01"
              required
            />
            <input
              type="number"
              name="duration"
              placeholder="Duration (days)"
              value={formData.duration}
              onChange={handleChange}
              className="w-full border p-3 rounded"
              required
            />
            <input
              type="number"
              name="seats"
              placeholder="Seats Available"
              value={formData.seats}
              onChange={handleChange}
              className="w-full border p-3 rounded"
              required
            />
            <input
              type="text"
              name="destination"
              placeholder="Destination"
              value={formData.destination}
              onChange={handleChange}
              className="w-full border p-3 rounded"
              required
            />
            <input
              type="text"
              name="state"
              placeholder="State"
              value={formData.state}
              onChange={handleChange}
              className="w-full border p-3 rounded"
            />
          </div>

          {/* Select Fields */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full border p-3 rounded"
            >
              <option value="domestic">Domestic</option>
              <option value="international">International</option>
            </select>

            <select
              name="tourType"
              value={formData.tourType}
              onChange={handleChange}
              className="w-full border p-3 rounded"
            >
              <option value="group">Group</option>
              <option value="private">Private</option>
              <option value="special">Special</option>
            </select>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="isPopular"
                checked={formData.isPopular}
                onChange={handleChange}
                className="mr-2"
              />
              <label>Popular Tour</label>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="date"
              name="departureDate"
              value={formData.departureDate}
              onChange={handleChange}
              className="w-full border p-3 rounded"
            />
            <input
              type="date"
              name="returnDate"
              value={formData.returnDate}
              onChange={handleChange}
              className="w-full border p-3 rounded"
            />
          </div>

          {/* Descriptions */}
          <textarea
            name="shortDescription"
            placeholder="Short Description"
            value={formData.shortDescription}
            onChange={handleChange}
            className="w-full border p-3 rounded"
            rows="3"
          />
          <textarea
            name="overview"
            placeholder="Detailed Overview"
            value={formData.overview}
            onChange={handleChange}
            className="w-full border p-3 rounded"
            rows="4"
          />

          {/* Image Upload */}
          <div>
            <label className="block mb-2 font-medium">Tour Images</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="w-full border p-3 rounded"
            />
            <p className="text-sm text-gray-600 mt-1">
              First image will be used as cover image
            </p>
          </div>

          {/* Itinerary Section */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <label className="block font-medium">Itinerary</label>
              
            </div>
            {itineraryItems.map((item, index) => (
              <div key={index} className="border p-3 rounded mb-3">
                <h4 className="font-medium mb-2">Day {index + 1}</h4>
                <input
                  type="text"
                  placeholder="Title"
                  value={item.title}
                  onChange={(e) => updateItineraryItem(index, "title", e.target.value)}
                  className="w-full border p-2 rounded mb-2"
                />
                <textarea
                  placeholder="Description"
                  value={item.description}
                  onChange={(e) => updateItineraryItem(index, "description", e.target.value)}
                  className="w-full border p-2 rounded mb-2"
                  rows="2"
                />
                <textarea
                  placeholder="Activities"
                  value={item.activities}
                  onChange={(e) => updateItineraryItem(index, "activities", e.target.value)}
                  className="w-full border p-2 rounded"
                  rows="2"
                />
              </div>
              
            ))}
            <button
                type="button"
                onClick={addItineraryItem}
                className="px-3 py-1 bg-green-500 text-white rounded"
              >
                Add Day
              </button>
          </div>

          {/* Inclusions & Exclusions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 font-medium">Inclusions</label>
              {inclusionItems.map((item, index) => (
                <input
                  key={index}
                  type="text"
                  placeholder={`Inclusion ${index + 1}`}
                  value={item}
                  onChange={(e) => {
                    const updated = [...inclusionItems];
                    updated[index] = e.target.value;
                    updateListItems(updated, setInclusionItems);
                  }}
                  className="w-full border p-2 rounded mb-2"
                />
              ))}
              <button
                type="button"
                onClick={() => setInclusionItems((prev) => [...prev, ""])}
                className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
              >
                Add Inclusion
              </button>
            </div>

            <div>
              <label className="block mb-2 font-medium">Exclusions</label>
              {exclusionItems.map((item, index) => (
                <input
                  key={index}
                  type="text"
                  placeholder={`Exclusion ${index + 1}`}
                  value={item}
                  onChange={(e) => {
                    const updated = [...exclusionItems];
                    updated[index] = e.target.value;
                    updateListItems(updated, setExclusionItems);
                  }}
                  className="w-full border p-2 rounded mb-2"
                />
              ))}
              <button
                type="button"
                onClick={() => setExclusionItems((prev) => [...prev, ""])}
                className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
              >
                Add Exclusion
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-gray-300 rounded hover:bg-gray-400"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Tour"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTourModal;
