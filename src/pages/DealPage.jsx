import { useEffect, useState, useCallback } from "react";
import { useTours } from "../hooks/useTours";
import TourCard from "../components/tours/tourcard/card1";
import Pagination from "../components/common/Pagination";
import TourFilterSidebar from "../components/tours/TourFilterSidebar";
import { Filter, X, RefreshCw } from "lucide-react";

// Default filter values for deals page
const DEFAULT_FILTERS = {
  minPrice: 0,
  maxPrice: 500000,
  duration: "",
  rating: "",
  category: "",
  state: "",
  country: "",
  sortBy: "discount-desc"
};

const ITEMS_PER_PAGE = 9;

const DealsPage = () => {
  const { fetchTours, loading, error } = useTours();
  const [tours, setTours] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [localError, setLocalError] = useState("");

  // Load tours with current filters
  const loadTours = useCallback(async (pageNum = 1) => {
    try {
      setLocalError("");
      console.log("🔄 Loading tours with filters:", { ...filters, page: pageNum });

      // Prepare API filters - convert priceRange to minPrice/maxPrice
      const apiFilters = {
        // Price filters
        minPrice: filters.minPrice || 0,
        maxPrice: filters.maxPrice || 500000,
        
        // Other filters
        duration: filters.duration || '',
        rating: filters.rating || '',
        category: filters.category || '',
        state: filters.state || '',
        country: filters.country || '',
        
        // Sorting - always prioritize discount for deals page
        sortBy: filters.sortBy || 'discount-desc',
        
        // Pagination
        page: pageNum,
        limit: ITEMS_PER_PAGE
      };

      console.log("🎯 API filters:", apiFilters);

      const data = await fetchTours(apiFilters);
      
      console.log("✅ API response:", {
        success: data.success,
        count: data.count,
        totalPages: data.totalPages,
        toursCount: data.tours?.length
      });

      if (data.success && data.tours) {
        setTours(data.tours);
        setTotalResults(data.count || data.tours.length);
        setTotalPages(data.totalPages || 1);
        
        // Filter tours with actual discounts (discount > 0)
        const discountedTours = data.tours.filter(tour => 
          tour.discount > 0 || (tour.discountedPrice && tour.discountedPrice < tour.price)
        );
        
        if (discountedTours.length === 0 && data.tours.length > 0) {
          setLocalError("No tours with active discounts found. Showing all available tours.");
        } else if (discountedTours.length < data.tours.length) {
          console.log(`💰 Found ${discountedTours.length} discounted tours out of ${data.tours.length} total`);
        }
      } else {
        setTours([]);
        setTotalResults(0);
        setTotalPages(1);
        setLocalError(data.message || "No tours found");
      }
      
    } catch (err) {
      console.error("❌ Failed to load tours:", err);
      setTours([]);
      setLocalError(err.message || "Failed to load tours. Please try again.");
    }
  }, [fetchTours, filters]);

  // Load tours when filters or page changes
  useEffect(() => {
    loadTours(page);
  }, [loadTours, page]);

  // Handle filter changes
  const handleFilterChange = useCallback((newFilters) => {
    console.log("🎛️ Filters changed:", newFilters);
    
    // Convert priceRange array to minPrice/maxPrice
    const convertedFilters = {
      ...newFilters,
      minPrice: newFilters.minPrice || 0,
      maxPrice: newFilters.maxPrice || 500000
    };
    
    setFilters(convertedFilters);
    setPage(1); // Reset to first page when filters change
  }, []);

  // Handle page change
  const handlePageChange = useCallback((newPage) => {
    console.log(`🔄 Changing page from ${page} to ${newPage}`);
    setPage(newPage);
  }, [page]);

  // Clear all filters
  const handleClearFilters = useCallback(() => {
    console.log("🧹 Clearing all filters");
    setFilters(DEFAULT_FILTERS);
    setPage(1);
    setLocalError("");
  }, []);

  // Refresh data
  const handleRefresh = useCallback(() => {
    console.log("🔄 Refreshing data");
    loadTours(page);
  }, [loadTours, page]);

  // Get active filter count
  const getActiveFilterCount = useCallback(() => {
    let count = 0;
    if (filters.minPrice > 0) count++;
    if (filters.maxPrice < 500000) count++;
    if (filters.duration) count++;
    if (filters.rating) count++;
    if (filters.category) count++;
    if (filters.state) count++;
    if (filters.country) count++;
    if (filters.sortBy !== "discount-desc") count++;
    return count;
  }, [filters]);

  const activeFilterCount = getActiveFilterCount();
  const displayError = error || localError;

  // Calculate discounted tours count
  const discountedToursCount = tours.filter(tour => 
    tour.discount > 0 || (tour.discountedPrice && tour.discountedPrice < tour.price)
  ).length;

  if (loading) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <span className="ml-3 text-lg">Loading hot deals...</span>
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
                ({totalResults} {totalResults === 1 ? 'tour' : 'tours'} found
                {discountedToursCount > 0 && `, ${discountedToursCount} with discounts`})
              </span>
            )}
          </p>
        </div>
        
        {/* Filter Controls */}
        <div className="flex items-center gap-4 mt-4 lg:mt-0">
          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
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
          displayError.includes("No tours with active discounts") || displayError.includes("Note:")
            ? "bg-yellow-50 border border-yellow-200 text-yellow-800"
            : "bg-red-50 border border-red-200 text-red-800"
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-sm">{displayError}</span>
            {!displayError.includes("No tours with active discounts") && !displayError.includes("Note:") && (
              <button
                onClick={handleRefresh}
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
                Showing {tours.length} tours | 
                Active Filters: {activeFilterCount} |
                Discounted: {discountedToursCount}
              </div>
            </div>
          )}

          {/* Active Filters Summary */}
          {activeFilterCount > 0 && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-sm font-medium text-gray-700">Active filters:</span>
                
                {(filters.minPrice > 0 || filters.maxPrice < 500000) && (
                  <span className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full border border-blue-200">
                    Price: ₹{filters.minPrice.toLocaleString()} - ₹{filters.maxPrice.toLocaleString()}
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

                {filters.state && (
                  <span className="bg-indigo-100 text-indigo-800 text-xs px-3 py-1 rounded-full border border-indigo-200">
                    State: {filters.state}
                  </span>
                )}

                {filters.country && (
                  <span className="bg-red-100 text-red-800 text-xs px-3 py-1 rounded-full border border-red-200">
                    Country: {filters.country}
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
          {tours.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {tours.map((tour) => (
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
                No Tours Found
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                {totalResults === 0 
                  ? "No tours match your current filters. Try adjusting your search criteria or clearing filters."
                  : "No tours to display on this page."
                }
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={handleRefresh}
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
