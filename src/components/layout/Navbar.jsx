// src/components/layout/Navbar.jsx
import { FaSearch, FaUser, FaBars, FaTimes, FaChevronDown } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import logo from "../../assets/images/logo.png";
import { getDomesticTours, getInternationalTours, getAllTours } from "../../api/tourApi";
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
  const [dashboardDropdownOpen, setDashboardDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedGroupType, setSelectedGroupType] = useState("domestic");
  const [tours, setTours] = useState([]);
  const [domesticTours, setDomesticTours] = useState([]);
  const [internationalTours, setInternationalTours] = useState([]);
  const [specialTours, setSpecialTours] = useState([]);
  const [loadingLocations, setLoadingLocations] = useState(false);
  const navigate = useNavigate();

  // Refs for click outside detection
  const groupDropdownRef = useRef(null);
  const specialDropdownRef = useRef(null);
  const dashboardDropdownRef = useRef(null);
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

  // Fetch all tours data for special tours
  useEffect(() => {
    const fetchToursData = async () => {
      try {
        const data = await getAllTours();
        const toursData = data.tours || [];
        setTours(toursData);
        
        // Filter special tours
        const special = toursData.filter(tour => tour.tourType === "special");
        setSpecialTours(special);
      } catch (err) {
        console.error("Error fetching tours:", err);
        setTours([]);
        setSpecialTours([]);
      }
    };
    fetchToursData();
  }, []);

  // Fetch domestic and international tours separately for locations
  const fetchTourLocations = useCallback(async (category) => {
    setLoadingLocations(true);
    try {
      let data;
      if (category === 'domestic') {
        data = await getDomesticTours({ limit: 100 });
        const toursData = data.tours || data || [];
        setDomesticTours(toursData);
        return toursData;
      } else {
        data = await getInternationalTours({ limit: 100 });
        const toursData = data.tours || data || [];
        setInternationalTours(toursData);
        return toursData;
      }
    } catch (err) {
      console.error(`Error fetching ${category} tours:`, err);
      return [];
    } finally {
      setLoadingLocations(false);
    }
  }, []);

  // Load locations when group type changes
  useEffect(() => {
    if (groupDropdownOpen || mobileMenuOpen) {
      fetchTourLocations(selectedGroupType);
    }
  }, [selectedGroupType, groupDropdownOpen, mobileMenuOpen, fetchTourLocations]);

  // Check if user is admin
  const isAdmin = useMemo(() => {
    return userInfo?.role === 'admin' || userInfo?.isAdmin;
  }, [userInfo]);

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

  // Get filtered locations using separate API data
  const getFilteredLocations = useCallback(() => {
    let sourceTours = [];
    
    if (selectedGroupType === "domestic") {
      sourceTours = domesticTours;
    } else {
      sourceTours = internationalTours;
    }

    if (!sourceTours.length) {
      return [];
    }

    // Extract locations based on category
    const locations = selectedGroupType === "domestic" 
      ? [...new Set(sourceTours.map(tour => tour.state).filter(Boolean))]
      : [...new Set(sourceTours.map(tour => tour.country).filter(Boolean))];

    return locations.sort();
  }, [selectedGroupType, domesticTours, internationalTours]);

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
      if (dashboardDropdownRef.current && !dashboardDropdownRef.current.contains(event.target)) {
        setDashboardDropdownOpen(false);
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
    setDashboardDropdownOpen(false);
  }, []);

  // Group tour types
  const groupTourTypes = [
    { key: "domestic", label: "Domestic Tours" },
    { key: "international", label: "International Tours" }
  ];

  // Customer dashboard menu items
  const customerMenuItems = [
    { to: "/dashboard", label: "Dashboard Overview" },
    { to: "/dashboard/bookings", label: "My Bookings" },
    { to: "/dashboard/profile", label: "Profile Settings" },
    { to: "/dashboard/wishlist", label: "Wishlist" },
    { to: "/dashboard/payments", label: "Payment History" },
    { to: "/dashboard/reviews", label: "My Reviews" },
    { to: "/dashboard/support", label: "Support" }
  ];

  // Admin dashboard menu items
  const adminMenuItems = [
    { to: "/admin/dashboard", label: "Admin Dashboard" },
    { to: "/admin/users", label: "User Management" },
    { to: "/admin/tours", label: "Tour Management" },
    { to: "/admin/bookings", label: "Booking Management" },
    { to: "/admin/hotels", label: "Hotel Management" },
    { to: "/admin/settings", label: "System Settings" },
    { to: "/admin/analytics", label: "Analytics & Reports" }
  ];

  // Navigation links
  const navLinks = [
    { to: "/customize-tour", label: "customize tours" },
    { to: "/aboutus", label: "About Us" },
    { to: "/contact", label: "Contact" },
    { to: "/deals", label: "Deals" }
  ];

  return (
    <header className="bg-white shadow-md sticky top-0 z-50 border-b border-gray-100">
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

          {/* Desktop & Tablet Navigation */}
          <nav className="hidden lg:flex items-center space-x-6">
            {/* Group Tours Dropdown */}
            <div className="relative" ref={groupDropdownRef}>
              <button
                onClick={() => {
                  setGroupDropdownOpen(!groupDropdownOpen);
                  setSpecialDropdownOpen(false);
                  setDashboardDropdownOpen(false);
                }}
                className="flex items-center space-x-1 font-semibold text-gray-700 hover:text-indigo-600 transition-colors duration-200 py-2 whitespace-nowrap"
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
                            ? 'text-indigo-600 border-b-2 border-indigo-600'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        {type.label}
                      </button>
                    ))}
                  </div>

                  <div className="px-4 pt-4">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-bold text-indigo-600 text-sm uppercase tracking-wide">
                        {selectedGroupType === 'domestic' ? 'Indian States' : 'Countries'}
                      </h3>
                      <button
                        onClick={() => handleCategorySelect(selectedGroupType)}
                        className="px-3 py-1 text-xs bg-indigo-50 text-indigo-700 rounded-lg border border-indigo-200 hover:bg-indigo-100 transition-colors font-medium"
                      >
                        View All
                      </button>
                    </div>
                    
                    <div className="max-h-64 overflow-y-auto">
                      {loadingLocations ? (
                        <div className="text-center py-8">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600 mx-auto"></div>
                          <p className="text-sm text-gray-500 mt-2">Loading locations...</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 gap-2">
                          {filteredLocations.length > 0 ? (
                            filteredLocations.map(location => (
                              <button
                                key={location}
                                onClick={() => handleLocationSelect(location)}
                                className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-indigo-50 hover:text-indigo-700 rounded-md transition-colors border border-gray-100 hover:border-indigo-200"
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
                      )}
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
                  setDashboardDropdownOpen(false);
                }}
                className="flex items-center space-x-1 font-semibold text-gray-700 hover:text-indigo-600 transition-colors duration-200 py-2 whitespace-nowrap"
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
                    <h3 className="font-bold text-indigo-600 text-sm uppercase tracking-wide mb-3">
                      Special Tours
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
                              <p className="text-sm font-medium text-gray-900 group-hover:text-indigo-600 truncate">
                                {tour.title}
                              </p>
                              {tour.price && (
                                <p className="text-xs text-indigo-600 font-semibold">
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
                className="font-semibold text-gray-700 hover:text-indigo-600 transition-colors duration-200 py-2"
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
                className="pl-3 pr-10 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-40 text-sm transition-all duration-200"
                aria-label="Search tours"
              />
              <button
                type="submit"
                className="absolute right-0 top-0 h-full px-3 bg-indigo-600 text-white rounded-r-lg hover:bg-indigo-700 transition-colors duration-200 flex items-center justify-center"
                aria-label="Search"
              >
                <FaSearch className="text-sm" />
              </button>
            </form>
          </nav>

          {/* User Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            {userInfo ? (
              <div className="flex items-center space-x-4">
                {/* Dashboard Dropdown */}
                <div className="relative" ref={dashboardDropdownRef}>
                  <button
                    onClick={() => {
                      setDashboardDropdownOpen(!dashboardDropdownOpen);
                      setGroupDropdownOpen(false);
                      setSpecialDropdownOpen(false);
                    }}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-200 font-medium text-sm ${
                      isAdmin 
                        ? 'bg-purple-600 text-white hover:bg-purple-700' 
                        : 'bg-indigo-600 text-white hover:bg-indigo-700'
                    }`}
                    aria-expanded={dashboardDropdownOpen}
                    aria-haspopup="true"
                    aria-label="Dashboard menu"
                  >
                    <FaUser className="text-sm" />
                    <span>{isAdmin ? 'Admin Panel' : 'Dashboard'}</span>
                    <FaChevronDown className={`text-xs transition-transform duration-200 ${
                      dashboardDropdownOpen ? 'rotate-180' : ''
                    }`} />
                  </button>

                  {dashboardDropdownOpen && (
                    <div className="absolute top-full right-0 mt-2 bg-white shadow-xl rounded-lg w-64 py-2 z-50 border border-gray-100">
                      <div className="px-2">
                        {/* User Info Section */}
                        <div className="px-3 py-2 border-b border-gray-100">
                          <div className="flex items-center space-x-2">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              isAdmin ? 'bg-purple-100' : 'bg-indigo-100'
                            }`}>
                              <FaUser className={isAdmin ? 'text-purple-600 text-sm' : 'text-indigo-600 text-sm'} />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900 text-sm">{userInfo.name}</p>
                              <p className="text-xs text-gray-500 truncate">
                                {isAdmin ? 'Administrator' : 'Customer'} • {userInfo.email}
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        {/* Menu Items */}
                        <div className="max-h-80 overflow-y-auto py-1">
                          {(isAdmin ? adminMenuItems : customerMenuItems).map((item) => (
                            <Link
                              key={item.to}
                              to={item.to}
                              className="flex items-center space-x-3 px-3 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 rounded-md transition-colors"
                              onClick={() => setDashboardDropdownOpen(false)}
                            >
                              <span className="text-sm">{item.label}</span>
                            </Link>
                          ))}
                        </div>

                        {/* Logout Section */}
                        <div className="border-t border-gray-100 pt-1 mt-1">
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
                          >
                            <span>Logout</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="font-semibold text-gray-700 hover:text-indigo-600 transition-colors duration-200 text-sm"
                  onClick={closeAllDropdowns}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-200 font-medium text-sm"
                  onClick={closeAllDropdowns}
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center">
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
            className="lg:hidden bg-white border-t border-gray-200 py-4 px-4 space-y-4 max-h-screen overflow-y-auto"
          >
            {/* Group Tours Mobile */}
            <div>
              <button
                onClick={() => setGroupDropdownOpen(!groupDropdownOpen)}
                className="w-full flex items-center justify-between py-3 px-3 font-semibold text-gray-700 hover:bg-gray-50 rounded-lg transition-colors text-base whitespace-nowrap"
                aria-expanded={groupDropdownOpen}
              >
                <span>Group Tours</span>
                <FaChevronDown className={`text-xs transition-transform duration-200 ${
                  groupDropdownOpen ? 'rotate-180' : ''
                }`} />
              </button>
              
              {groupDropdownOpen && (
                <div className="ml-4 mt-2 space-y-3">
                  <div className="flex space-x-2 border-b border-gray-200 pb-2">
                    {groupTourTypes.map((type) => (
                      <button
                        key={type.key}
                        onClick={() => handleGroupTypeSelect(type.key)}
                        className={`flex-1 py-2 text-sm font-medium transition-colors ${
                          selectedGroupType === type.key
                            ? 'text-indigo-600 border-b-2 border-indigo-600'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        {type.key === 'domestic' ? 'Domestic' : 'International'}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => {
                      handleCategorySelect(selectedGroupType);
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-3 rounded-lg text-base font-medium bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 mb-2"
                  >
                    All {selectedGroupType === 'domestic' ? 'Domestic Tours' : 'International Tours'}
                  </button>
                  
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {loadingLocations ? (
                      <div className="text-center py-4">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600 mx-auto"></div>
                        <p className="text-sm text-gray-500 mt-2">Loading locations...</p>
                      </div>
                    ) : filteredLocations.length > 0 ? (
                      filteredLocations.map(location => (
                        <button
                          key={location}
                          onClick={() => {
                            handleLocationSelect(location);
                            setMobileMenuOpen(false);
                          }}
                          className="block w-full text-left px-3 py-3 text-base text-gray-600 hover:bg-indigo-50 rounded-md border border-gray-100"
                        >
                          {location}
                        </button>
                      ))
                    ) : (
                      <div className="px-3 py-3 text-gray-500 text-base text-center">
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
                className="w-full flex items-center justify-between py-3 px-3 font-semibold text-gray-700 hover:bg-gray-50 rounded-lg transition-colors text-base whitespace-nowrap"
                aria-expanded={specialDropdownOpen}
              >
                <span>Speciality Tours</span>
                <FaChevronDown className={`text-xs transition-transform duration-200 ${
                  specialDropdownOpen ? 'rotate-180' : ''
                }`} />
              </button>
              
              {specialDropdownOpen && (
                <div className="ml-4 mt-2 space-y-3">
                  {specialTours.length > 0 ? (
                    specialTours.map((tour) => (
                      <Link
                        key={tour.id}
                        to={`/tours/${tour.id}`}
                        className="flex items-center space-x-3 py-3 px-3 rounded-lg hover:bg-gray-50 transition-colors"
                        onClick={() => {
                          setSpecialDropdownOpen(false);
                          setMobileMenuOpen(false);
                        }}
                      >
                        <img
                          src={tour.coverImage || "/placeholder.jpg"}
                          alt={tour.title}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-base font-medium text-gray-700 truncate">
                            {tour.title}
                          </p>
                          {tour.price && (
                            <p className="text-sm text-indigo-600 font-semibold">
                              ${tour.price.toLocaleString()}
                            </p>
                          )}
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className="px-3 py-3 text-gray-500 text-base text-center">
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
                className="block py-3 px-3 font-semibold text-gray-700 hover:bg-gray-50 rounded-lg transition-colors text-base"
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
                  className="w-full pl-4 pr-12 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-base"
                  aria-label="Search tours"
                />
                <button
                  type="submit"
                  className="absolute right-0 top-0 h-full px-4 bg-indigo-600 text-white rounded-r-lg hover:bg-indigo-700 transition-colors"
                  aria-label="Search"
                >
                  <FaSearch className="text-base" />
                </button>
              </div>
            </form>

            {/* Mobile User Actions */}
            <div className="pt-4 border-t border-gray-200">
              {userInfo ? (
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 px-3 py-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      isAdmin ? 'bg-purple-100' : 'bg-indigo-100'
                    }`}>
                      <FaUser className={isAdmin ? 'text-purple-600' : 'text-indigo-600'} />
                    </div>
                    <div>
                      <p className="font-medium text-gray-700 text-base">{userInfo.name}</p>
                      <p className="text-sm text-gray-500">
                        {isAdmin ? 'Administrator' : 'Customer'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors font-medium text-base"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    to="/login"
                    className="text-center py-3 font-semibold text-gray-700 hover:bg-gray-50 rounded-lg transition-colors text-base"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="text-center py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium text-base"
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
