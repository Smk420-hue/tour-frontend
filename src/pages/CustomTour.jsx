// src/pages/CustomTour.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { submitCustomTour } from "../api/customTourApi";

const CustomTour = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    tourType: "",
    destinationType: "",
    stayType: "",
    days: "",
    persons: "",
    fromDate: "",
    toDate: "",
    interests: "",
    budgetRange: "",
    transportMode: "",
    comments: "",
    name: "",
    email: "",
    phone: "",
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  // handle input changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => formData.append(key, value));
    if (image) formData.append("image", image);

    try {
      await submitCustomTour(formData);
      navigate("/thankyou");
    } catch (error) {
      alert("Error submitting form. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-center p-6">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-3xl w-full">
        <h1 className="text-2xl font-bold mb-6 text-center text-indigo-700">
          Customize Your Tour
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Tour Type */}
          <div>
            <label className="block font-medium mb-1">Tour Type</label>
            <select
              name="tourType"
              value={form.tourType}
              onChange={handleChange}
              required
              className="w-full border rounded-lg p-2"
            >
              <option value="">Select Type</option>
              <option value="Domestic">Domestic</option>
              <option value="International">International</option>
            </select>
          </div>

          {/* Destination */}
          <div>
            <label className="block font-medium mb-1">
              {form.tourType === "Domestic" ? "State" : "Country"}
            </label>
            <input
              type="text"
              name="destinationType"
              value={form.destinationType}
              onChange={handleChange}
              placeholder={
                form.tourType === "Domestic"
                  ? "Enter State"
                  : "Enter Country"
              }
              required
              className="w-full border rounded-lg p-2"
            />
          </div>

          {/* Stay Type */}
          <div>
            <label className="block font-medium mb-1">Stay Type</label>
            <select
              name="stayType"
              value={form.stayType}
              onChange={handleChange}
              required
              className="w-full border rounded-lg p-2"
            >
              <option value="">Select Stay Type</option>
              <option value="Premium">Premium</option>
              <option value="Budget Friendly">Budget Friendly</option>
            </select>
          </div>

          {/* Days & Persons */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-1">Number of Days</label>
              <input
                type="number"
                name="days"
                value={form.days}
                onChange={handleChange}
                required
                className="w-full border rounded-lg p-2"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Number of Persons</label>
              <input
                type="number"
                name="persons"
                value={form.persons}
                onChange={handleChange}
                required
                className="w-full border rounded-lg p-2"
              />
            </div>
          </div>

          {/* Travel Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-1">From Date</label>
              <input
                type="date"
                name="fromDate"
                value={form.fromDate}
                onChange={handleChange}
                className="w-full border rounded-lg p-2"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">To Date</label>
              <input
                type="date"
                name="toDate"
                value={form.toDate}
                onChange={handleChange}
                className="w-full border rounded-lg p-2"
              />
            </div>
          </div>

          {/* Budget Range */}
          <div>
            <label className="block font-medium mb-1">Budget Range</label>
            <select
              name="budgetRange"
              value={form.budgetRange}
              onChange={handleChange}
              className="w-full border rounded-lg p-2"
            >
              <option value="">Select</option>
              <option value="Below ₹25,000">Below ₹25,000</option>
              <option value="₹25,000–₹50,000">₹25,000–₹50,000</option>
              <option value="₹50,000+">₹50,000+</option>
            </select>
          </div>

          {/* Transport Mode */}
          <div>
            <label className="block font-medium mb-1">Transport Mode</label>
            <select
              name="transportMode"
              value={form.transportMode}
              onChange={handleChange}
              className="w-full border rounded-lg p-2"
            >
              <option value="">Select</option>
              <option value="Flight">Flight</option>
              <option value="Train">Train</option>
              <option value="Car">Car</option>
              <option value="Cruise">Cruise</option>
            </select>
          </div>

          {/* Interests */}
          <div>
            <label className="block font-medium mb-1">Travel Interests</label>
            <input
              type="text"
              name="interests"
              value={form.interests}
              onChange={handleChange}
              placeholder="e.g. Adventure, Beach, Honeymoon"
              className="w-full border rounded-lg p-2"
            />
          </div>

          {/* Comments */}
          <div>
            <label className="block font-medium mb-1">Additional Requests</label>
            <textarea
              name="comments"
              value={form.comments}
              onChange={handleChange}
              rows="3"
              className="w-full border rounded-lg p-2"
              placeholder="e.g. Need vegetarian meals, early check-in..."
            ></textarea>
          </div>

          {/* Upload Image */}
          <div>
            <label className="block font-medium mb-1">Upload Image (optional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
              className="w-full border rounded-lg p-2"
            />
          </div>

          {/* Contact Info */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Full Name"
              required
              className="border rounded-lg p-2"
            />
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
              required
              className="border rounded-lg p-2"
            />
            <input
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Phone Number"
              required
              className="border rounded-lg p-2"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CustomTour;
