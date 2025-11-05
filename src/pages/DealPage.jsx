import { useEffect, useState, useCallback } from "react";
import { useTours } from "../hooks/useTours";
import TourCard from "../components/tours/tourcard/card1";
import Pagination from "../components/common/Pagination";
import TourFilterSidebar from "../components/tours/TourFilterSidebar";
import { Filter, X, RefreshCw } from "lucide-react";

// Default filter values
const DEFAULT_FILTERS = {
  priceRange: [0, 500000],
  duration: "",
  rating: "",
  category: "",
  state: "",
  country: "",
  sortBy: "discount-desc"
};

const ITEMS_PER_PAGE = 9;

const DealsPage = () => {
  const { fetchToursByDiscount, loading, error } = useTours();
  const [allTours, setAllTours] = useState([]);
  const [currentTours, setCurrentTours] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [totalResults, setTotalResults] = useState(0);
  const [localError, setLocalError] = useState("");

  // Load all tours
  const loadAllTours = useCallback(async () => {
    try {
      setLocalError("");
      console.log("🔄 Starting to load tours...");

      // Try to get a larger set of tours to test
      const allToursData = await fetchToursByDiscount(1, 50);
      
      console.log("📦 Raw data from API:", allToursData);
      console.log("📊 Data type:", typeof allToursData);
      console.log("📊 Is array?", Array.isArray(allToursData));
      
      if (Array.isArray(allToursData)) {
        console.log("✅ Received array with", allToursData.length, "tours");
        setAllTours(allToursData);
        setTotalResults(allToursData.length);
        setTotalPages(Math.ceil(allToursData.length / ITEMS_PER_PAGE));
      } else if (allToursData && allToursData.tours) {
        console.log("✅ Received object with tours array:", allToursData.tours.length, "tours");
        setAllTours(allToursData.tours || []);
        setTotalResults(allToursData.tours?.length || 0);
        setTotalPages(Math.ceil((allToursData.tours?.length || 0) / ITEMS_PER_PAGE));
      } else {
        console.log("❌ No tours data found");
        setAllTours([]);
        setTotalResults(0);
        setTotalPages(1);
        setLocalError("No discounted tours found in the response");
      }
      
    } catch (err) {
      console.error("❌ Failed to load tours:", err);
      setAllTours([]);
      setLocalError(err.message || "Failed to load tours. Please try again.");
    }
  }, [fetchToursByDiscount]);

  // Update current tours when page or allTours changes
  useEffect(() => {
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginatedTours = allTours.slice(startIndex, endIndex);
    
    console.log(`📄 Page ${page}: Showing ${paginatedTours.length} tours (index ${startIndex}-${endIndex})`);
    console.log(`📊 Total tours available: ${allTours.length}`);
    
    setCurrentTours(paginatedTours);
  }, [page, allTours]);

  // Load tours on component mount
  useEffect(() => {
    loadAllTours();
  }, [loadAllTours]);

  // Handle page change
  const handlePageChange = (newPage) => {
    console.log(`🔄 Changing page from ${page} to ${newPage}`);
    setPage(newPage);
  };

  // Handle filter changes
  const handleFilterChange = (newFilters) => {
    console.log("🎛️ Filters changed:", newFilters);
    setFilters(newFilters);
    setPage(1);
    // For now, we'll just show a warning since backend doesn't support these filters
    const unsupportedFilters = [];
    if (newFilters.duration) unsupportedFilters.push('duration');
    if (newFilters.rating) unsupportedFilters.push('rating');
    if (newFilters.category) unsupportedFilters.push('category');
    if (newFilters.state) unsupportedFilters.push('state');
    if (newFilters.country) unsupportedFilters.push('country');
    
    if (unsupportedFilters.length > 0) {
      setLocalError(`Note: Filtering by ${unsupportedFilters.join(', ')} is not supported yet. Showing all discounted tours.`);
    } else {
      setLocalError("");
    }
  };

  // Clear all filters
  const handleClearFilters = () => {
    console.log("🧹 Clearing all filters");
    setFilters(DEFAULT_FILTERS);
    setPage(1);
    setLocalError("");
  };

  // Get active filter count
  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 500000) count++;
    if (filters.duration) count++;
    if (filters.rating) count++;
    if (filters.category) count++;
    if (filters.state) count++;
    if (filters.country) count++;
    if (filters.sortBy !== "discount-desc") count++;
    return count;
  };

  const activeFilterCount = getActiveFilterCount();
  const displayError = error || localError;

  if (loading) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <span className="ml-3 text-lg">Loading discounted tours...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            💥 Hot Deals & Discounts
          </h1>
          <p className="text-gray-600">
            Discover amazing tours with exclusive discounts
            {totalResults > 0 && (
              <span className="font-semibold text-indigo-600 ml-2">
                ({totalResults} {totalResults === 1 ? 'tour' : 'tours'} found)
              </span>
            )}
          </p>
        </div>
        
        {/* Filter Controls */}
        <div className="flex items-center gap-4 mt-4 lg:mt-0">
          {/* Refresh Button */}
          <button
            onClick={loadAllTours}
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-800 font-medium transition-colors rounded-lg hover:bg-gray-100 border border-gray-200"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>

          {activeFilterCount > 0 && (
            <button
              onClick={handleClearFilters}
              className="hidden lg:flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:text-red-800 font-medium transition-colors rounded-lg hover:bg-red-50 border border-red-200"
            >
              <X className="w-4 h-4" />
              Clear Filters ({activeFilterCount})
            </button>
          )}
          
          <button
            onClick={() => setIsFilterOpen(true)}
            className="lg:hidden bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="bg-white text-indigo-600 text-xs px-2 py-1 rounded-full min-w-5">
                {activeFilterCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="hidden lg:flex items-center gap-2 bg-white text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200"
          >
            <Filter className="w-4 h-4" />
            <span>{isFilterOpen ? 'Hide' : 'Show'} Filters</span>
            {activeFilterCount > 0 && (
              <span className="bg-indigo-600 text-white text-xs px-2 py-1 rounded-full min-w-5">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Error Messages */}
      {displayError && (
        <div className={`mb-6 rounded-lg p-4 ${
          displayError.includes("Note:") 
            ? "bg-yellow-50 border border-yellow-200 text-yellow-800"
            : "bg-red-50 border border-red-200 text-red-800"
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-sm">{displayError}</span>
            {!displayError.includes("Note:") && (
              <button
                onClick={loadAllTours}
                className="text-sm underline hover:no-underline"
              >
                Try Again
              </button>
            )}
          </div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filter Sidebar */}
        <div className={`${isFilterOpen ? 'block' : 'hidden'} lg:block`}>
          <TourFilterSidebar
            isOpen={isFilterOpen}
            onClose={() => setIsFilterOpen(false)}
            onFilterChange={handleFilterChange}
            initialFilters={filters}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Debug Info - Remove in production */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="text-sm text-blue-800">
                <strong>Debug Info:</strong> Page {page} of {totalPages} | 
                Showing {currentTours.length} of {allTours.length} tours | 
                API Error: {error || 'None'}
              </div>
            </div>
          )}

          {/* Active Filters Summary */}
          {activeFilterCount > 0 && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-sm font-medium text-gray-700">Active filters:</span>
                
                {(filters.priceRange[0] > 0 || filters.priceRange[1] < 500000) && (
                  <span className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full border border-blue-200">
                    Price: ₹{filters.priceRange[0].toLocaleString()} - ₹{filters.priceRange[1].toLocaleString()}
                  </span>
                )}
                
                {filters.category && (
                  <span className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full border border-green-200">
                    {filters.category === 'domestic' ? '🇮🇳 Domestic' : '🌍 International'}
                  </span>
                )}
                
                {filters.duration && (
                  <span className="bg-purple-100 text-purple-800 text-xs px-3 py-1 rounded-full border border-purple-200">
                    Duration: {filters.duration}
                  </span>
                )}
                
                {filters.rating && (
                  <span className="bg-amber-100 text-amber-800 text-xs px-3 py-1 rounded-full border border-amber-200">
                    Rating: {filters.rating}+ ⭐
                  </span>
                )}

                <button
                  onClick={handleClearFilters}
                  className="text-red-600 text-sm hover:text-red-800 font-medium ml-2 flex items-center gap-1"
                >
                  <X className="w-3 h-3" />
                  Clear all
                </button>
              </div>
            </div>
          )}

          {/* Tours Grid */}
          {currentTours.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {currentTours.map((tour) => (
                  <TourCard key={tour.id} tour={tour} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-12 flex justify-center">
                  <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16 bg-gray-50 rounded-lg border border-gray-200">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No Discounted Tours Found
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                {allTours.length === 0 
                  ? "There are currently no tours with discounts available. Please check back later or try refreshing the page."
                  : "No tours match your current filters. Try adjusting your search criteria."
                }
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={loadAllTours}
                  className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 justify-center"
                >
                  <RefreshCw className="w-4 h-4" />
                  Refresh Data
                </button>
                {activeFilterCount > 0 && (
                  <button
                    onClick={handleClearFilters}
                    className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DealsPage;
