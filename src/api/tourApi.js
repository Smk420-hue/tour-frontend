// src/api/tourApi.js
import axiosInstance from "./axiosInstance";

// ✅ Get all tours (with enhanced filter handling)
export const getAllTours = async (filters = {}) => {
  const params = new URLSearchParams();

  // Add filters to params with enhanced handling
  Object.keys(filters).forEach(key => {
    const value = filters[key];
    
    // Skip null, undefined, empty strings, and empty arrays
    if (value === null || value === undefined || value === '') {
      return;
    }

    // Handle different data types
    if (Array.isArray(value)) {
      // Handle array values like priceRange [min, max] or multiple selections
      if (value.length > 0) {
        if (key === 'priceRange' || key === 'duration') {
          // For range filters, join with hyphen
          params.append(key, value.join('-'));
        } else {
          // For multiple selections, join with comma
          params.append(key, value.join(','));
        }
      }
    } else if (typeof value === 'object') {
      // Handle object values by stringifying
      params.append(key, JSON.stringify(value));
    } else {
      // Handle primitive values (string, number, boolean)
      params.append(key, value.toString());
    }
  });

  console.log('API Request filters:', filters); // Debug log
  console.log('API Request params:', params.toString()); // Debug log

  const { data } = await axiosInstance.get(`/tours?${params.toString()}`);
  return data;
};

// ✅ Get tours by state
export const getToursByState = async (state) => {
  const { data } = await axiosInstance.get(`/tours?state=${encodeURIComponent(state)}`);
  return data;
};

// ✅ Get tours by country
export const getToursByCountry = async (country) => {
  const { data } = await axiosInstance.get(`/tours?country=${encodeURIComponent(country)}`);
  return data;
};

// ✅ Get tours by category
export const getToursByCategory = async (category) => {
  const { data } = await axiosInstance.get(`/tours?category=${encodeURIComponent(category)}`);
  return data;
};

// ✅ Get tours by location (generic search across state, country, city)
export const getToursByLocation = async (location) => {
  const { data } = await axiosInstance.get(`/tours?location=${encodeURIComponent(location)}`);
  return data;
};

// ✅ Simple version (no filters)
export const getTours = async () => {
  const { data } = await axiosInstance.get("/tours");
  return data;
};

// ✅ Get tour by ID
export const getTourById = async (id) => {
  const { data } = await axiosInstance.get(`/tours/${id}`);
  return data;
};

// ✅ Get tour by slug
export const getTourBySlug = async (slug) => {
  const { data } = await axiosInstance.get(`/tours/slug/${slug}`);
  return data;
};

// ✅ Create new tour
export const createTour = async (tourData) => {
  const { data } = await axiosInstance.post("/tours", tourData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return data;
};

// ✅ Update tour
export const updateTour = async (id, tourData) => {
  const { data } = await axiosInstance.put(`/tours/${id}`, tourData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return data;
};

// ✅ Delete tour
export const deleteTour = async (id) => {
  const { data } = await axiosInstance.delete(`/tours/${id}`);
  return data;
};

// ✅ Get popular tours
export const getPopularTours = async () => {
  const { data } = await axiosInstance.get('/tours/popular');
  return data;
};

// ✅ Search tours by query
export const searchTours = async (query) => {
  const { data } = await axiosInstance.get(`/tours/search?q=${encodeURIComponent(query)}`);
  return data;
};

// ✅ Get reviews for a specific tour
export const getTourReviews = async (tourId) => {
  const { data } = await axiosInstance.get(`/tours/${tourId}/reviews`);
  return data;
};

// ✅ Add a new review for a tour
export const addReview = async (tourId, reviewData) => {
  const { data } = await axiosInstance.post(`/tours/${tourId}/reviews`, reviewData);
  return data;
};

//get tours by discount
export const getToursByDiscount = async (page = 1, limit = 9) => {
    try {
      console.log(`API Call: /tours/discounted?page=${page}&limit=${limit}`);
      
      const response = await axiosInstance.get(`/tours/discounted`, {
        params: { page, limit }
      });
      
      console.log('API Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('API Error:', error.response?.data || error.message);
      throw error;
    }
  }

  //send pdf email
export const sendTourPdfEmail = async (emailData) => {
  const { data } = await axiosInstance.post('/tours/send-pdf', emailData);
  return data;
};

// download tour pdf
export const downloadTourPdf = async (tourId) => {
  const { data } = await axiosInstance.get(`/tours/${tourId}/pdf`, {
    responseType: 'blob'
  });

  // Create a URL for the PDF blob
  const url = window.URL.createObjectURL(new Blob([data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `tour_${tourId}.pdf`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};    

// ✅ Get recommended tours based on tourId or category
export const getRecommendedTours = async (params = {}) => {
  const queryParams = new URLSearchParams();
  Object.keys(params).forEach(key => {
    if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
      queryParams.append(key, params[key]);
    }
  });
  const { data } = await axiosInstance.get(`/tours/recommendations?${queryParams.toString()}`);
  return data;
};

// ✅ Get available destinations with tour counts
export const getAvailableDestinations = async () => {
  const { data } = await axiosInstance.get('/tours/destinations');
  return data;
};

// ✅ Get available filters (for filter sidebar)
export const getAvailableFilters = async () => {
  const { data } = await axiosInstance.get('/tours/filters/available');
  return data;
};

// ✅ Get tours with advanced filtering (with pagination support)
export const getFilteredTours = async (filters = {}, page = 1, limit = 9) => {
  const params = new URLSearchParams();
  
  // Add pagination
  params.append('page', page.toString());
  params.append('limit', limit.toString());
  
  // Add filters
  Object.keys(filters).forEach(key => {
    const value = filters[key];
    if (value !== null && value !== undefined && value !== '') {
      if (Array.isArray(value)) {
        if (value.length > 0) {
          params.append(key, value.join(','));
        }
      } else {
        params.append(key, value.toString());
      }
    }
  });

  const { data } = await axiosInstance.get(`/tours/filter?${params.toString()}`);
  return data;
};

// tourApi.js

// ✅ Get domestic tours only
export const getDomesticTours = async (filters = {}) => {
  const params = new URLSearchParams();
  
  Object.keys(filters).forEach(key => {
    const value = filters[key];
    if (value !== null && value !== undefined && value !== '') {
      params.append(key, value.toString());
    }
  });

  const { data } = await axiosInstance.get(`/tours/domestic?${params.toString()}`);
  return data;
};

// ✅ Get international tours only
export const getInternationalTours = async (filters = {}) => {
  const params = new URLSearchParams();
  
  Object.keys(filters).forEach(key => {
    const value = filters[key];
    if (value !== null && value !== undefined && value !== '') {
      params.append(key, value.toString());
    }
  });

  const { data } = await axiosInstance.get(`/tours/international?${params.toString()}`);
  return data;
};
