import { Link, useNavigate } from "react-router-dom";
import {
  StarIcon,
  ClockIcon,
  MapPinIcon,
  CurrencyRupeeIcon,
} from "@heroicons/react/24/solid";
import { useRef, useCallback, useMemo } from "react";
import { motion } from "framer-motion";

const TourCard = ({ tour = {} }) => {
  const cardRef = useRef(null);
  const navigate = useNavigate();

  // Defensive values
  const {
    id = "",
    title = "Untitled Tour",
    price = 0,
    averageRating = 0,
    numReviews = 0,
    duration = 0,
    destination = "Unknown",
    coverImage = "",
    category = "",
    highlights = [],
    groupSize,
    difficulty,
  } = tour;

  // Memoized price formatting
  const formattedPrice = useMemo(
    () => new Intl.NumberFormat("en-IN").format(price),
    [price]
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
      }, 200); // delay allows ripple to show briefly
    },
    [id, navigate]
  );

  // Highlights rendering
  const renderHighlights = useMemo(() => {
    if (!highlights?.length) return null;

    return (
      <div className="mb-4 flex flex-wrap gap-1">
        {highlights.slice(0, 3).map((highlight, index) => (
          <span
            key={index}
            className="bg-blue-50 text-blue-600 px-2 py-1 rounded text-xs font-medium"
          >
            {highlight}
          </span>
        ))}
      </div>
    );
  }, [highlights]);

  // Subcomponents
  const SpecialOfferBadge = () =>
    category === "Special" ? (
      <div className="absolute top-3 left-3 z-10">
        <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-md">
          Special Offer
        </span>
      </div>
    ) : null;

  const RatingBadge = () => (
    <div className="absolute top-3 right-3 z-10">
      <div className="bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
        <StarIcon className="w-4 h-4 text-yellow-500 fill-current" />
        <span className="text-sm font-semibold text-gray-800">
          {averageRating.toFixed(1)}
        </span>
      </div>
    </div>
  );

  const DurationBadge = () => (
    <div className="absolute bottom-3 left-3 z-10">
      <div className="bg-black/70 text-white px-2 py-1 rounded-lg flex items-center gap-1">
        <ClockIcon className="w-4 h-4" />
        <span className="text-sm font-medium">{duration} days</span>
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <div
        ref={cardRef}
        onClick={handleClick}
        className="group block bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-indigo-200 transform hover:-translate-y-2 relative cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        aria-label={`View details for ${title}`}
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

        {/* Image */}
        <div className="relative overflow-hidden">
          <img
            src={coverImage || "/images/tour-placeholder.jpg"}
            onError={(e) => (e.target.src = "/images/tour-placeholder.jpg")}
            alt={title}
            className="w-full h-52 object-cover group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
          />

          <SpecialOfferBadge />
          <RatingBadge />
          <DurationBadge />
        </div>

        {/* Content */}
        <div className="relative p-5 z-10">
          {/* Destination */}
          <div className="flex items-center gap-1 mb-2">
            <MapPinIcon className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-500 font-medium">
              {destination}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-indigo-600 transition-colors duration-300">
            {title}
          </h3>

          {/* Highlights */}
          {renderHighlights}

          {/* Rating & Reviews */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-1">
              {ratingStars}
              <span className="text-sm text-gray-600 ml-1">
                ({averageRating.toFixed(1)})
              </span>
            </div>
            <span className="text-sm text-gray-500">{numReviews} reviews</span>
          </div>

          {/* Price */}
          <div className="flex flex-col pt-4 border-t border-gray-100">
            <div className="flex items-baseline gap-1 mb-2">
              <CurrencyRupeeIcon className="w-5 h-5 text-gray-900" />
              <span className="text-2xl font-bold text-gray-900">
                {formattedPrice}
              </span>
              <span className="text-gray-500 text-sm">/person</span>
            </div>

            <div className="my-2">
              <span className="inline-block bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-2 rounded-lg font-semibold text-sm shadow-md group-hover:scale-105 group-hover:shadow-lg transition-all duration-300">
                View Details
              </span>
            </div>
          </div>

          {/* Extra info */}
          {(groupSize || difficulty) && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <div className="flex justify-between text-sm text-gray-500">
                {groupSize && <span>Group Size: {groupSize}</span>}
                {difficulty && <span>Difficulty: {difficulty}</span>}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default TourCard;
