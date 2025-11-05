// src/hooks/useTours.js
import { useState, useEffect, useCallback } from "react";
import * as tourApi from "../api/tourApi";
import { useParams, useLocation } from 'react-router-dom';

export const useTours = () => {
  const [tours, setTours] = useState([]);
  const [popularTours, setPopularTours] = useState([]);
  const [selectedTour, setSelectedTour] = useState(null);
  const [loading, setLoading] = useState(false);
  const [popularLoading, setPopularLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({});
  const [pagination, setPagination] = useState({});
  

  // ✅ Helper: Extract array or object data safely
  const extractData = (res) => res.tours || res.data || res;







  
  const [totalPages, setTotalPages] = useState(1);

  // Get URL parameters
  const params = useParams();
  const location = useLocation();

  const fetchTours = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      // Merge URL parameters with passed filters
      const mergedFilters = { ...filters };
      
      // Add URL parameters to filters
      if (params.state) {
        mergedFilters.state = params.state;
      }
      if (params.country) {
        mergedFilters.country = params.country;
      }
      if (params.category) {
        mergedFilters.category = params.category;
      }
      if (params.location) {
        mergedFilters.location = params.location;
      }

      // Handle search query from URL
      const urlParams = new URLSearchParams(location.search);
      const searchQuery = urlParams.get('q');
      if (searchQuery && !mergedFilters.search) {
        mergedFilters.search = searchQuery;
      }

      console.log('Fetching tours with filters:', mergedFilters); // Debug log

      const data = await tourApi.getAllTours(mergedFilters);
      const toursData = extractData(data);
      
      setTours(Array.isArray(toursData) ? toursData : []);
      
      // Set pagination if available
      if (data.pagination) {
        setTotalPages(data.pagination.totalPages || 1);
      }
      
      return data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to load tours";
      setError(errorMessage);
      console.error('Error fetching tours:', err);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [params, location]); // Add dependencies



 

  // ✅ Fetch single tour by ID
  const fetchTour = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const data = await tourApi.getTourById(id);
      const tour = extractData(data);
      setSelectedTour(tour);
      return tour;
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to fetch tour details";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ Fetch single tour by slug
  const fetchTourBySlug = useCallback(async (slug) => {
    setLoading(true);
    setError(null);
    try {
      const data = await tourApi.getTourBySlug(slug);
      const tour = extractData(data);
      setSelectedTour(tour);
      return tour;
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to fetch tour details";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ Create tour
  const createTour = useCallback(async (formData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await tourApi.createTour(formData);
      const newTour = extractData(data);
      setTours((prev) => [newTour, ...prev]);
      return newTour;
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to create tour";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ Update tour
  const updateTour = useCallback(
    async (id, formData) => {
      setLoading(true);
      setError(null);
      try {
        const data = await tourApi.updateTour(id, formData);
        const updatedTour = extractData(data);

        // Update in local state
        setTours((prev) =>
          prev.map((tour) => (tour.id === parseInt(id) ? updatedTour : tour))
        );

        if (selectedTour && selectedTour.id === parseInt(id)) {
          setSelectedTour(updatedTour);
        }

        return updatedTour;
      } catch (err) {
        const errorMessage = err.response?.data?.message || "Failed to update tour";
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [selectedTour]
  );

  // ✅ Delete tour
  const deleteTour = useCallback(
    async (id) => {
      setLoading(true);
      setError(null);
      try {
        const data = await tourApi.deleteTour(id);
        setTours((prev) => prev.filter((tour) => tour.id !== parseInt(id)));

        if (selectedTour && selectedTour.id === parseInt(id)) {
          setSelectedTour(null);
        }

        return data;
      } catch (err) {
        const errorMessage = err.response?.data?.message || "Failed to delete tour";
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [selectedTour]
  );

  // ✅ Fetch popular tours
  const fetchPopularTours = useCallback(
    async (limit = 4) => {
      setPopularLoading(true);
      setError(null);
      try {
        const data = await tourApi.getPopularTours();
        const popularToursData = extractData(data);
        const limited = Array.isArray(popularToursData)
          ? popularToursData.slice(0, limit)
          : [];
        setPopularTours(limited);
        return limited;
      } catch (err) {
        const errorMessage = err.response?.data?.message || "Failed to fetch popular tours";
        console.error("Error fetching popular tours:", err);
        setError(errorMessage);

        if (tours.length > 0) {
          const fallback = tours.slice(0, limit);
          setPopularTours(fallback);
          return fallback;
        }

        throw new Error(errorMessage);
      } finally {
        setPopularLoading(false);
      }
    },
    [tours]
  );

  // ✅ Search tours
  const searchTours = useCallback(async (query) => {
    setLoading(true);
    setError(null);
    try {
      const data = await tourApi.searchTours(query);
      const searchResults = extractData(data);
      return Array.isArray(searchResults) ? searchResults : [];
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to search tours";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ Fetch reviews
  const fetchReviews = useCallback(async (tourId) => {
    try {
      const data = await tourApi.getTourReviews(tourId);
      return extractData(data);
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to fetch reviews";
      throw new Error(errorMessage);
    }
  }, []);

  // ✅ Submit review
  const submitReview = useCallback(
    async (tourId, reviewData) => {
      try {
        const data = await tourApi.addReview(tourId, reviewData);
        const review = extractData(data);

        if (selectedTour && selectedTour.id === parseInt(tourId)) {
          const updatedTour = { ...selectedTour };
          updatedTour.reviews = [...(updatedTour.reviews || []), review];
          updatedTour.numReviews = (updatedTour.numReviews || 0) + 1;
          setSelectedTour(updatedTour);
        }

        return review;
      } catch (err) {
        const errorMessage = err.response?.data?.message || "Failed to submit review";
        throw new Error(errorMessage);
      }
    },
    [selectedTour]
  );

  // ✅ Get recommended tours
  const fetchRecommendedTours = useCallback(async (tourId, category) => {
    setLoading(true);
    setError(null);
    try {
      const data = await tourApi.getRecommendedTours({ tourId, category });
      const recommendations = extractData(data);
      return Array.isArray(recommendations) ? recommendations : [];
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to fetch recommendations";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ Get available destinations
  const fetchAvailableDestinations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await tourApi.getAvailableDestinations();
      const destinations = extractData(data);
      return Array.isArray(destinations) ? destinations : [];
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to fetch destinations";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ Unified getTour (with logging)
  const getTour = useCallback(async (id) => {
    try {
      console.log(`🔄 Fetching tour from API: /tours/${id}`);
      const data = await tourApi.getTourById(id);
      console.log("📦 Raw API response:", data);
      console.log("📋 Itineraries:", data.itineraries);
      console.log("✅ Inclusions:", data.inclusions);
      console.log("❌ Exclusions:", data.exclusions);
      console.log("🖼️ Images:", data.images);
      return data;
    } catch (error) {
      console.error("❌ Error in getTour:", error);
      throw error;
    }
  }, []);

  // ✅ Get tours by discount
// In useTours hook
const fetchToursByDiscount = useCallback(async (page = 1, limit = 9) => {
  setLoading(true);
  setError(null);
  try {
    const response = await tourApi.getToursByDiscount(page, limit);
    // Return the full response including pagination info
    return {
      tours: response.tours || [],
      totalPages: response.totalPages || 1,
      currentPage: response.currentPage || page,
      totalCount: response.count || 0
    };
  } catch (err) {
    const errorMessage = err.response?.data?.message || "Failed to fetch discounted tours";
    setError(errorMessage);
    return { tours: [], totalPages: 1, currentPage: 1, totalCount: 0 };
  } finally {
    setLoading(false);
  }
}, []);

  // ✅ Send tour PDF email

  const sendTourPdfEmail = useCallback(async (emailData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await tourApi.sendTourPdfEmail(emailData);
      return data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to send PDF email";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ Download tour PDF

  const downloadTourPdf = useCallback(async (tourId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await tourApi.downloadTourPdf(tourId);
      
      // Create blob and download
      const blob = new Blob([response], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `tour-${tourId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to download PDF";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ Get domestic tours only
 // useTours.js

// ✅ Fetch domestic tours
const fetchDomesticTours = useCallback(async (filters = {}) => {
  setLoading(true);
  setError(null);
  try {
    const data = await tourApi.getDomesticTours(filters);
    const toursData = extractData(data);
    setTours(Array.isArray(toursData) ? toursData : []);
    return data;
  } catch (err) {
    const errorMessage = err.response?.data?.message || "Failed to load domestic tours";
    setError(errorMessage);
    throw new Error(errorMessage);
  } finally {
    setLoading(false);
  }
}, []);

// ✅ Fetch international tours
const fetchInternationalTours = useCallback(async (filters = {}) => {
  setLoading(true);
  setError(null);
  try {
    const data = await tourApi.getInternationalTours(filters);
    const toursData = extractData(data);
    setTours(Array.isArray(toursData) ? toursData : []);
    return data;
  } catch (err) {
    const errorMessage = err.response?.data?.message || "Failed to load international tours";
    setError(errorMessage);
    throw new Error(errorMessage);
  } finally {
    setLoading(false);
  }
}, []);

// ✅ Get locations for filtering (much simpler now!)
const getTourLocations = useCallback(async (category) => {
  try {
    let data;
    if (category === 'domestic') {
      data = await tourApi.getDomesticTours({ limit: 100 });
    } else {
      data = await tourApi.getInternationalTours({ limit: 100 });
    }
    
    const tours = extractData(data);
    const locations = category === 'domestic' 
      ? [...new Set(tours.map(tour => tour.state).filter(Boolean))]
      : [...new Set(tours.map(tour => tour.country).filter(Boolean))];
    
    return locations.sort();
  } catch (err) {
    console.error('Error fetching locations:', err);
    return [];
  }
}, []);

  // ✅ Utility functions
  const clearError = useCallback(() => setError(null), []);
  const clearSelectedTour = useCallback(() => setSelectedTour(null), []);
  const updateFilters = useCallback(
    (newFilters) => setFilters((prev) => ({ ...prev, ...newFilters })),
    []
  );

  const resetTours = useCallback(() => {
    setTours([]);
    setPopularTours([]);
    setSelectedTour(null);
    setError(null);
    setFilters({});
    setPagination({});
  }, []);

  const refreshAllTours = useCallback(async () => {
    try {
      await Promise.all([fetchTours(), fetchPopularTours()]);
    } catch (err) {
      console.error("Error refreshing tours:", err);
    }
  }, [fetchTours, fetchPopularTours]);

  // ✅ Return public API
  return {
    tours,
    popularTours,
    tour: selectedTour,
    selectedTour,
    loading,
    popularLoading,
    error,
    filters,
    pagination,
    totalPages,

    // Actions
    fetchTours,
    fetchTour,
    fetchTourBySlug,
    createTour,
    updateTour,
    deleteTour,
    fetchPopularTours,
    searchTours,
    fetchRecommendedTours,
    fetchAvailableDestinations,
    fetchReviews,
    submitReview,
    clearError,
    clearSelectedTour,
    updateFilters,
    resetTours,
    refreshAllTours,
    getTour,
    fetchToursByDiscount,
    sendTourPdfEmail,
    downloadTourPdf,
    fetchDomesticTours,
    fetchInternationalTours,
    getTourLocations
  };
};
