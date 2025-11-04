// src/components/layout/Navbar.jsx
import { FaSearch, FaUser, FaBars, FaTimes, FaChevronDown, FaTachometerAlt, FaUsers, FaCog, FaChartBar, FaHotel, FaMapMarkedAlt } from "react-icons/fa";
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
  const [dashboardDropdownOpen, setDashboardDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedGroupType, setSelectedGroupType] = useState("domestic");
  const [tours, setTours] = useState([]);
  const [specialTours, setspecialTours] = useState([]);
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

  // Get filtered locations based on selected group type - FIXED LOGIC
  const getFilteredLocations = useCallback(() => {
    if (!tours.length) return [];
    
    const filteredTours = tours.filter(tour => {
      if (selectedGroupType === "international") {
        // For international tours, check category and ensure country exists
        return tour.category === "international" && tour.country; ;
      } else {
        // For domestic tours, check category and ensure state exists
        return tour.category === "domestic" && tour.state && tour.state.trim() !== "";
      }
    });

    console.log(`Filtered ${selectedGroupType} tours:`, filteredTours); // Debug log

    const locations = filteredTours
      .map(tour => {
        if (selectedGroupType === "international") {
          return tour.country;
        } else {
          return tour.state;
        }
      })
      .filter((location, index, self) => 
        location && 
        location.trim() !== "" && 
        self.indexOf(location) === index
      )
      .sort();

    console.log(`Unique ${selectedGroupType} locations:`, locations); // Debug log

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
    { to: "/dashboard", label: "Dashboard Overview", icon: "📊" },
    { to: "/dashboard/bookings", label: "My Bookings", icon: "📋" },
    { to: "/dashboard/profile", label: "Profile Settings", icon: "👤" },
    { to: "/dashboard/wishlist", label: "Wishlist", icon: "❤️" },
    { to: "/dashboard/payments", label: "Payment History", icon: "💳" },
    { to: "/dashboard/reviews", label: "My Reviews", icon: "⭐" },
    { to: "/dashboard/support", label: "Support", icon: "🛟" }
  ];

  // Admin dashboard menu items
  const adminMenuItems = [
    { to: "/admin/dashboard", label: "Admin Dashboard", icon: <FaTachometerAlt className="text-sm" /> },
    { to: "/admin/users", label: "User Management", icon: <FaUsers className="text-sm" /> },
    { to: "/admin/tours", label: "Tour Management", icon: <FaMapMarkedAlt className="text-sm" /> },
    { to: "/admin/bookings", label: "Booking Management", icon: <FaChartBar className="text-sm" /> },
    { to: "/admin/hotels", label: "Hotel Management", icon: <FaHotel className="text-sm" /> },
    { to: "/admin/settings", label: "System Settings", icon: <FaCog className="text-sm" /> },
    { to: "/admin/analytics", label: "Analytics & Reports", icon: "📈" }
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
                  setDashboardDropdownOpen(false);
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

            {/* Search Bar - Updated for tablet responsiveness */}
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search tours..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-3 pr-10 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent w-32 lg:w-40 text-sm transition-all duration-200"
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

          {/* Tablet Navigation (hidden on mobile, shown on tablet) */}
          <nav className="hidden md:flex lg:hidden items-center space-x-4">
            {/* Simplified navigation for tablet */}
            <Link
              to="/tours/category/domestic"
              className="font-semibold text-gray-700 hover:text-orange-600 transition-colors duration-200 py-2 text-sm"
            >
              Domestic
            </Link>
            <Link
              to="/tours/category/international"
              className="font-semibold text-gray-700 hover:text-orange-600 transition-colors duration-200 py-2 text-sm"
            >
              International
            </Link>
            <Link
              to="/customize-tour"
              className="font-semibold text-gray-700 hover:text-orange-600 transition-colors duration-200 py-2 text-sm"
            >
              Destinations
            </Link>
            
            {/* Compact Search for Tablet */}
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-3 pr-8 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent w-28 text-sm"
                aria-label="Search tours"
              />
              <button
                type="submit"
                className="absolute right-0 top-0 h-full px-2 bg-orange-600 text-white rounded-r-lg hover:bg-orange-700 transition-colors duration-200 flex items-center justify-center"
                aria-label="Search"
              >
                <FaSearch className="text-xs" />
              </button>
            </form>
          </nav>

          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {userInfo ? (
              <div className="flex items-center space-x-4">
                {/* Dashboard Dropdown - Different for Admin vs Customer */}
                <div className="relative" ref={dashboardDropdownRef}>
                  <button
                    onClick={() => {
                      setDashboardDropdownOpen(!dashboardDropdownOpen);
                      setGroupDropdownOpen(false);
                      setSpecialDropdownOpen(false);
                    }}
                    className={`flex items-center space-x-2 px-3 lg:px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors duration-200 font-medium text-sm lg:text-base ${
                      isAdmin 
                        ? 'bg-purple-600 text-white hover:bg-purple-700' 
                        : 'bg-orange-600 text-white hover:bg-orange-700'
                    }`}
                    aria-expanded={dashboardDropdownOpen}
                    aria-haspopup="true"
                    aria-label="Dashboard menu"
                  >
                    <FaTachometerAlt className="text-sm" />
                    <span className="hidden lg:inline">{isAdmin ? 'Admin Panel' : 'Dashboard'}</span>
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
                              isAdmin ? 'bg-purple-100' : 'bg-orange-100'
                            }`}>
                              <FaUser className={isAdmin ? 'text-purple-600 text-sm' : 'text-orange-600 text-sm'} />
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
                              className="flex items-center space-x-3 px-3 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-700 rounded-md transition-colors"
                              onClick={() => setDashboardDropdownOpen(false)}
                            >
                              {typeof item.icon === 'string' ? (
                                <span className="text-base">{item.icon}</span>
                              ) : (
                                item.icon
                              )}
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
                            <span>🚪</span>
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
                  className="font-semibold text-gray-700 hover:text-orange-600 transition-colors duration-200 text-sm lg:text-base"
                  onClick={closeAllDropdowns}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-orange-600 text-white px-3 lg:px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors duration-200 font-medium text-sm lg:text-base"
                  onClick={closeAllDropdowns}
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button - Show on mobile and tablet */}
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

        {/* Mobile Menu - Enhanced for tablet */}
        {mobileMenuOpen && (
          <div 
            ref={mobileMenuRef}
            id="mobile-menu"
            className="md:hidden bg-white border-t border-gray-200 py-4 px-4 space-y-4 max-h-screen overflow-y-auto"
          >
            {/* Group Tours Mobile */}
            <div>
              <button
                onClick={() => setGroupDropdownOpen(!groupDropdownOpen)}
                className="w-full flex items-center justify-between py-3 px-3 font-semibold text-gray-700 hover:bg-gray-50 rounded-lg transition-colors text-base"
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
                            ? 'text-orange-600 border-b-2 border-orange-600'
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
                    className="w-full text-left px-3 py-3 rounded-lg text-base font-medium bg-orange-50 text-orange-700 border border-orange-200 hover:bg-orange-100 mb-2"
                  >
                    All {selectedGroupType === 'domestic' ? 'Domestic Tours' : 'International Tours'}
                  </button>
                  
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {filteredLocations.length > 0 ? (
                      filteredLocations.map(location => (
                        <button
                          key={location}
                          onClick={() => {
                            handleLocationSelect(location);
                            setMobileMenuOpen(false);
                          }}
                          className="block w-full text-left px-3 py-3 text-base text-gray-600 hover:bg-orange-50 rounded-md border border-gray-100"
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
                className="w-full flex items-center justify-between py-3 px-3 font-semibold text-gray-700 hover:bg-gray-50 rounded-lg transition-colors text-base"
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
                            <p className="text-sm text-orange-600 font-semibold">
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

            {/* Dashboard Mobile - Different for Admin vs Customer */}
            {userInfo && (
              <div>
                <button
                  onClick={() => setDashboardDropdownOpen(!dashboardDropdownOpen)}
                  className="w-full flex items-center justify-between py-3 px-3 font-semibold text-gray-700 hover:bg-gray-50 rounded-lg transition-colors text-base"
                  aria-expanded={dashboardDropdownOpen}
                >
                  <span>{isAdmin ? 'Admin Panel' : 'Dashboard'}</span>
                  <FaChevronDown className={`text-xs transition-transform duration-200 ${
                    dashboardDropdownOpen ? 'rotate-180' : ''
                  }`} />
                </button>
                
                {dashboardDropdownOpen && (
                  <div className="ml-4 mt-2 space-y-2">
                    {/* User Info in Mobile */}
                    <div className="px-3 py-3 bg-gray-50 rounded-lg mb-2">
                      <p className="font-medium text-gray-900 text-base">{userInfo.name}</p>
                      <p className="text-sm text-gray-500">
                        {isAdmin ? 'Administrator' : 'Customer'}
                      </p>
                    </div>

                    {(isAdmin ? adminMenuItems : customerMenuItems).map((item) => (
                      <Link
                        key={item.to}
                        to={item.to}
                        className="flex items-center space-x-3 py-3 px-3 text-base text-gray-600 hover:bg-orange-50 rounded-md transition-colors"
                        onClick={() => {
                          setDashboardDropdownOpen(false);
                          setMobileMenuOpen(false);
                        }}
                      >
                        {typeof item.icon === 'string' ? (
                          <span className="text-lg">{item.icon}</span>
                        ) : (
                          item.icon
                        )}
                        <span>{item.label}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}

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
                  className="w-full pl-4 pr-12 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-base"
                  aria-label="Search tours"
                />
                <button
                  type="submit"
                  className="absolute right-0 top-0 h-full px-4 bg-orange-600 text-white rounded-r-lg hover:bg-orange-700 transition-colors"
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
                      isAdmin ? 'bg-purple-100' : 'bg-orange-100'
                    }`}>
                      <FaUser className={isAdmin ? 'text-purple-600' : 'text-orange-600'} />
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
                    className="text-center py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium text-base"
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
