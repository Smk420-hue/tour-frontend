// src/components/admin/UpdateTourModal.jsx
import { useState, useEffect } from "react";
import { useTours } from "../../hooks/useTours";

const UpdateTourModal = ({ tour, onClose, onTourUpdated }) => {
  const { updateTour, getTour } = useTours();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState("");
  const [imageFiles, setImageFiles] = useState([]);
  const [deletedImages, setDeletedImages] = useState([]);
  const [selectedCoverImage, setSelectedCoverImage] = useState("");
  const [coverImageId, setCoverImageId] = useState("");
  const [fullTourData, setFullTourData] = useState(null);
  const [fetchError, setFetchError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    price: "",
    duration: "",
    seats: "",
    capacity: "",
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
    returnDate: "",
  });

  const [itineraryItems, setItineraryItems] = useState([]);
  const [inclusionItems, setInclusionItems] = useState([""]);
  const [exclusionItems, setExclusionItems] = useState([""]);

  // Fetch complete tour data with associations
  useEffect(() => {
    const fetchFullTourData = async () => {
      if (tour && tour.id) {
        try {
          setFetchLoading(true);
          setFetchError("");
          console.log("🔄 Fetching complete tour data for ID:", tour.id);
          const completeTour = await getTour(tour.id);
          
          console.log("✅ Complete tour data received:", completeTour);
          setFullTourData(completeTour);
          
        } catch (error) {
          console.error("❌ Error fetching complete tour data:", error);
          setFetchError(error.message);
          // If fetch fails, use the basic tour data we have
          setFullTourData(tour);
        } finally {
          setFetchLoading(false);
        }
      }
    };

    fetchFullTourData();
  }, [tour, getTour]);

  // Initialize form when fullTourData is available
  useEffect(() => {
    if (fullTourData && !fetchLoading) {
      console.log("🔍 Initializing form with data:", fullTourData);
      
      // Set basic form data
      setFormData({
        title: fullTourData.title || "",
        price: fullTourData.price || "",
        duration: fullTourData.duration || "",
        seats: fullTourData.seats || "",
        capacity: fullTourData.capacity || "20",
        category: fullTourData.category || "domestic",
        tourType: fullTourData.tourType || "group",
        shortDescription: fullTourData.shortDescription || "",
        overview: fullTourData.overview || "",
        destination: fullTourData.destination || "",
        state: fullTourData.state || "",
        country: fullTourData.country || "India",
        discount: fullTourData.discount || "0",
        isPopular: fullTourData.isPopular || false,
        departureDate: fullTourData.departureDate ? fullTourData.departureDate.split('T')[0] : "",
        returnDate: fullTourData.returnDate ? fullTourData.returnDate.split('T')[0] : "",
      });

      // Set itinerary items
      const itineraries = fullTourData.itineraries || [];
      if (itineraries.length > 0) {
        const sortedItineraries = [...itineraries].sort((a, b) => (a.dayNumber || 0) - (b.dayNumber || 0));
        const processedItineraries = sortedItineraries.map(item => ({
          title: item.title || "",
          description: item.description || "",
          activities: item.activities || ""
        }));
        setItineraryItems(processedItineraries);
        console.log("🗓️ Processed itineraries:", processedItineraries);
      } else {
        setItineraryItems([]);
        console.log("🗓️ No itineraries found");
      }

      // Set inclusion items
      const inclusions = fullTourData.inclusions || [];
      if (inclusions.length > 0) {
        const inclusionTexts = inclusions.map(inc => inc.text || "");
        setInclusionItems(inclusionTexts);
        console.log("✅ Processed inclusions:", inclusionTexts);
      } else {
        setInclusionItems([""]);
        console.log("✅ No inclusions found");
      }

      // Set exclusion items
      const exclusions = fullTourData.exclusions || [];
      if (exclusions.length > 0) {
        const exclusionTexts = exclusions.map(exc => exc.text || "");
        setExclusionItems(exclusionTexts);
        console.log("❌ Processed exclusions:", exclusionTexts);
      } else {
        setExclusionItems([""]);
        console.log("❌ No exclusions found");
      }

      // Set cover image
      setSelectedCoverImage(fullTourData.coverImage || "");
      
      // Set cover image ID if it exists in images array
      const images = fullTourData.images || [];
      if (fullTourData.coverImage && images.length > 0) {
        const coverImg = images.find(img => img.imageUrl === fullTourData.coverImage);
        if (coverImg) {
          setCoverImageId(coverImg.id);
          console.log("🖼️ Cover image ID set:", coverImg.id);
        }
      }
    }
  }, [fullTourData, fetchLoading]);

  // Rest of the component functions remain the same
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (e) => {
    setImageFiles(Array.from(e.target.files));
  };

  const handleDeleteImage = (imageId, imageUrl) => {
    setDeletedImages(prev => [...prev, imageId]);
    if (imageUrl === selectedCoverImage) {
      setSelectedCoverImage("");
      setCoverImageId("");
    }
  };

  const handleSetCoverImage = (imageUrl, imageId) => {
    setSelectedCoverImage(imageUrl);
    setCoverImageId(imageId);
  };

  const addItineraryItem = () => {
    const newItem = { title: "", description: "", activities: "" };
    setItineraryItems(prev => [...prev, newItem]);
  };

  const removeItineraryItem = (index) => {
    setItineraryItems(prev => prev.filter((_, i) => i !== index));
  };

  const updateItineraryItem = (index, field, value) => {
    const updated = [...itineraryItems];
    updated[index][field] = value;
    setItineraryItems(updated);
  };

  const updateListItem = (index, value, items, setItems) => {
    const updated = [...items];
    updated[index] = value;
    setItems(updated);
  };

  const addListItem = (items, setItems) => {
    setItems([...items, ""]);
  };

  const removeListItem = (index, items, setItems) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const formDataToSend = new FormData();

      // Append all basic form fields
      Object.keys(formData).forEach((key) => {
        formDataToSend.append(key, formData[key]);
      });

      // Append processed arrays (filter out empty items)
      const filteredItineraries = itineraryItems.filter(item => 
        item.title.trim() !== "" || item.description.trim() !== "" || item.activities.trim() !== ""
      );
      const filteredInclusions = inclusionItems.filter(item => item.trim() !== '');
      const filteredExclusions = exclusionItems.filter(item => item.trim() !== '');

      console.log("🚀 Sending data to backend:", {
        itineraries: filteredItineraries,
        inclusions: filteredInclusions,
        exclusions: filteredExclusions,
        coverImageId,
        deletedImages,
        newImages: imageFiles.length
      });

      formDataToSend.append("itineraries", JSON.stringify(filteredItineraries));
      formDataToSend.append("inclusions", JSON.stringify(filteredInclusions));
      formDataToSend.append("exclusions", JSON.stringify(filteredExclusions));
      
      // Append deleted images array
      if (deletedImages.length > 0) {
        formDataToSend.append("deletedImages", JSON.stringify(deletedImages));
      }

      // Append cover image ID if selected
      if (coverImageId) {
        formDataToSend.append("coverImageId", coverImageId);
      }

      // Append new image files
      if (imageFiles.length > 0) {
        imageFiles.forEach((file) => {
          formDataToSend.append("images", file);
        });
      }

      // Send update request using tourApi
      await updateTour(tour.id, formDataToSend);
      
      if (onTourUpdated) {
        onTourUpdated();
      }
      
      alert("✅ Tour updated successfully!");
      onClose();
    } catch (error) {
      console.error("Error updating tour:", error);
      setError(error.message || "Failed to update tour");
      alert("❌ Failed to update tour");
    } finally {
      setLoading(false);
    }
  };

  if (!tour) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Update Tour: {tour.title}</h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {fetchError && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
            <p className="font-medium">⚠️ Could not load complete tour data</p>
            <p className="text-sm mt-1">{fetchError}</p>
            <p className="text-sm mt-1">You can still update basic information, but associations may not load correctly.</p>
          </div>
        )}

        {fetchLoading ? (
          <div className="text-center py-8">
            <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-4">
              🔄 Loading tour data...
            </div>
            <p className="text-gray-600">Please wait while we load the tour details.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Tour Title</label>
                <input
                  type="text"
                  name="title"
                  placeholder="Tour Title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full border p-3 rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Price</label>
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
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Duration (days)</label>
                <input
                  type="number"
                  name="duration"
                  placeholder="Duration"
                  value={formData.duration}
                  onChange={handleChange}
                  className="w-full border p-3 rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Seats Available</label>
                <input
                  type="number"
                  name="seats"
                  placeholder="Seats"
                  value={formData.seats}
                  onChange={handleChange}
                  className="w-full border p-3 rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Capacity</label>
                <input
                  type="number"
                  name="capacity"
                  placeholder="Capacity"
                  value={formData.capacity}
                  onChange={handleChange}
                  className="w-full border p-3 rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Discount</label>
                <input
                  type="number"
                  name="discount"
                  placeholder="Discount"
                  value={formData.discount}
                  onChange={handleChange}
                  className="w-full border p-3 rounded"
                  step="0.01"
                />
              </div>
            </div>

            {/* Destination, State, Country */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Destination</label>
                <input
                  type="text"
                  name="destination"
                  placeholder="Destination"
                  value={formData.destination}
                  onChange={handleChange}
                  className="w-full border p-3 rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">State</label>
                <input
                  type="text"
                  name="state"
                  placeholder="State"
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full border p-3 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Country</label>
                <input
                  type="text"
                  name="country"
                  placeholder="Country"
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full border p-3 rounded"
                  required
                />
              </div>
            </div>

            {/* Select Fields */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full border p-3 rounded"
                >
                  <option value="domestic">Domestic</option>
                  <option value="international">International</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Tour Type</label>
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
              </div>

              <div className="flex items-center mt-6">
                <input
                  type="checkbox"
                  name="isPopular"
                  checked={formData.isPopular}
                  onChange={handleChange}
                  className="mr-2"
                />
                <label className="text-sm font-medium">Popular Tour</label>
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Departure Date</label>
                <input
                  type="date"
                  name="departureDate"
                  value={formData.departureDate}
                  onChange={handleChange}
                  className="w-full border p-3 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Return Date</label>
                <input
                  type="date"
                  name="returnDate"
                  value={formData.returnDate}
                  onChange={handleChange}
                  className="w-full border p-3 rounded"
                />
              </div>
            </div>

            {/* Descriptions */}
            <div>
              <label className="block text-sm font-medium mb-1">Short Description</label>
              <textarea
                name="shortDescription"
                placeholder="Short Description"
                value={formData.shortDescription}
                onChange={handleChange}
                className="w-full border p-3 rounded"
                rows="3"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Detailed Overview</label>
              <textarea
                name="overview"
                placeholder="Detailed Overview"
                value={formData.overview}
                onChange={handleChange}
                className="w-full border p-3 rounded"
                rows="4"
              />
            </div>

            {/* Existing Images */}
            {fullTourData?.images && fullTourData.images.length > 0 && (
              <div>
                <label className="block text-sm font-medium mb-2">Existing Images</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  {fullTourData.images
                    .filter(img => !deletedImages.includes(img.id))
                    .map((image) => (
                      <div key={image.id} className="relative group">
                        <img
                          src={image.imageUrl}
                          alt="Tour"
                          className="w-full h-24 object-cover rounded border-2 border-transparent"
                          style={{
                            borderColor: selectedCoverImage === image.imageUrl ? '#3b82f6' : 'transparent'
                          }}
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center space-x-2 opacity-0 group-hover:opacity-100">
                          <button
                            type="button"
                            onClick={() => handleSetCoverImage(image.imageUrl, image.id)}
                            className="px-2 py-1 bg-blue-500 text-white text-xs rounded"
                          >
                            {selectedCoverImage === image.imageUrl ? 'Cover' : 'Set Cover'}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteImage(image.id, image.imageUrl)}
                            className="px-2 py-1 bg-red-500 text-white text-xs rounded"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Current Cover Image Display */}
            {selectedCoverImage && (
              <div>
                <label className="block text-sm font-medium mb-2">Current Cover Image</label>
                <img 
                  src={selectedCoverImage} 
                  alt="Cover" 
                  className="w-32 h-24 object-cover rounded border-2 border-blue-500"
                />
              </div>
            )}

            {/* New Image Upload */}
            <div>
              <label className="block text-sm font-medium mb-2">Add New Images</label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="w-full border p-3 rounded"
              />
              <p className="text-sm text-gray-600 mt-1">
                First image will be used as cover image if no cover is set
              </p>
            </div>

            {/* Itinerary Section */}
            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-4">
                <label className="block text-lg font-medium">Itinerary</label>
                <button
                  type="button"
                  onClick={addItineraryItem}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  + Add Day
                </button>
              </div>
              
              {itineraryItems.length === 0 ? (
                <div className="text-center py-4 text-gray-500 border-2 border-dashed rounded">
                  No itinerary items added. Click "Add Day" to start.
                </div>
              ) : (
                itineraryItems.map((item, index) => (
                  <div key={index} className="border border-gray-300 p-4 rounded mb-4 relative bg-gray-50">
                    <button
                      type="button"
                      onClick={() => removeItineraryItem(index)}
                      className="absolute top-3 right-3 px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                    >
                      Remove
                    </button>
                    <h4 className="font-medium mb-3 text-lg">Day {index + 1}</h4>
                    <div className="space-y-3">
                      <input
                        type="text"
                        placeholder="Title (e.g., Arrival in City)"
                        value={item.title}
                        onChange={(e) => updateItineraryItem(index, 'title', e.target.value)}
                        className="w-full border p-3 rounded"
                      />
                      <textarea
                        placeholder="Description"
                        value={item.description}
                        onChange={(e) => updateItineraryItem(index, 'description', e.target.value)}
                        className="w-full border p-3 rounded"
                        rows="2"
                      />
                      <textarea
                        placeholder="Activities"
                        value={item.activities}
                        onChange={(e) => updateItineraryItem(index, 'activities', e.target.value)}
                        className="w-full border p-3 rounded"
                        rows="2"
                      />
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Inclusions & Exclusions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t pt-4">
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="block text-lg font-medium">Inclusions</label>
                  <button
                    type="button"
                    onClick={() => addListItem(inclusionItems, setInclusionItems)}
                    className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                  >
                    + Add Inclusion
                  </button>
                </div>
                
                {inclusionItems.length === 0 || (inclusionItems.length === 1 && inclusionItems[0] === "") ? (
                  <div className="text-center py-4 text-gray-500 border-2 border-dashed rounded">
                    No inclusions added.
                  </div>
                ) : (
                  inclusionItems.map((item, index) => (
                    <div key={index} className="flex mb-3">
                      <input
                        type="text"
                        placeholder={`Inclusion ${index + 1}`}
                        value={item}
                        onChange={(e) => updateListItem(index, e.target.value, inclusionItems, setInclusionItems)}
                        className="w-full border p-3 rounded"
                      />
                      <button
                        type="button"
                        onClick={() => removeListItem(index, inclusionItems, setInclusionItems)}
                        className="ml-2 px-4 py-3 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  ))
                )}
              </div>

              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="block text-lg font-medium">Exclusions</label>
                  <button
                    type="button"
                    onClick={() => addListItem(exclusionItems, setExclusionItems)}
                    className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                  >
                    + Add Exclusion
                  </button>
                </div>
                
                {exclusionItems.length === 0 || (exclusionItems.length === 1 && exclusionItems[0] === "") ? (
                  <div className="text-center py-4 text-gray-500 border-2 border-dashed rounded">
                    No exclusions added.
                  </div>
                ) : (
                  exclusionItems.map((item, index) => (
                    <div key={index} className="flex mb-3">
                      <input
                        type="text"
                        placeholder={`Exclusion ${index + 1}`}
                        value={item}
                        onChange={(e) => updateListItem(index, e.target.value, exclusionItems, setExclusionItems)}
                        className="w-full border p-3 rounded"
                      />
                      <button
                        type="button"
                        onClick={() => removeListItem(index, exclusionItems, setExclusionItems)}
                        className="ml-2 px-4 py-3 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-6 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 bg-gray-300 rounded hover:bg-gray-400 font-medium"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 font-medium"
              >
                {loading ? "Updating..." : "Update Tour"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default UpdateTourModal;