// src/pages/TourListing.jsx
import { useState, useEffect, useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import debounce from "lodash.debounce";
import { motion, AnimatePresence } from "framer-motion";
import TourCard from "../components/tours/TourCard";
import TourCardSkeleton from "../components/tours/TourCardSkeleton";
import TourSearchBar from "../components/tours/TourSearchBar";
import TourFilterSidebar from "../components/tours/TourFilterSidebar";
import Pagination from "../components/common/Pagination";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { useTours } from "../hooks/useTours";

const TourListing = () => {
  const { fetchTours } = useTours();
  const [searchParams, setSearchParams] = useSearchParams();

  // ✅ Filters from URL
  const [filters, setFilters] = useState({
    search: searchParams.get("search") || "",
    category: searchParams.get("category") || "",
    state: searchParams.get("state") || "",
    country: searchParams.get("country") || "",
    sortBy: searchParams.get("sortBy") || "latest",
  });

  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
  const [tours, setTours] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // ✅ New state for animation control
  const [displayTours, setDisplayTours] = useState([]);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const stableFetchTours = useCallback(fetchTours, [fetchTours]);

  // ✅ Debounced search with optimized delay
  const handleSearch = useMemo(
    () =>
      debounce((value) => {
        setFilters((prev) => ({ ...prev, search: value }));
        setPage(1);
      }, 300), // Reduced from 500ms for better responsiveness
    []
  );

  useEffect(() => {
    return () => handleSearch.cancel();
  }, [handleSearch]);

  // ✅ Enhanced fetch with animation timing
  useEffect(() => {
    const abortController = new AbortController();
    let isMounted = true;
    let transitionTimer;

    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Start transition only for page changes, not initial load
        if (page > 1) {
          setIsTransitioning(true);
        }

        const data = await stableFetchTours({
          ...filters,
          page,
          signal: abortController.signal,
        });

        if (abortController.signal.aborted) return;
        if (!isMounted) return;

        // ✅ Short delay to sync with animation
        await new Promise(resolve => setTimeout(resolve, 200));

        if (!isMounted) return;

        setTours(data?.tours || []);
        setDisplayTours(data?.tours || []); // Update display tours after delay
        setTotalPages(data?.totalPages || 1);
        
      } catch (err) {
        if (!isMounted || err.name === "AbortError") return;
        console.error("Tour fetch failed:", err?.response?.data || err.message);
        setError("Failed to load tours. Please try again.");
        setTours([]);
        setDisplayTours([]);
        setTotalPages(1);
      } finally {
        if (isMounted) {
          setLoading(false);
          // Clear any existing transition
          clearTimeout(transitionTimer);
          transitionTimer = setTimeout(() => {
            setIsTransitioning(false);
          }, 300);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
      abortController.abort();
      clearTimeout(transitionTimer);
    };
  }, [filters, page, stableFetchTours]);

  // ✅ Sync URL with filters + page (no loop)
  useEffect(() => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, val]) => {
      if (val) params.set(key, val);
    });
    if (page > 1) params.set("page", page.toString());

    const newParams = params.toString();
    const currentParams = searchParams.toString();

    if (newParams !== currentParams) setSearchParams(params);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, page]);

  // ✅ Handlers
  const handleFilterChange = useCallback((updatedFilters) => {
    setFilters((prev) => ({ ...prev, ...updatedFilters }));
    setPage(1);
  }, []);

  const handlePageChange = useCallback(
    (newPage) => {
      if (newPage !== page) {
        setPage(newPage);
        // Keep current tours visible during transition to reduce flicker
        setIsTransitioning(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    },
    [page]
  );

  const handleClearFilters = useCallback(() => {
    setFilters({
      search: "",
      category: "",
      state: "",
      country: "",
      sortBy: "latest",
    });
    setPage(1);
  }, []);

  const handleRetry = useCallback(() => {
    setFilters({ ...filters }); // Trigger refetch
  }, [filters]);

  const memoizedFilters = useMemo(() => filters, [filters]);

  // ✅ Animation variants for smooth transitions
  const pageVariants = {
    initial: { 
      opacity: 0, 
      y: 20,
      scale: 0.98
    },
    in: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    },
    out: { 
      opacity: 0, 
      y: -20,
      scale: 1.02,
      transition: {
        duration: 0.3,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      {/* Sidebar */}
      <TourFilterSidebar
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        initialFilters={memoizedFilters}
      />

      {/* Main Section */}
      <main className="flex-1 p-4 md:p-6" aria-busy={loading}>
        {/* Header - No animation needed here */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              Explore Tours
            </h1>
            {!loading && displayTours.length > 0 && (
              <p className="text-gray-600 mt-1">
                Showing {displayTours.length} tour{displayTours.length !== 1 ? "s" : ""}
              </p>
            )}
          </div>
          <TourSearchBar
            defaultValue={filters.search}
            onSearch={handleSearch}
            disabled={loading}
          />
        </div>

        {/* Error State */}
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 text-red-400 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-red-800">{error}</span>
              </div>
              <button
                onClick={handleRetry}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Try Again
              </button>
            </div>
          </motion.div>
        )}

        {/* Loading State */}
        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center"
          >
            <LoadingSpinner />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full mt-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <TourCardSkeleton key={i} />
              ))}
            </div>
          </motion.div>
        ) : displayTours.length > 0 ? (
          <>
            {/* ✅ Enhanced Animated Tour Grid with Page Transitions */}
            <AnimatePresence mode="wait">
              <motion.div
                key={page} // ✅ Only animate when page changes
                variants={pageVariants}
                initial="initial"
                animate="in"
                exit="out"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                <AnimatePresence>
                  {/* Show previous tours during transition to reduce flicker */}
                  {(isTransitioning ? tours : displayTours).map((tour) => (
                    <motion.div
                      key={tour.id}
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      layout // ✅ Smooth layout animations
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30
                      }}
                    >
                      <TourCard tour={tour} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            </AnimatePresence>

            {/* Pagination with subtle animation */}
            {totalPages > 1 && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-8 flex justify-center"
              >
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  isLoading={loading || isTransitioning}
                />
              </motion.div>
            )}
          </>
        ) : (
          // Empty State with animation
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center py-12"
            aria-live="polite"
          >
            <motion.svg
              initial={{ opacity: 0, rotate: -10 }}
              animate={{ opacity: 1, rotate: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="w-24 h-24 text-gray-300 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </motion.svg>
            <motion.h3 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-xl font-semibold text-gray-600 mb-2"
            >
              No tours found
            </motion.h3>
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-gray-500 mb-6"
            >
              {filters.search || filters.category || filters.state || filters.country
                ? "Try adjusting your search or filters to find more tours."
                : "There are no tours available at the moment."}
            </motion.p>
            {(filters.search ||
              filters.category ||
              filters.state ||
              filters.country) && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, type: "spring" }}
                onClick={handleClearFilters}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium transition-colors"
              >
                Clear All Filters
              </motion.button>
            )}
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default TourListing;