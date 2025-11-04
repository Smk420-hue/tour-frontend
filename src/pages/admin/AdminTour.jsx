import { useState, useEffect, useMemo } from "react";
import { useTours } from "../../hooks/useTours";
import UpdateTourModal from "../../pages/admin/UpdateTourModal";
import Pagination from "../../components/common/Pagination";
import TourSearchBar from "../../components/tours/TourSearchBar";

const AdminTour = () => {
  const { tours, fetchTours, deleteTour } = useTours();
  const [selectedState, setSelectedState] = useState(null);
  const [selectedTour, setSelectedTour] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const toursPerPage = 5;

  useEffect(() => {
    fetchTours();
  }, [fetchTours]);

  // Extract unique states from tours
  const states = [...new Set(tours.map((tour) => tour.state).filter(Boolean))].sort();

  // Filter tours by selected state
  const filteredTours = useMemo(() => {
    let list = selectedState
      ? tours.filter((t) => t.state === selectedState)
      : [];

    if (searchQuery.trim()) {
      list = list.filter((t) =>
        t.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return list;
  }, [tours, selectedState, searchQuery]);

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
      await fetchTours();
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setDeleting(false);
    }
  };

  const handleTourUpdated = async () => {
    await fetchTours();
    setShowUpdateModal(false);
    setSelectedTour(null);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="p-6">
      

      {/* --- TOURS TAB --- */}
      <section className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-2xl font-semibold mb-4">Tours by State</h2>

        {/* STATE BUTTONS */}
        <div className="flex flex-wrap gap-3 mb-6">
          {states.map((state) => (
            <button
              key={state}
              onClick={() => {
                setSelectedState(state);
                setSearchQuery("");
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition-all ${
                selectedState === state
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {state}
            </button>
          ))}
        </div>

        {/* SHOW TOURS OF SELECTED STATE */}
        {selectedState && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">
                {selectedState} — {filteredTours.length} Tour
                {filteredTours.length !== 1 ? "s" : ""}
              </h3>
              <button
                onClick={() => setSelectedState(null)}
                className="text-sm text-blue-600 hover:underline"
              >
                ← Back to States
              </button>
            </div>

            {/* SEARCH BAR (simplified for admin use) */}
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search by tour title..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* TOUR TABLE */}
            {currentTours.length === 0 ? (
              <p className="text-gray-500">No tours found for this state.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full border rounded-lg overflow-hidden">
                  <thead className="bg-gray-100">
                    <tr className="text-left">
                      <th className="px-4 py-2 border">Title</th>
                      <th className="px-4 py-2 border">Price</th>
                      <th className="px-4 py-2 border">Duration</th>
                      <th className="px-4 py-2 border">Category</th>
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

        {!selectedState && states.length === 0 && (
          <p className="text-gray-500">No tours found yet.</p>
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
