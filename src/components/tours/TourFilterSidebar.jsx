// src/components/tours/TourFilterSidebar.jsx
import React, { useState, useEffect, useCallback } from "react";
import {
  X,
  Filter,
  Star,
  MapPin,
  Globe,
  Calendar,
  RotateCcw,
  IndianRupee,
} from "lucide-react";

// --- Constants ---
const DEFAULT_FILTERS = {
  minPrice: 0,
  maxPrice: 500000,
  duration: "",
  rating: "",
  category: "",
  state: "",
  country: "",
  sortBy: "latest",
};

const PRICE_LIMIT = 500000;

// --- Filter Configuration ---
const FILTER_CONFIG = {
  categories: [
    { value: "domestic", label: "Domestic Tours", icon: "🇮🇳" },
    { value: "international", label: "International Tours", icon: "🌍" }
  ],
  durations: [
    { value: "1-3", label: "1-3 Days", icon: "⏳" },
    { value: "4-7", label: "4-7 Days", icon: "📅" },
    { value: "8-14", label: "8-14 Days", icon: "🗓️" },
    { value: "15+", label: "15+ Days", icon: "🌙" }
  ],
  sortOptions: [
    { value: "latest", label: "Latest Tours" },
    { value: "price-asc", label: "Price: Low to High" },
    { value: "price-desc", label: "Price: High to Low" },
    { value: "rating-desc", label: "Highest Rated" },
    { value: "popular", label: "Most Popular" },
    { value: "discount-desc", label: "Best Discount" },
    { value: "duration-asc", label: "Duration: Shortest" },
    { value: "duration-desc", label: "Duration: Longest" },
    { value: "departure-asc", label: "Departure: Earliest" },
  ]
};

// --- Sub Components ---
const FilterSection = ({ title, icon, children, className = "" }) => (
  <div className={`bg-gray-50 rounded-xl p-4 border border-gray-100 transition-all hover:border-gray-200 ${className}`}>
    <div className="flex items-center gap-3 mb-4">
      <div className="flex items-center justify-center w-8 h-8 bg-white rounded-lg border border-gray-200 shadow-sm">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
    </div>
    {children}
  </div>
);

