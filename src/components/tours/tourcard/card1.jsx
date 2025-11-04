import { useNavigate } from "react-router-dom";
import {
  StarIcon,
  ClockIcon,
  MapPinIcon,
  CurrencyRupeeIcon,
  SunIcon,
  MoonIcon,
  UserGroupIcon,
  CalendarIcon,
} from "@heroicons/react/24/solid";
import { useRef, useCallback, useMemo, useState } from "react";
import { motion } from "framer-motion";

const TourCard = ({ tour = {} }) => {
  const cardRef = useRef(null);
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);

  // Map API data to component props with defensive values
  const {
    id = "",
    title = "Untitled Tour",
    price = 0,
    discount = 0,
    averageRating = 0,
    numReviews = 0,
    duration = 0,
    state = "",
    country = "",
    shortDescription = "",
    coverImage = "",
    category = "",
    isPopular = false,
    seats = 0,
    bookedSeats = 0,
    tourType = "",
    departureDate,
    capacity = 0,
    itineraries = [],
    inclusions = [],
    exclusions = [],
    images = [],
  } = tour;

  // Calculate derived values
  const finalPrice = discount > 0 ? price - discount : price;
  const availableSeats = seats - bookedSeats;
  const occupancyRate = seats > 0 ? (bookedSeats / seats) * 100 : 0;
  const displayNights = duration > 0 ? duration - 1 : 0;

  // Memoized price formatting
  const formattedPrice = useMemo(
    () => new Intl.NumberFormat("en-IN").format(finalPrice),
    [finalPrice]
  );

  const originalPrice = useMemo(
    () => discount > 0 ? new Intl.NumberFormat("en-IN").format(price) : null,
    [price, discount]
  );

  // Memoized rating stars
  const ratingStars = useMemo(() => {
    const stars = [];
    const fullStars = Math.floor(averageRating);

    for (let i = 0; i < 5; i++) {
      stars.push(
        <StarIcon
          key={i}
          className={`w-4 h-4 ${
            i < fullStars
              ? "text-yellow-400 fill-current"
              : "text-gray-300 fill-current"
          }`}
        />
      );
    }
    return stars;
  }, [averageRating]);

  // Optimized ripple + navigation effect
  const handleClick = useCallback(
    (event) => {
      const card = cardRef.current;
      if (!card) return;

      // Ripple creation
      const ripple = document.createElement("span");
      const rect = card.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = event.clientX - rect.left - size / 2;
      const y = event.clientY - rect.top - size / 2;

      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      ripple.className =
        "absolute bg-indigo-200 opacity-50 rounded-full animate-ripple pointer-events-none";
      card.appendChild(ripple);

      // Clean up and navigate
      setTimeout(() => {
        ripple.remove();
        navigate(`/tours/${id}`);
      }, 200);
    },
    [id, navigate]
  );

  // Keyboard navigation support
  const handleKeyPress = useCallback(
    (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        handleClick(event);
      }
    },
    [handleClick]
  );

  // Format departure date
  const formattedDepartureDate = useMemo(() => {
    if (!departureDate) return null;
    return new Date(departureDate).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  }, [departureDate]);

  // Subcomponents
  const PopularBadge = () => 
    isPopular ? (
      <div className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-md">
        Popular
      </div>
    ) : null;

  const DiscountBadge = () =>
    discount > 0 ? (
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-md">
        Save ₹{new Intl.NumberFormat("en-IN").format(discount)}
      </div>
    ) : null;

  const CategoryBadge = () =>
    category ? (
      <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1 shadow-sm">
        <span className="text-xs font-medium text-gray-700 capitalize">
          {category}
        </span>
      </div>
    ) : null;

  const RatingBadge = () => (
    <div className="bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1 shadow-sm">
      <StarIcon className="w-4 h-4 text-yellow-500 fill-current" />
      <span className="text-sm font-semibold text-gray-800">
        {averageRating.toFixed(1)}
      </span>
    </div>
  );

  const DurationBadge = () => (
    <div className="bg-black/80 text-white px-3 py-2 rounded-xl flex items-center gap-2 backdrop-blur-sm">
      <div className="flex items-center gap-1">
        <SunIcon className="w-3 h-3 text-amber-300" />
        <span className="text-xs font-medium">{duration}D</span>
      </div>
      <div className="h-3 w-px bg-white/40"></div>
      <div className="flex items-center gap-1">
        <MoonIcon className="w-3 h-3 text-blue-300" />
        <span className="text-xs font-medium">{displayNights}N</span>
      </div>
    </div>
  );

  const AvailabilityIndicator = () => (
    <div className="flex items-center gap-2 text-xs">
      <UserGroupIcon className="w-4 h-4 text-gray-400" />
      <div className="flex-1">
        <div className="flex justify-between text-gray-600 mb-1">
          <span>Available: {availableSeats}/{seats}</span>
          <span className="font-medium">{Math.round(occupancyRate)}% booked</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1.5">
          <div 
            className={`h-1.5 rounded-full ${
              occupancyRate > 80 ? 'bg-red-500' : 
              occupancyRate > 50 ? 'bg-amber-500' : 'bg-green-500'
            }`}
            style={{ width: `${occupancyRate}%` }}
          ></div>
        </div>
      </div>
    </div>
  );

  // Itinerary Preview Component
  const ItineraryPreview = useMemo(() => {
    if (!itineraries?.length) return null;

    return (
      <div className="mt-3 pt-3 border-t border-gray-100">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">Itinerary Preview</h4>
        <div className="space-y-2">
          {itineraries.slice(0, 3).map((itinerary) => (
            <div key={itinerary.id} className="flex items-start gap-2 text-xs">
              <span className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded font-medium min-w-6 text-center">
                {itinerary.dayNumber}
              </span>
              <span className="text-gray-600 flex-1 line-clamp-1">{itinerary.title}</span>
            </div>
          ))}
          {itineraries.length > 3 && (
            <div className="text-xs text-indigo-600 font-medium">
              +{itineraries.length - 3} more days
            </div>
          )}
        </div>
      </div>
    );
  }, [itineraries]);

  // Inclusions Preview
  const InclusionsPreview = useMemo(() => {
    if (!inclusions?.length) return null;

    return (
      <div className="mt-2">
        <div className="flex flex-wrap gap-1">
          {inclusions.slice(0, 2).map((inclusion, index) => (
            <span
              key={inclusion.id}
              className="bg-green-50 text-green-700 px-2 py-1 rounded text-xs font-medium"
            >
              {inclusion.text}
            </span>
          ))}
          {inclusions.length > 2 && (
            <span className="bg-green-50 text-green-700 px-2 py-1 rounded text-xs font-medium">
              +{inclusions.length - 2} more
            </span>
          )}
        </div>
      </div>
    );
  }, [inclusions]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      whileHover={{ scale: 1.02 }}
      className="h-full"
    >
      <div
        ref={cardRef}
        onClick={handleClick}
        onKeyPress={handleKeyPress}
        tabIndex={0}
        className="group block bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-indigo-200 transform hover:-translate-y-2 relative cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 h-full flex flex-col"
        aria-label={`View details for ${title} tour in ${state}, ${country} lasting ${duration} days`}
        role="button"
      >
        {/* Ripple animation CSS */}
        <style>
          {`
            @keyframes ripple {
              from {
                transform: scale(0);
                opacity: 0.6;
              }
              to {
                transform: scale(4);
                opacity: 0;
              }
            }
            .animate-ripple {
              animation: ripple 0.6s linear;
              position: absolute;
              transform: scale(0);
            }
          `}
        </style>

        {/* Background gradient overlay */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          aria-hidden="true"
        />

        {/* Image Section */}
        <div className="relative overflow-hidden flex-shrink-0">
          <img
            src={imageError ? "/images/tour-placeholder.jpg" : (coverImage || "/images/tour-placeholder.jpg")}
            onError={() => setImageError(true)}
            alt={`${title} - ${state}, ${country}`}
            className="w-full h-52 object-cover group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
          />

          {/* Top Left Badges */}
          <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
            <PopularBadge />
            <DiscountBadge />
            <CategoryBadge />
          </div>

          {/* Top Right Badges */}
          <div className="absolute top-3 right-3 z-10 flex flex-col gap-2 items-end">
            <RatingBadge />
          </div>

          {/* Bottom Left Badge */}
          <div className="absolute bottom-3 left-3 z-10">
            <DurationBadge />
          </div>

          {/* Tour Type Badge */}
          <div className="absolute bottom-3 right-3 z-10">
            <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 shadow-sm">
              <span className="text-xs font-medium text-gray-700 capitalize">
                {tourType}
              </span>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="relative p-5 z-10 flex-1 flex flex-col">
          {/* Location */}
          <div className="flex items-center gap-1 mb-2">
            <MapPinIcon className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-500 font-medium">
              {state}, {country}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors duration-300 flex-shrink-0">
            {title}
          </h3>

          {/* Short Description */}
          {shortDescription && (
            <p className="text-sm text-gray-600 mb-3 line-clamp-2 flex-shrink-0">
              {shortDescription}
            </p>
          )}

          {/* Departure Date */}
          {formattedDepartureDate && (
            <div className="flex items-center gap-1 text-sm text-gray-500 mb-3">
              <CalendarIcon className="w-4 h-4" />
              <span>Departs: {formattedDepartureDate}</span>
            </div>
          )}

          {/* Rating & Reviews */}
          <div className="flex items-center justify-between mb-4 flex-shrink-0">
            <div className="flex items-center gap-1">
              {ratingStars}
              <span className="text-sm text-gray-600 ml-1">
                ({averageRating.toFixed(1)})
              </span>
            </div>
            <span className="text-sm text-gray-500">{numReviews} reviews</span>
          </div>

          {/* Inclusions Preview */}
          {InclusionsPreview}

          {/* Itinerary Preview */}
          {ItineraryPreview}

          {/* Availability Indicator */}
          <div className="mt-3 pt-3 border-t border-gray-100">
            <AvailabilityIndicator />
          </div>

          {/* Price Section */}
          <div className="flex flex-col pt-4 border-t border-gray-100 mt-auto flex-shrink-0">
            <div className="flex items-baseline gap-1 mb-2">
              {originalPrice && (
                <span className="text-sm text-gray-500 line-through mr-1">
                  ₹{originalPrice}
                </span>
              )}
              <CurrencyRupeeIcon className="w-5 h-5 text-gray-900" />
              <span className="text-2xl font-bold text-gray-900">
                ₹{formattedPrice}
              </span>
              <span className="text-gray-500 text-sm">/person</span>
            </div>

            {/* CTA Button */}
            <div className="my-2">
              <span className="inline-block bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-2 rounded-lg font-semibold text-sm shadow-md group-hover:scale-105 group-hover:shadow-lg transition-all duration-300 w-full text-center">
                View Details
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TourCard;