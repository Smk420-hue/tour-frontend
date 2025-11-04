import React, { useState, useEffect, useCallback, memo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Memoize the carousel item to prevent unnecessary re-renders
const CarouselItem = memo(({ item, imageLoaded, onImageLoad, onImageError }) => (
  <>
    <img
      src={item.imageUrl}
      alt={item.alt || item.title}
      className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
        imageLoaded ? "opacity-100" : "opacity-0"
      }`}
      onLoad={onImageLoad}
      onError={onImageError}
      loading="lazy"
      decoding="async"
    />
    <div className="absolute inset-0 bg-black/40 md:bg-black/30" />
  </>
));

const Carousel = ({ items = [], autoPlayInterval = 5000, showControls = true, showDots = true }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Memoized navigation functions
  const nextSlide = useCallback(() => {
    setImageLoaded(false);
    setCurrentIndex((prev) => (prev + 1) % items.length);
  }, [items.length]);

  const prevSlide = useCallback(() => {
    setImageLoaded(false);
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  }, [items.length]);

  const goToSlide = useCallback((index) => {
    setImageLoaded(false);
    setCurrentIndex(index);
  }, []);

  // Auto-play with pause on hover
  useEffect(() => {
    if (!items.length || isPaused) return;
    
    const interval = setInterval(() => {
      nextSlide();
    }, autoPlayInterval);
    
    return () => clearInterval(interval);
  }, [currentIndex, items.length, isPaused, autoPlayInterval, nextSlide]);

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
  }, []);

  const handleImageError = useCallback((e) => {
    e.target.src = "/images/placeholder.jpg";
    setImageLoaded(true);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!items.length) return;
      
      switch (e.key) {
        case "ArrowLeft":
          prevSlide();
          break;
        case "ArrowRight":
          nextSlide();
          break;
        case "Home":
          goToSlide(0);
          break;
        case "End":
          goToSlide(items.length - 1);
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [items.length, prevSlide, nextSlide, goToSlide]);

  // Dynamic position and alignment classes
  const getPositionClass = useCallback((position = "bottom") => {
    const positionClasses = {
      top: "top-10 left-1/2 transform -translate-x-1/2",
      center: "top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2",
      bottom: "bottom-10 left-1/2 transform -translate-x-1/2"
    };
    
    return positionClasses[position] || positionClasses.bottom;
  }, []);

  const getTextAlignmentClass = useCallback((textAlign = "center") => {
    const alignmentClasses = {
      left: "items-start text-left",
      right: "items-end text-right",
      center: "items-center text-center"
    };
    
    return alignmentClasses[textAlign] || alignmentClasses.center;
  }, []);

  if (!items || items.length === 0) {
    return (
      <div 
        className="h-[60vh] flex items-center justify-center bg-gray-200 text-gray-500"
        role="status"
        aria-label="No carousel items available"
      >
        No carousel items available.
      </div>
    );
  }

  const currentItem = items[currentIndex];

  return (
    <section 
      className="relative w-full h-[80vh] md:h-[70vh] sm:h-[60vh] xs:h-[55vh] overflow-hidden"
      aria-label="Image carousel"
      aria-roledescription="carousel"
      aria-live="polite"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
    >
      {/* Carousel Item */}
      <CarouselItem
        item={currentItem}
        imageLoaded={imageLoaded}
        onImageLoad={handleImageLoad}
        onImageError={handleImageError}
      />

      {/* Content Overlay */}
      <div
        className={`absolute text-white transition-all duration-500 px-4 sm:px-8 md:px-16 lg:px-16 ${getPositionClass(
          currentItem.position
        )} ${getTextAlignmentClass(currentItem.textAlign)}`}
        role="group"
        aria-label={`Slide ${currentIndex + 1} of ${items.length}`}
      >
        {/* Title */}
        <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-2 sm:mb-3 drop-shadow-lg">
          {currentItem.title}
        </h2>

        {/* Description */}
        {currentItem.description && (
          <p className="hidden sm:block max-w-xl mx-auto text-sm sm:text-base md:text-lg mb-4 sm:mb-6 drop-shadow-md leading-relaxed">
            {currentItem.description}
          </p>
        )}

        {/* CTA Button */}
        {currentItem.ctaText && (
          <button 
            className="bg-blue-600 hover:bg-blue-700 focus:bg-blue-700 text-white px-4 sm:px-6 md:px-8 py-2 sm:py-3 rounded-lg font-semibold transition text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2"
            onClick={currentItem.onCtaClick}
          >
            {currentItem.ctaText}
          </button>
        )}
      </div>

      {/* Navigation Controls */}
      {showControls && items.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-2 sm:left-5 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 focus:bg-black/60 p-2 sm:p-3 rounded-full text-white transition focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-2 sm:right-5 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 focus:bg-black/60 p-2 sm:p-3 rounded-full text-white transition focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </>
      )}

      {/* Progress Indicator */}
      {items.length > 1 && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
          {currentIndex + 1} / {items.length}
        </div>
      )}

      {/* Dots Indicator */}
      {showDots && items.length > 1 && (
        <div 
          className="absolute bottom-4 sm:bottom-6 w-full flex justify-center gap-1.5 sm:gap-2"
          role="tablist"
          aria-label="Slide indicators"
        >
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2.5 sm:w-3 h-2.5 sm:h-3 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 ${
                index === currentIndex ? "bg-white scale-110" : "bg-gray-400 hover:bg-gray-300"
              }`}
              role="tab"
              aria-label={`Go to slide ${index + 1}`}
              aria-selected={index === currentIndex}
              aria-controls={`carousel-item-${index}`}
            ></button>
          ))}
        </div>
      )}
    </section>
  );
};

export default memo(Carousel);