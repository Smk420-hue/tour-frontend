// src/pages/TourDetails.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTours } from "../hooks/useTours";
import TourGallery from "../components/tours/TourGallery";
import ReviewList from "../components/review/ReviewList";
import ReviewForm from "../components/review/ReviewForm";
import LoadingSpinner from "../components/common/LoadingSpinner";
import BookingWidget from "../components/booking/BookingWidget";
import { 
  StarIcon, 
  ClockIcon, 
  MapPinIcon, 
  CurrencyRupeeIcon, 
  UserGroupIcon,
  CalendarIcon,
  ShieldCheckIcon,
  HeartIcon,
  ExclamationTriangleIcon,
  CheckBadgeIcon,
  XMarkIcon
} from '@heroicons/react/24/solid';
import { HeartIcon as HeartOutline } from '@heroicons/react/24/outline';

const TourDetails = () => {
  const { id } = useParams();
  const { tour, loading, error, fetchTour, submitReview } = useTours();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (id) {
      fetchTour(id);
    }
  }, [id, fetchTour]);

  const handleAddReview = async (reviewData) => {
    try {
      await submitReview(id, reviewData);
      // The hook will automatically update the tour state with the new review
    } catch (error) {
      console.error('Failed to submit review:', error);
    }
  };

  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN').format(price);
  };

  const renderRatingStars = (rating) => {
    const numericRating = parseFloat(rating) || 0;
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, index) => (
          <StarIcon
            key={index}
            className={`w-5 h-5 ${
              index < Math.floor(numericRating) 
                ? 'text-yellow-400 fill-current' 
                : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-1 text-sm text-gray-600">({numericRating.toFixed(1)})</span>
      </div>
    );
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <ExclamationTriangleIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Tour</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => fetchTour(id)}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Tour not found state
  if (!tour) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Tour Not Found</h2>
          <p className="text-gray-600">The tour you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  // Prepare images for gallery
  const galleryImages = [
    ...(tour.coverImage ? [tour.coverImage] : []),
    ...(tour.images ? tour.images.map(img => 
      typeof img === 'string' ? img : img.imageUrl || img.url
    ) : [])
  ].filter(Boolean);

  // Calculate discount percentage for the tour
  const discountPercentage = tour.originalPrice && tour.originalPrice > tour.price 
    ? Math.round(((tour.originalPrice - tour.price) / tour.originalPrice) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium">
                  {tour.category || 'Tour'}
                </span>
                {tour.isFeatured && (
                  <span className="bg-amber-100 text-amber-600 px-3 py-1 rounded-full text-sm font-medium">
                    Featured
                  </span>
                )}
                {discountPercentage > 0 && (
                  <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm font-medium">
                    {discountPercentage}% Off
                  </span>
                )}
                {tour.availableSeats < 5 && tour.availableSeats > 0 && (
                  <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-medium">
                    Only {tour.availableSeats} left!
                  </span>
                )}
                {tour.availableSeats === 0 && (
                  <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-medium">
                    Sold Out
                  </span>
                )}
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">{tour.title}</h1>
              <div className="flex items-center gap-6 flex-wrap">
                <div className="flex items-center gap-2">
                  <MapPinIcon className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-600 font-medium">{tour.destination}</span>
                </div>
                <div className="flex items-center gap-2">
                  {renderRatingStars(tour.averageRating)}
                  <span className="text-gray-600">
                    ({tour.numReviews || 0} reviews)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <ClockIcon className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-600">{tour.duration} days</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={toggleBookmark}
                className={`p-3 rounded-full border transition-colors ${
                  isBookmarked 
                    ? 'border-red-300 bg-red-50' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                title={isBookmarked ? "Remove from bookmarks" : "Add to bookmarks"}
              >
                {isBookmarked ? (
                  <HeartIcon className="w-6 h-6 text-red-500" />
                ) : (
                  <HeartOutline className="w-6 h-6 text-gray-400" />
                )}
              </button>
              <button 
                onClick={() => document.getElementById('booking-widget')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-green-600 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Book Now
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Gallery - Only show if images exist */}
            {galleryImages.length > 0 && (
              <TourGallery images={galleryImages} />
            )}

            {/* Key Highlights Bar */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-gray-900">{tour.duration}</div>
                  <div className="text-sm text-gray-600">Days</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{tour.groupSize || 'Small'}</div>
                  <div className="text-sm text-gray-600">Group Size</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900 capitalize">{tour.difficulty || 'Moderate'}</div>
                  <div className="text-sm text-gray-600">Difficulty</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{tour.ageRange || 'All Ages'}</div>
                  <div className="text-sm text-gray-600">Age Range</div>
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6 overflow-x-auto">
                  {['overview', 'itinerary', 'inclusions', 'reviews'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm capitalize whitespace-nowrap transition-colors ${
                        activeTab === tab
                          ? 'border-indigo-500 text-indigo-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-6">
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">Tour Overview</h3>
                      <p className="text-gray-700 leading-relaxed text-lg">{tour.shortDescription}</p>
                      {tour.fullDescription && (
                        <p className="text-gray-600 leading-relaxed mt-4">{tour.fullDescription}</p>
                      )}
                    </div>
                    
                    {/* Highlights */}
                    {tour.highlights && tour.highlights.length > 0 && (
                      <div className="mt-6">
                        <h4 className="text-xl font-semibold mb-4 text-gray-900">Tour Highlights</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {tour.highlights.map((highlight, index) => (
                            <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                              <CheckBadgeIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-700">{highlight}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900">Customer Reviews</h3>
                        <p className="text-gray-600 mt-1">Hear from our travelers</p>
                      </div>
                      <div className="text-right bg-gray-50 p-4 rounded-lg">
                        <div className="text-3xl font-bold text-gray-900">{tour.averageRating ? tour.averageRating.toFixed(1) : '0.0'}</div>
                        {renderRatingStars(tour.averageRating)}
                        <div className="text-sm text-gray-500">{tour.numReviews || 0} reviews</div>
                      </div>
                    </div>
                    <ReviewList reviews={tour.reviews || []} />
                    <ReviewForm onSubmit={handleAddReview} />
                  </div>
                )}

                {activeTab === 'itinerary' && (
  <div className="space-y-6">
    <h3 className="text-2xl font-bold text-gray-900">Tour Itinerary</h3>
    {tour.itineraries && tour.itineraries.length > 0 ? (
      <div className="space-y-4">
        {tour.itineraries.map((day) => (
          <div
            key={day.id}
            className="border-l-4 border-indigo-500 pl-4 py-3 bg-gray-50 rounded-lg"
          >
            <h4 className="font-semibold text-gray-900 mb-1">
              Day {day.dayNumber}: {day.title}
            </h4>
            <p className="text-gray-700">{day.description}</p>
            {day.activities && (
              <p className="text-gray-600 mt-1 text-sm">
                <span className="font-medium text-indigo-600">Activities:</span>{" "}
                {day.activities}
              </p>
            )}
          </div>
        ))}
      </div>
    ) : (
      <div className="text-center py-8">
        <CalendarIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">
          Detailed itinerary information will be available soon.
        </p>
      </div>
    )}
  </div>
)}

                {activeTab === 'inclusions' && (
  <div className="space-y-6">
    <h3 className="text-2xl font-bold text-gray-900">What's Included & Excluded</h3>

    {(tour.inclusions?.length > 0 || tour.exclusions?.length > 0) ? (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Included */}
        {tour.inclusions?.length > 0 && (
          <div>
            <h4 className="font-semibold text-green-600 mb-3 flex items-center gap-2">
              <CheckBadgeIcon className="w-5 h-5" />
              Included
            </h4>
            <ul className="space-y-2">
              {tour.inclusions.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center gap-2 text-gray-700"
                >
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  {item.text}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Excluded */}
        {tour.exclusions?.length > 0 && (
          <div>
            <h4 className="font-semibold text-red-600 mb-3 flex items-center gap-2">
              <XMarkIcon className="w-5 h-5" />
              Not Included
            </h4>
            <ul className="space-y-2">
              {tour.exclusions.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center gap-2 text-gray-700"
                >
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  {item.text}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    ) : (
      <div className="text-center py-8">
        <ShieldCheckIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">
          Inclusion and exclusion details will be available soon.
        </p>
      </div>
    )}
  </div>
)}

              </div>
            </div>
          </div>

          {/* Sidebar - Booking Widget */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              <BookingWidget tour={tour} />
              
              {/* Quick Facts */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h4 className="font-semibold text-lg mb-4 text-gray-900">Quick Facts</h4>
                <div className="space-y-4">
                  {tour.difficulty && (
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600">Difficulty:</span>
                      <span className="font-medium capitalize px-3 py-1 bg-gray-100 rounded-full text-sm">
                        {tour.difficulty}
                      </span>
                    </div>
                  )}
                  {tour.groupSize && (
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600">Group Size:</span>
                      <span className="font-medium">{tour.groupSize} people</span>
                    </div>
                  )}
                  {tour.ageRange && (
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600">Age Range:</span>
                      <span className="font-medium">{tour.ageRange}</span>
                    </div>
                  )}
                  {tour.languages && (
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600">Languages:</span>
                      <span className="font-medium">{tour.languages.join(', ')}</span>
                    </div>
                  )}
                  {tour.meals && (
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-600">Meals Included:</span>
                      <span className="font-medium">{tour.meals}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Need Help Section */}
              <div className="bg-blue-50 rounded-2xl border border-blue-200 p-6">
                <h4 className="font-semibold text-lg mb-2 text-blue-900">Need Help?</h4>
                <p className="text-blue-700 text-sm mb-4">
                  Our travel experts are here to help you plan your perfect trip.
                </p>
                <div className="space-y-2 text-sm text-blue-600">
                  <div className="flex items-center gap-2">
                    <ShieldCheckIcon className="w-4 h-4" />
                    <span>24/7 Customer Support</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4" />
                    <span>Free Cancellation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CurrencyRupeeIcon className="w-4 h-4" />
                    <span>Best Price Guarantee</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourDetails;