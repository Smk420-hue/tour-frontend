// src/components/layout/Navbar.jsx
import { FaSearch, FaUser, FaBars, FaTimes, FaChevronDown } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import logo from "../../assets/images/logo.png";
import { getAllTours } from "../../api/tourApi";
import { getProfile } from "../../api/authApi";

// Custom debounce hook
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  
  return debouncedValue;
}

const Navbar = ({ handleLogout }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [groupDropdownOpen, setGroupDropdownOpen] = useState(false);
  const [specialDropdownOpen, setSpecialDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedGroupType, setSelectedGroupType] = useState("domestic"); // Default to domestic
  const [tours, setTours] = useState([]);
  const [specialTours, setspecialTours] = useState([]);
  const navigate = useNavigate();

  // Refs for click outside detection
  const groupDropdownRef = useRef(null);
  const specialDropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const mobileMenuButtonRef = useRef(null);

  // Debounced search query
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Fetch user profile
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const profile = await getProfile();
          setUserInfo(profile);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("userInfo");
      }
    };
    fetchUserProfile();
  }, []);

  // Fetch tours data
  useEffect(() => {
    const fetchToursData = async () => {
      try {
        const data = await getAllTours();
        const toursData = data.tours || [];
        setTours(toursData);
        
        // Filter special tours
        const special = toursData.filter(tour => tour.tourType === "special");
        setspecialTours(special);
      } catch (err) {
        console.error("Error fetching tours:", err);
        setTours([]);
        setspecialTours([]);
      }
    };
    fetchToursData();
  }, []);

  // Handle search submission
  const handleSearch = useCallback((e) => {
    e.preventDefault();
    const trimmedQuery = searchQuery.trim();
    if (trimmedQuery) {
      navigate(`/tours/search?q=${encodeURIComponent(trimmedQuery)}`);
      setSearchQuery("");
      setMobileMenuOpen(false);
    }
  }, [searchQuery, navigate]);

  // Get filtered locations based on selected group type
  const getFilteredLocations = useCallback(() => {
    if (!tours.length) return [];
    
    // Filter tours by category and get unique states
    const filteredTours = tours.filter(tour => {
      // For international tours, state might be null, so we use country
      if (selectedGroupType === "international") {
        return tour.category === "international" && tour.country;
      } else {
        // For domestic tours, we need state
        return tour.category === "domestic" && tour.state;
      }
    });

    // Get unique locations based on category
    const locations = filteredTours
      .map(tour => {
        if (selectedGroupType === "international") {
          return tour.country; // Use country for international tours
        } else {
          return tour.state; // Use state for domestic tours
        }
      })
      .filter((location, index, self) => location && self.indexOf(location) === index)
      .sort();

    return locations;
  }, [selectedGroupType, tours]);

  // Memoized filtered locations
  const filteredLocations = useMemo(() => getFilteredLocations(), [getFilteredLocations]);

  // Handle location selection
  const handleLocationSelect = useCallback((locationName) => {
    if (selectedGroupType === "domestic") {
      navigate(`/tours/state/${locationName.toLowerCase()}`);
    } else {
      navigate(`/tours/country/${locationName.toLowerCase()}`);
    }
    setGroupDropdownOpen(false);
    setMobileMenuOpen(false);
  }, [navigate, selectedGroupType]);

  // Handle category selection
  const handleCategorySelect = useCallback((categoryKey) => {
    navigate(`/tours/category/${categoryKey}`);
    setGroupDropdownOpen(false);
    setMobileMenuOpen(false);
  }, [navigate]);

  // Handle group type tab selection
  const handleGroupTypeSelect = useCallback((groupType) => {
    setSelectedGroupType(groupType);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (groupDropdownRef.current && !groupDropdownRef.current.contains(event.target)) {
        setGroupDropdownOpen(false);
      }
      if (specialDropdownRef.current && !specialDropdownRef.current.contains(event.target)) {
        setSpecialDropdownOpen(false);
      }
      if (mobileMenuRef.current && 
          !mobileMenuRef.current.contains(event.target) && 
          mobileMenuButtonRef.current && 
          !mobileMenuButtonRef.current.contains(event.target)) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus management for mobile menu
  useEffect(() => {
    if (mobileMenuOpen) {
      const firstFocusableElement = mobileMenuRef.current?.querySelector('button, a, input');
      firstFocusableElement?.focus();
    }
  }, [mobileMenuOpen]);

  // Toggle mobile menu
  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen(prev => !prev);
  }, []);

  // Close all dropdowns
  const closeAllDropdowns = useCallback(() => {
    setGroupDropdownOpen(false);
    setSpecialDropdownOpen(false);
  }, []);

  // Group tour types
  const groupTourTypes = [
    { key: "domestic", label: "Domestic Tours" },
    { key: "international", label: "International Tours" }
  ];

  // Navigation links
  const navLinks = [
    { to: "/customize-tour", label: "Destinations" },
    { to: "/aboutus", label: "About Us" },
    { to: "/contact", label: "Contact" },
    { to: "/deals", label: "Deals" }
  ];

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center flex-shrink-0"
            onClick={closeAllDropdowns}
          >
            <img src={logo} alt="Tour Travels" className="h-10 w-auto" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {/* Group Tours Dropdown */}
            <div className="relative" ref={groupDropdownRef}>
              <button
                onClick={() => {
                  setGroupDropdownOpen(!groupDropdownOpen);
                  setSpecialDropdownOpen(false);
                }}
                className="flex items-center space-x-1 font-semibold text-gray-700 hover:text-orange-600 transition-colors duration-200 py-2"
                aria-expanded={groupDropdownOpen}
                aria-haspopup="true"
                aria-label="Group tours menu"
              >
                <span>Group Tours</span>
                <FaChevronDown className={`text-xs transition-transform duration-200 ${
                  groupDropdownOpen ? 'rotate-180' : ''
                }`} />
              </button>

              {groupDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 bg-white shadow-xl rounded-lg w-96 py-4 z-50 border border-gray-100">
                  {/* Tabs for Domestic/International */}
                  <div className="flex border-b border-gray-200 px-4">
                    {groupTourTypes.map((type) => (
                      <button
                        key={type.key}
                        onClick={() => handleGroupTypeSelect(type.key)}
                        className={`flex-1 py-2 text-sm font-medium transition-colors ${
                          selectedGroupType === type.key
                            ? 'text-orange-600 border-b-2 border-orange-600'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        {type.label}
                      </button>
                    ))}
                  </div>

                  <div className="px-4 pt-4">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-bold text-orange-600 text-sm uppercase tracking-wide">
                        {selectedGroupType === 'domestic' ? 'Indian States' : 'Countries'}
                      </h3>
                      <button
                        onClick={() => handleCategorySelect(selectedGroupType)}
                        className="px-3 py-1 text-xs bg-orange-50 text-orange-700 rounded-lg border border-orange-200 hover:bg-orange-100 transition-colors font-medium"
                      >
                        View All
                      </button>
                    </div>
                    
                    <div className="max-h-64 overflow-y-auto">
                      <div className="grid grid-cols-2 gap-2">
                        {filteredLocations.length > 0 ? (
                          filteredLocations.map(location => (
                            <button
                              key={location}
                              onClick={() => handleLocationSelect(location)}
                              className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-orange-50 hover:text-orange-700 rounded-md transition-colors border border-gray-100 hover:border-orange-200"
                            >
                              {location}
                            </button>
                          ))
                        ) : (
                          <div className="col-span-2 text-center py-4 text-gray-500 text-sm">
                            No {selectedGroupType === 'domestic' ? 'states' : 'countries'} available
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Speciality Tours Dropdown */}
            <div className="relative" ref={specialDropdownRef}>
              <button
                onClick={() => {
                  setSpecialDropdownOpen(!specialDropdownOpen);
                  setGroupDropdownOpen(false);
                }}
                className="flex items-center space-x-1 font-semibold text-gray-700 hover:text-orange-600 transition-colors duration-200 py-2"
                aria-expanded={specialDropdownOpen}
                aria-haspopup="true"
                aria-label="Speciality tours menu"
              >
                <span>Speciality Tours</span>
                <FaChevronDown className={`text-xs transition-transform duration-200 ${
                  specialDropdownOpen ? 'rotate-180' : ''
                }`} />
              </button>

              {specialDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 bg-white shadow-xl rounded-lg w-80 py-3 z-50 border border-gray-100">
                  <div className="px-4 py-2">
                    <h3 className="font-bold text-orange-600 text-sm uppercase tracking-wide mb-3">
                      special Tours
                    </h3>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {specialTours.length > 0 ? (
                        specialTours.map((tour) => (
                          <Link
                            to={`/tours/${tour.id}`}
                            key={tour.id}
                            className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors group"
                            onClick={() => setSpecialDropdownOpen(false)}
                          >
                            <img
                              src={tour.coverImage || "/placeholder.jpg"}
                              alt={tour.title}
                              className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 group-hover:text-orange-600 truncate">
                                {tour.title}
                              </p>
                              {tour.price && (
                                <p className="text-xs text-orange-600 font-semibold">
                                  ${tour.price.toLocaleString()}
                                </p>
                              )}
                            </div>
                          </Link>
                        ))
                      ) : (
                        <div className="text-center py-4 text-gray-500 text-sm">
                          No special tours available
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Regular Navigation Links */}
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className="font-semibold text-gray-700 hover:text-orange-600 transition-colors duration-200 py-2"
                onClick={closeAllDropdowns}
              >
                {link.label}
              </Link>
            ))}

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search tours..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-3 pr-10 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent w-40 text-sm transition-all duration-200"
                aria-label="Search tours"
              />
              <button
                type="submit"
                className="absolute right-0 top-0 h-full px-3 bg-orange-600 text-white rounded-r-lg hover:bg-orange-700 transition-colors duration-200 flex items-center justify-center"
                aria-label="Search"
              >
                <FaSearch className="text-sm" />
              </button>
            </form>
          </nav>

          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {userInfo ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-gray-700">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                    <FaUser className="text-orange-600 text-sm" />
                  </div>
                  <span className="font-medium">{userInfo.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors duration-200 font-medium"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="font-semibold text-gray-700 hover:text-orange-600 transition-colors duration-200"
                  onClick={closeAllDropdowns}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors duration-200 font-medium"
                  onClick={closeAllDropdowns}
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              ref={mobileMenuButtonRef}
              onClick={toggleMobileMenu}
              className="p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-200"
              aria-expanded={mobileMenuOpen}
              aria-label="Mobile menu"
            >
              {mobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div 
            ref={mobileMenuRef}
            id="mobile-menu"
            className="md:hidden bg-white border-t border-gray-200 py-4 px-4 space-y-4"
          >
            {/* Group Tours Mobile */}
            <div>
              <button
                onClick={() => setGroupDropdownOpen(!groupDropdownOpen)}
                className="w-full flex items-center justify-between py-2 px-3 font-semibold text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                aria-expanded={groupDropdownOpen}
              >
                <span>Group Tours</span>
                <FaChevronDown className={`text-xs transition-transform duration-200 ${
                  groupDropdownOpen ? 'rotate-180' : ''
                }`} />
              </button>
              
              {groupDropdownOpen && (
                <div className="ml-4 mt-2 space-y-3">
                  {/* Tabs for Domestic/International */}
                  <div className="flex space-x-2 border-b border-gray-200 pb-2">
                    {groupTourTypes.map((type) => (
                      <button
                        key={type.key}
                        onClick={() => handleGroupTypeSelect(type.key)}
                        className={`flex-1 py-1 text-xs font-medium transition-colors ${
                          selectedGroupType === type.key
                            ? 'text-orange-600 border-b-2 border-orange-600'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        {type.key === 'domestic' ? 'Domestic' : 'International'}
                      </button>
                    ))}
                  </div>

                  {/* View All Button */}
                  <button
                    onClick={() => handleCategorySelect(selectedGroupType)}
                    className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium bg-orange-50 text-orange-700 border border-orange-200 hover:bg-orange-100 mb-2"
                  >
                    All {selectedGroupType === 'domestic' ? 'Domestic Tours' : 'International Tours'}
                  </button>
                  
                  {/* Locations List */}
                  <div className="space-y-1">
                    {filteredLocations.length > 0 ? (
                      filteredLocations.map(location => (
                        <button
                          key={location}
                          onClick={() => handleLocationSelect(location)}
                          className="block w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-orange-50 rounded-md border border-gray-100"
                        >
                          {location}
                        </button>
                      ))
                    ) : (
                      <div className="px-3 py-2 text-gray-500 text-sm">
                        No {selectedGroupType === 'domestic' ? 'states' : 'countries'} available
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Speciality Tours Mobile */}
            <div>
              <button
                onClick={() => setSpecialDropdownOpen(!specialDropdownOpen)}
                className="w-full flex items-center justify-between py-2 px-3 font-semibold text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                aria-expanded={specialDropdownOpen}
              >
                <span>Speciality Tours</span>
                <FaChevronDown className={`text-xs transition-transform duration-200 ${
                  specialDropdownOpen ? 'rotate-180' : ''
                }`} />
              </button>
              
              {specialDropdownOpen && (
                <div className="ml-4 mt-2 space-y-2">
                  {specialTours.length > 0 ? (
                    specialTours.map((tour) => (
                      <Link
                        key={tour.id}
                        to={`/tours/${tour.id}`}
                        className="flex items-center space-x-3 py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <img
                          src={tour.coverImage || "/placeholder.jpg"}
                          alt={tour.title}
                          className="w-10 h-10 object-cover rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-700 truncate">
                            {tour.title}
                          </p>
                          {tour.price && (
                            <p className="text-xs text-orange-600 font-semibold">
                              ${tour.price.toLocaleString()}
                            </p>
                          )}
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className="px-3 py-2 text-gray-500 text-sm">
                      No special tours available
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Navigation Links */}
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className="block py-2 px-3 font-semibold text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="pt-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search tours..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-3 pr-10 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  aria-label="Search tours"
                />
                <button
                  type="submit"
                  className="absolute right-0 top-0 h-full px-3 bg-orange-600 text-white rounded-r-lg hover:bg-orange-700 transition-colors"
                  aria-label="Search"
                >
                  <FaSearch className="text-sm" />
                </button>
              </div>
            </form>

            {/* Mobile User Actions */}
            <div className="pt-4 border-t border-gray-200">
              {userInfo ? (
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 px-3 py-2">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                      <FaUser className="text-orange-600 text-sm" />
                    </div>
                    <span className="font-medium text-gray-700">{userInfo.name}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700 transition-colors font-medium"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    to="/login"
                    className="text-center py-2 font-semibold text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="text-center py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;