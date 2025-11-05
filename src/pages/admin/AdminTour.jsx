import { useState, useEffect, useMemo } from "react";
import { useTours } from "../../hooks/useTours";
import UpdateTourModal from "../../pages/admin/UpdateTourModal";
import Pagination from "../../components/common/Pagination";

const AdminTour = () => {
  const { fetchDomesticTours, fetchInternationalTours, getTourLocations, deleteTour } = useTours();
  const [domesticTours, setDomesticTours] = useState([]);
  const [internationalTours, setInternationalTours] = useState([]);
  const [states, setStates] = useState([]);
  const [countries, setCountries] = useState([]);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedTour, setSelectedTour] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("domestic"); // 'domestic' or 'international'
  const [loading, setLoading] = useState(false);
  const toursPerPage = 5;

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      // Load domestic tours and states
      const domesticData = await fetchDomesticTours({ limit: 100 });
      const domesticToursData = Array.isArray(domesticData) ? domesticData : domesticData.tours || [];
      setDomesticTours(domesticToursData);
      
      // Load international tours and countries
      const internationalData = await fetchInternationalTours({ limit: 100 });
      const internationalToursData = Array.isArray(internationalData) ? internationalData : internationalData.tours || [];
      setInternationalTours(internationalToursData);

      // Extract unique states and countries
      const uniqueStates = [...new Set(domesticToursData.map(tour => tour.state).filter(Boolean))].sort();
      const uniqueCountries = [...new Set(internationalToursData.map(tour => tour.country).filter(Boolean))].sort();
      
      setStates(uniqueStates);
      setCountries(uniqueCountries);
    } catch (err) {
      console.error("Error loading initial data:", err);
    } finally {
      setLoading(false);
    }
  };

  // Alternative: Use getTourLocations if you prefer
  const loadLocationsSeparately = async () => {
    try {
      const [domesticLocations, internationalLocations] = await Promise.all([
        getTourLocations('domestic'),
        getTourLocations('international')
      ]);
      setStates(domesticLocations);
      setCountries(internationalLocations);
    } catch (err) {
      console.error("Error loading locations:", err);
    }
  };

  // Filter tours based on selected tab and location
  const filteredTours = useMemo(() => {
    let list = [];
    
    if (activeTab === "domestic" && selectedState) {
      list = domesticTours.filter((t) => t.state === selectedState);
    } else if (activeTab === "international" && selectedCountry) {
      list = internationalTours.filter((t) => t.country === selectedCountry);
    }

    if (searchQuery.trim()) {
      list = list.filter((t) =>
        t.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return list;
  }, [domesticTours, internationalTours, activeTab, selectedState, selectedCountry, searchQuery]);

  // Pagination logic
  const totalPages = Math.ceil(filteredTours.length / toursPerPage);
  const indexOfLastTour = currentPage * toursPerPage;
  const indexOfFirstTour = indexOfLastTour - toursPerPage;
  const currentTours = filteredTours.slice(indexOfFirstTour, indexOfLastTour);

  const handleEdit = (tour) => {
    setSelectedTour(tour);
    setShowUpdateModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this tour?")) return;
    setDeleting(true);
    try {
      await deleteTour(id);
      // Reload the data after deletion
      await loadInitialData();
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setDeleting(false);
    }
  };

  const handleTourUpdated = async () => {
    // Reload data after update
    await loadInitialData();
    setShowUpdateModal(false);
    setSelectedTour(null);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSelectedState(null);
    setSelectedCountry(null);
    setSearchQuery("");
    setCurrentPage(1);
  };

  const handleLocationSelect = (location) => {
    if (activeTab === "domestic") {
      setSelectedState(location);
      setSelectedCountry(null);
    } else {
      setSelectedCountry(location);
      setSelectedState(null);
    }
    setSearchQuery("");
    setCurrentPage(1);
  };

  const handleBackToList = () => {
    if (activeTab === "domestic") {
      setSelectedState(null);
    } else {
      setSelectedCountry(null);
    }
    setSearchQuery("");
    setCurrentPage(1);
  };

  const getSelectedLocation = () => {
    return activeTab === "domestic" ? selectedState : selectedCountry;
  };

  const getLocationList = () => {
    return activeTab === "domestic" ? states : countries;
  };

  const getLocationType = () => {
    return activeTab === "domestic" ? "state" : "country";
  };

  const getTotalToursCount = () => {
    return activeTab === "domestic" ? domesticTours.length : internationalTours.length;
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="bg-white p-6 rounded-xl shadow">
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Loading tours...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* --- TOURS TAB --- */}
      <section className="bg-white p-6 rounded-xl shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Tours Management</h2>
          <div className="text-sm text-gray-600">
            Total: {getTotalToursCount()} tours ({domesticTours.length} domestic, {internationalTours.length} international)
          </div>
        </div>

        {/* TAB SWITCHER */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            onClick={() => handleTabChange("domestic")}
            className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
              activeTab === "domestic"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Domestic Tours ({states.length} states)
          </button>
          <button
            onClick={() => handleTabChange("international")}
            className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
              activeTab === "international"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            International Tours ({countries.length} countries)
          </button>
        </div>

        {/* LOCATION BUTTONS */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">
            Select {activeTab === "domestic" ? "State" : "Country"}:
          </h3>
          <div className="flex flex-wrap gap-3">
            {getLocationList().map((location) => (
              <button
                key={location}
                onClick={() => handleLocationSelect(location)}
                className={`px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition-all ${
                  getSelectedLocation() === location
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                {location}
              </button>
            ))}
          </div>
        </div>

        {/* SHOW TOURS OF SELECTED LOCATION */}
        {getSelectedLocation() && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">
                {getSelectedLocation()} — {filteredTours.length} Tour
                {filteredTours.length !== 1 ? "s" : ""}
                <span className="text-sm font-normal text-gray-600 ml-2">
                  ({activeTab === "domestic" ? "Domestic" : "International"})
                </span>
              </h3>
              <button
                onClick={handleBackToList}
                className="text-sm text-blue-600 hover:underline"
              >
                ← Back to {activeTab === "domestic" ? "States" : "Countries"}
              </button>
            </div>

            {/* SEARCH BAR */}
            <div className="mb-4">
              <input
                type="text"
                placeholder={`Search by tour title in ${getSelectedLocation()}...`}
                value={searchQuery}
                onChange={handleSearchChange}
                className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* TOUR TABLE */}
            {currentTours.length === 0 ? (
              <p className="text-gray-500">
                No {activeTab === "domestic" ? "domestic" : "international"} tours found for {getLocationType()} "{getSelectedLocation()}".
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full border rounded-lg overflow-hidden">
                  <thead className="bg-gray-100">
                    <tr className="text-left">
                      <th className="px-4 py-2 border">Title</th>
                      <th className="px-4 py-2 border">Price</th>
                      <th className="px-4 py-2 border">Duration</th>
                      <th className="px-4 py-2 border">Category</th>
                      <th className="px-4 py-2 border">
                        {activeTab === "domestic" ? "State" : "Country"}
                      </th>
                      <th className="px-4 py-2 border">Departure</th>
                      <th className="px-4 py-2 border text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentTours.map((tour) => (
                      <tr key={tour.id} className="hover:bg-gray-50">
                        <td className="px-4 py-2 border font-medium">
                          {tour.title}
                        </td>
                        <td className="px-4 py-2 border">₹{tour.price}</td>
                        <td className="px-4 py-2 border">{tour.duration} days</td>
                        <td className="px-4 py-2 border capitalize">{tour.category}</td>
                        <td className="px-4 py-2 border capitalize">
                          {activeTab === "domestic" ? tour.state : tour.country}
                        </td>
                        <td className="px-4 py-2 border">
                          {tour.departureDate
                            ? new Date(tour.departureDate).toLocaleDateString()
                            : "-"}
                        </td>
                        <td className="px-4 py-2 border text-center space-x-2">
                          <button
                            onClick={() => handleEdit(tour)}
                            className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(tour.id)}
                            disabled={deleting}
                            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm disabled:opacity-50"
                          >
                            {deleting ? "Deleting..." : "Delete"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* PAGINATION */}
                {totalPages > 1 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                )}
              </div>
            )}
          </div>
        )}

        {/* EMPTY STATE */}
        {!getSelectedLocation() && getLocationList().length === 0 && (
          <p className="text-gray-500">
            No {activeTab === "domestic" ? "domestic tours with states" : "international tours with countries"} found yet.
          </p>
        )}

        {/* INITIAL STATE */}
        {!getSelectedLocation() && getLocationList().length > 0 && (
          <p className="text-gray-500 text-center py-8">
            Please select a {getLocationType()} to view tours.
          </p>
        )}
      </section>

      {/* UPDATE MODAL */}
      {showUpdateModal && selectedTour && (
        <UpdateTourModal
          tour={selectedTour}
          onClose={() => setShowUpdateModal(false)}
          onTourUpdated={handleTourUpdated}
        />
      )}
    </div>
  );
};

export default AdminTour;
