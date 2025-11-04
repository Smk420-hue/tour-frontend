import { useState, useEffect } from "react";
import {
  getCarousels,
  createCarousel,
  updateCarousel,
  deleteCarousel,
  toggleCarousel
} from "../../api/carouselApi";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const CarouselPanel = () => {
  const [carouselItems, setCarouselItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    position: "center",
    textAlign: "center",
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);

  // Clear messages after timeout
  const clearMessages = () => {
    setTimeout(() => {
      setError("");
      setSuccess("");
    }, 5000);
  };

  // Fetch carousel items
  const fetchCarouselItems = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getCarousels();
      setCarouselItems(Array.isArray(data) ? data : []);
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to fetch carousel items";
      setError(errorMessage);
      console.error("Error fetching carousel items:", err);
      setCarouselItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCarouselItems();
  }, []);

  // Handle form input
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    
    if (name === "image") {
      const file = files[0];
      if (file) {
        // Validate file type
        if (!file.type.startsWith('image/')) {
          setError("Please select a valid image file");
          return;
        }
        
        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          setError("Image size should be less than 5MB");
          return;
        }

        setFormData((prev) => ({ ...prev, image: file }));
        
        // Create image preview
        const reader = new FileReader();
        reader.onload = (e) => {
          setImagePreview(e.target.result);
        };
        reader.readAsDataURL(file);
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      position: "center",
      textAlign: "center",
      image: null,
    });
    setImagePreview(null);
    setEditingId(null);
    setError("");
  };

  // Create or update carousel item
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");

    // Validation
    if (!formData.title.trim()) {
      setError("Title is required");
      setSubmitting(false);
      return;
    }

    if (!editingId && !formData.image) {
      setError("Image is required for new items");
      setSubmitting(false);
      return;
    }

    const data = new FormData();
    
    // Append all form data
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("position", formData.position);
    data.append("textAlign", formData.textAlign);
    data.append("isActive", "true"); // Default to active
    
    // Only append image if it's a new file
    if (formData.image) {
      data.append("image", formData.image);
    }

    try {
      if (editingId) {
        await updateCarousel(editingId, data);
        setSuccess("Carousel item updated successfully!");
      } else {
        await createCarousel(data);
        setSuccess("Carousel item created successfully!");
      }

      resetForm();
      fetchCarouselItems();
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to save carousel item";
      setError(errorMessage);
      console.error("Error submitting carousel form:", err);
    } finally {
      setSubmitting(false);
      clearMessages();
    }
  };

  // Edit carousel item
  const handleEdit = (item) => {
    setEditingId(item.id);
    setFormData({
      title: item.title,
      description: item.description || "",
      position: item.position || "center",
      textAlign: item.textAlign || "center",
      image: null,
    });
    // Use the Cloudinary URL for preview when editing
    setImagePreview(item.imageUrl);
    setError("");
    setSuccess("");
  };

  // Delete carousel item
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this carousel item?")) return;
    
    setLoading(true);
    setError("");
    try {
      await deleteCarousel(id);
      setSuccess("Carousel item deleted successfully!");
      fetchCarouselItems();
      clearMessages();
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to delete carousel item";
      setError(errorMessage);
      console.error("Error deleting carousel item:", err);
    } finally {
      setLoading(false);
    }
  };

  // Toggle carousel item status
  const handleToggle = async (id, currentStatus) => {
    setLoading(true);
    try {
      await toggleCarousel(id);
      setSuccess(`Carousel item ${!currentStatus ? 'activated' : 'deactivated'} successfully!`);
      fetchCarouselItems();
      clearMessages();
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to toggle carousel status";
      setError(errorMessage);
      console.error("Error toggling carousel status:", err);
    } finally {
      setLoading(false);
    }
  };

  // Cancel edit
  const handleCancel = () => {
    resetForm();
  };

  return (
    <div className="p-6 bg-white rounded shadow-md">
      <h2 className="text-2xl font-bold mb-6">Carousel Management</h2>

      {/* Messages */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          {success}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4 mb-8 p-4 border rounded-lg bg-gray-50">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter carousel title"
              className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter description"
              rows={2}
              className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Text Position
            </label>
            <select
              name="position"
              value={formData.position}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="top">Top</option>
              <option value="center">Center</option>
              <option value="bottom">Bottom</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Text Alignment
            </label>
            <select
              name="textAlign"
              value={formData.textAlign}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Image {!editingId && "*"}
          </label>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">
            {editingId ? "Leave empty to keep current image" : "Supported formats: JPEG, PNG, GIF, WebP. Max size: 5MB"}
          </p>
          
          {/* Image Preview */}
          {imagePreview && (
            <div className="mt-2">
              <p className="text-sm font-medium text-gray-700 mb-1">
                {editingId && !formData.image ? "Current Image" : "Preview"}
              </p>
              <img
                src={imagePreview}
                alt="Preview"
                className="w-32 h-20 object-cover rounded border"
              />
            </div>
          )}
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "Saving..." : editingId ? "Update Carousel" : "Add Carousel"}
          </button>
          
          {editingId && (
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Loading Spinner */}
      {(loading || submitting) && <LoadingSpinner />}

      {/* Carousel Items Table */}
      <div className="overflow-x-auto">
        <table className="w-full table-auto border border-gray-200">
          <thead>
            <tr className="bg-gray-50">
              <th className="border border-gray-200 px-4 py-3 text-left font-semibold">Image</th>
              <th className="border border-gray-200 px-4 py-3 text-left font-semibold">Title</th>
              <th className="border border-gray-200 px-4 py-3 text-left font-semibold">Description</th>
              <th className="border border-gray-200 px-4 py-3 text-left font-semibold">Position</th>
              <th className="border border-gray-200 px-4 py-3 text-left font-semibold">Text Align</th>
              <th className="border border-gray-200 px-4 py-3 text-left font-semibold">Status</th>
              <th className="border border-gray-200 px-4 py-3 text-left font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {carouselItems.length > 0 ? (
              carouselItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="border border-gray-200 p-2">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-20 h-12 object-cover rounded mx-auto"
                      onError={(e) => {
                        e.target.src = '/images/placeholder.jpg';
                      }}
                    />
                  </td>
                  <td className="border border-gray-200 px-4 py-2 font-medium">{item.title}</td>
                  <td className="border border-gray-200 px-4 py-2 max-w-xs truncate">
                    {item.description || "-"}
                  </td>
                  <td className="border border-gray-200 px-4 py-2 capitalize">{item.position}</td>
                  <td className="border border-gray-200 px-4 py-2 capitalize">{item.textAlign}</td>
                  <td className="border border-gray-200 px-4 py-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      item.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {item.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="border border-gray-200 px-4 py-2">
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={() => handleEdit(item)}
                        className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 focus:ring-2 focus:ring-yellow-500 focus:ring-offset-1 text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleToggle(item.id, item.isActive)}
                        className={`px-3 py-1 rounded focus:ring-2 focus:ring-offset-1 text-sm ${
                          item.isActive
                            ? 'bg-orange-500 text-white hover:bg-orange-600 focus:ring-orange-500'
                            : 'bg-green-500 text-white hover:bg-green-600 focus:ring-green-500'
                        }`}
                      >
                        {item.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-1 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="border border-gray-200 px-4 py-8 text-center text-gray-500">
                  {loading ? "Loading..." : "No carousel items found."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CarouselPanel;