const FilterPill = ({ active, children, onClick, icon }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 transition-all duration-200 font-medium text-sm ${
      active
        ? "bg-indigo-50 border-indigo-500 text-indigo-700 shadow-sm"
        : "bg-white border-gray-200 text-gray-600 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-25"
    }`}
  >
    {icon && <span className="text-current">{icon}</span>}
    {children}
  </button>
);

const RatingPill = ({ stars, active, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
      active
        ? "bg-amber-50 border-amber-500 shadow-sm"
        : "bg-white border-gray-200 hover:border-amber-400 hover:bg-amber-25"
    }`}
  >
    <div className="flex">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 transition-colors ${
            i < stars
              ? "fill-amber-400 text-amber-400"
              : "fill-gray-200 text-gray-200"
          }`}
        />
      ))}
    </div>
    <span className={`font-medium text-sm ${active ? "text-amber-700" : "text-gray-600"}`}>
      & Up
    </span>
  </button>
);

const PriceRangeSlider = ({ 
  value, 
  onChange,
  min = 0, 
  max = PRICE_LIMIT,
  formatPrice 
}) => {
  const handleChange = (index, newValue) => {
    const newRange = [...value];
    newRange[index] = parseInt(newValue, 10);

    // Ensure min <= max
    if (index === 0 && newRange[0] > newRange[1]) newRange[1] = newRange[0];
    if (index === 1 && newRange[1] < newRange[0]) newRange[0] = newRange[1];

    onChange(newRange);
  };

  const minPosition = (value[0] / max) * 100;
  const maxPosition = (value[1] / max) * 100;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <span className="text-lg font-semibold text-gray-900">
          {formatPrice(value[0])} - {formatPrice(value[1])}
        </span>
      </div>

      <div className="relative py-4">
        {/* Track */}
        <div className="absolute w-full h-3 bg-gray-200 rounded-full top-1/2 transform -translate-y-1/2"></div>

        {/* Progress */}
        <div
          className="absolute h-3 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full top-1/2 transform -translate-y-1/2 shadow-sm"
          style={{
            left: `${minPosition}%`,
            width: `${(maxPosition - minPosition)}%`,
          }}
        ></div>

        {/* Thumbs */}
        <input
          type="range"
          min={min}
          max={max}
          step="1000"
          value={value[0]}
          onChange={(e) => handleChange(0, e.target.value)}
          className="absolute w-full h-3 appearance-none bg-transparent pointer-events-none top-1/2 transform -translate-y-1/2 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-indigo-500 [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:hover:scale-110 [&::-webkit-slider-thumb]:transition-transform"
        />
        <input
          type="range"
          min={min}
          max={max}
          step="1000"
          value={value[1]}
          onChange={(e) => handleChange(1, e.target.value)}
          className="absolute w-full h-3 appearance-none bg-transparent pointer-events-none top-1/2 transform -translate-y-1/2 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-purple-500 [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:hover:scale-110 [&::-webkit-slider-thumb]:transition-transform"
        />
      </div>

      <div className="flex gap-4 text-sm text-gray-600">
        <span>Min: {formatPrice(min)}</span>
        <span className="ml-auto">Max: {formatPrice(max)}</span>
      </div>
    </div>
  );
};

// --- Main Component ---
const TourFilterSidebar = ({
  isOpen,
  onClose,
  onFilterChange,
  initialFilters = {},
}) => {
  // Simple state management - use initialFilters as base
  const [filters, setFilters] = useState({ 
    ...DEFAULT_FILTERS, 
    ...initialFilters 
  });

  // Local state for price range (for smooth slider interaction)
  const [localPriceRange, setLocalPriceRange] = useState([
    filters.minPrice || 0,
    filters.maxPrice || PRICE_LIMIT
  ]);

  // Update local state when initialFilters change
  useEffect(() => {
    setFilters(prev => ({ ...prev, ...initialFilters }));
    setLocalPriceRange([
      initialFilters.minPrice || 0,
      initialFilters.maxPrice || PRICE_LIMIT
    ]);
  }, [initialFilters]);

  // Handle filter updates and call parent
  const handleFilterUpdate = useCallback((newFilters) => {
    console.log('🔄 FilterSidebar: Updating filters', newFilters);
    setFilters(newFilters);
    onFilterChange(newFilters);
  }, [onFilterChange]);

  // Handle price range changes (immediate for slider, debounced for API)
  const handlePriceRangeChange = useCallback((priceRange) => {
    setLocalPriceRange(priceRange);
    // Update filters immediately for smooth UI
    handleFilterUpdate({ 
      ...filters, 
      minPrice: priceRange[0], 
      maxPrice: priceRange[1] 
    });
  }, [filters, handleFilterUpdate]);

  // Handle filter toggles (category, duration, rating)
  const handleFilterToggle = useCallback((key, value) => {
    const newValue = filters[key] === value ? "" : value;
    const newFilters = { ...filters, [key]: newValue };
    
    // Special handling for category changes
    if (key === 'category' && newValue !== filters.category) {
      // Clear location filters when category changes
      if (newValue === 'domestic') {
        newFilters.country = '';
      } else if (newValue === 'international') {
        newFilters.state = '';
      }
    }
    
    handleFilterUpdate(newFilters);
  }, [filters, handleFilterUpdate]);

  // Handle input changes (state, country, sortBy)
  const handleInputChange = useCallback((key, value) => {
    handleFilterUpdate({ ...filters, [key]: value });
  }, [filters, handleFilterUpdate]);

  // Reset all filters
  const handleReset = useCallback(() => {
    console.log('🗑️ FilterSidebar: Resetting all filters');
    const resetFilters = { ...DEFAULT_FILTERS };
    setFilters(resetFilters);
    setLocalPriceRange([resetFilters.minPrice, resetFilters.maxPrice]);
    onFilterChange(resetFilters);
  }, [onFilterChange]);

  // Format price for display
  const formatPrice = useCallback((price) => 
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price), []);

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      <div
        className={`fixed lg:sticky top-0 right-0 h-full lg:h-screen w-80 lg:w-80 bg-white shadow-2xl lg:shadow-sm z-50 lg:z-auto transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto p-6 lg:p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg">
                  <Filter className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Filters</h2>
                  <p className="text-sm text-gray-500 mt-1">Refine your tour search</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleReset}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-indigo-600 font-medium transition-colors rounded-lg hover:bg-gray-100"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset
                </button>
                <button
                  onClick={onClose}
                  className="lg:hidden p-2 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Debug Info - Remove in production */}
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="text-xs text-blue-800">
                <strong>Active Filters:</strong> 
                {filters.category && ` ${filters.category}`}
                {filters.duration && ` • ${filters.duration} days`}
                {filters.rating && ` • ${filters.rating}+ stars`}
                {filters.minPrice > 0 && ` • From ${formatPrice(filters.minPrice)}`}
              </div>
            </div>

            <div className="space-y-6">
              {/* Price Range */}
              <FilterSection
                title="Budget Range"
                icon={<IndianRupee className="w-4 h-4 text-indigo-600" />}
              >
                <PriceRangeSlider
                  value={localPriceRange}
                  onChange={handlePriceRangeChange}
                  formatPrice={formatPrice}
                />
              </FilterSection>

              {/* Tour Category */}
              <FilterSection
                title="Tour Category"
                icon={<Globe className="w-4 h-4 text-indigo-600" />}
              >
                <div className="grid grid-cols-1 gap-3">
                  {FILTER_CONFIG.categories.map((category) => (
                    <FilterPill
                      key={category.value}
                      active={filters.category === category.value}
                      onClick={() => handleFilterToggle("category", category.value)}
                      icon={category.icon}
                    >
                      {category.label}
                    </FilterPill>
                  ))}
                </div>
              </FilterSection>

              {/* State Search - Only show for domestic tours */}
              {(!filters.category || filters.category === 'domestic') && (
                <FilterSection
                  title="Destination State"
                  icon={<MapPin className="w-4 h-4 text-indigo-600" />}
                >
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search by state..."
                      value={filters.state || ''}
                      onChange={(e) => handleInputChange("state", e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-all bg-white placeholder-gray-400"
                    />
                  </div>
                </FilterSection>
              )}
              
              {/* Country Search - Only show for international tours */}
              {filters.category === "international" && (
                <FilterSection
                  title="Destination Country"
                  icon={<Globe className="w-4 h-4 text-indigo-600" />}
                >
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search by country..."
                      value={filters.country || ''}
                      onChange={(e) => handleInputChange("country", e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-all bg-white placeholder-gray-400"
                    />
                  </div>
                </FilterSection>
              )}

              {/* Duration */}
              <FilterSection
                title="Trip Duration"
                icon={<Calendar className="w-4 h-4 text-indigo-600" />}
              >
                <div className="grid grid-cols-2 gap-3">
                  {FILTER_CONFIG.durations.map((duration) => (
                    <FilterPill
                      key={duration.value}
                      active={filters.duration === duration.value}
                      onClick={() => handleFilterToggle("duration", duration.value)}
                      icon={duration.icon}
                    >
                      {duration.label}
                    </FilterPill>
                  ))}
                </div>
              </FilterSection>

              {/* Rating */}
              <FilterSection
                title="Customer Rating"
                icon={<Star className="w-4 h-4 text-amber-500 fill-amber-500" />}
              >
                <div className="space-y-3">
                  {[5, 4, 3, 2, 1].map((stars) => (
                    <RatingPill
                      key={stars}
                      stars={stars}
                      active={filters.rating === stars.toString()}
                      onClick={() => handleFilterToggle("rating", stars.toString())}
                    />
                  ))}
                </div>
              </FilterSection>

              {/* Sort By */}
              <FilterSection title="Sort By">
                <select
                  value={filters.sortBy || 'latest'}
                  onChange={(e) => handleInputChange("sortBy", e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-all bg-white"
                >
                  {FILTER_CONFIG.sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </FilterSection>
            </div>
          </div>

          {/* Mobile Apply Button */}
          <div className="lg:hidden p-6 border-t border-gray-200 bg-white">
            <button
              onClick={onClose}
              className="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default TourFilterSidebar;
