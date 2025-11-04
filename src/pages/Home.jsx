// src/pages/Home.js
import React, { useEffect, useState, useCallback, useMemo, Suspense } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import TourSearchBar from "../components/tours/TourSearchBar";
import TourCard from "../components/tours/TourCard";
import LoadingSpinner from "../components/common/LoadingSpinner";
import ErrorBoundary from "../components/common/ErrorBoundary";
import { useTours } from "../hooks/useTours";
import { getCarousels } from "../api/carouselApi";

const Carousel = React.lazy(() => import("../components/carousel/Carousel"));

// Constants
const TOUR_CATEGORIES = Object.freeze({
  SPECIAL: "Special",
});

const STATS_DATA = Object.freeze([
  { value: "10K+", label: "Happy Travelers" },
  { value: "50+", label: "Destinations" },
  { value: "15+", label: "Years Experience" },
  { value: "98%", label: "Satisfaction Rate" },
]);

// Animation variants
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      duration: 0.6,
    },
  },
};

const Home = () => {
  const { 
    tours = [],
    popularTours = [],
    fetchTours, 
    fetchPopularTours, 
    popularLoading,
    loading,
    error 
  } = useTours();
  
  const [carousels, setCarousels] = useState([]);
  const [carouselLoading, setCarouselLoading] = useState(true);
  const [homeError, setHomeError] = useState(null);

  const fetchData = useCallback(async () => {
    setHomeError(null);
    setCarouselLoading(true);
    
    try {
      // Fetch all data in parallel with timeout protection
      const [carouselData] = await Promise.all([
        getCarousels().catch(err => {
          console.warn("Failed to load carousels:", err);
          return [];
        }),
        fetchTours().catch(err => {
          console.warn("Failed to load tours:", err);
          return [];
        }),
        fetchPopularTours(4).catch(err => {
          console.warn("Failed to load popular tours:", err);
          return [];
        })
      ]);
      
      setCarousels(Array.isArray(carouselData) ? carouselData : carouselData?.carousels || []);
    } catch (err) {
      console.error("Error fetching home data:", err);
      setHomeError("Unable to load content. Please try again later.");
    } finally {
      setCarouselLoading(false);
    }
  }, [fetchTours, fetchPopularTours]);

  useEffect(() => {
    fetchData();
  }, []);

  // Memoized tour data with fallbacks
  const displayPopularTours = useMemo(() => {
    if (popularTours?.length > 0) {
      return popularTours;
    }
    // Fallback: show first 4 tours as popular if no specific popular tours
    return tours.slice(0, 4);
  }, [popularTours, tours]);

  const specialTours = useMemo(() => {
    return tours
      .filter((tour) => tour?.category === TOUR_CATEGORIES.SPECIAL)
      .slice(0, 4);
  }, [tours]);

  // Loading and error states
  const isLoading = (loading && carouselLoading) || (!tours.length && !error && !homeError);
  const displayError = error || homeError;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" message="Loading amazing tours..." />
      </div>
    );
  }

  if (displayError) {
    return (
      <ErrorBoundary
        message={displayError}
        onRetry={fetchData}
        className="min-h-screen flex items-center justify-center"
      />
    );
  }

  return (
    <main className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 text-gray-900">
      {/* Hero Carousel */}
      <section aria-label="Featured Destinations" className="relative shadow-xl">
        {carousels.length > 0 ? (
          <Suspense fallback={<CarouselFallback />}>
            <Carousel items={carousels}
             />
          </Suspense>
        ) : (
          <HeroFallback />
        )}
      </section>

      <SearchSection />

      {/* Popular Tours Section */}
      <AnimatedSection>
        <ToursSection
          title="Most Popular Tours"
          description="Join thousands of travelers who've experienced these amazing adventures."
          tours={displayPopularTours}
          loading={popularLoading && !displayPopularTours.length}
          theme="white"
          showViewAll={tours.length > 4}
        />
      </AnimatedSection>

      {/* Special Tours Section */}
      {specialTours.length > 0 && (
        <AnimatedSection delay={0.2}>
          <ToursSection
            title="Special & Limited Tours"
            description="Unique experiences with exclusive access and special pricing."
            tours={specialTours}
            theme="gradient"
            badge={{
              text: "Exclusive Offers",
              icon: (
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ),
            }}
          />
        </AnimatedSection>
      )}

      {/* Stats Section */}
      <AnimatedSection delay={0.3}>
        <StatsSection />
      </AnimatedSection>

      {/* CTA Section */}
      <AnimatedSection delay={0.4}>
        <CTASection />
      </AnimatedSection>
    </main>
  );
};

/* -------------------------------
 * SUBCOMPONENTS
 * ----------------------------- */

const AnimatedSection = ({ children, delay = 0, className = "" }) => (
  <motion.section
    initial="hidden"
    whileInView="show"
    viewport={{ once: true, amount: 0.1 }}
    variants={{
      hidden: { opacity: 0, y: 50 },
      show: { 
        opacity: 1, 
        y: 0, 
        transition: { 
          delay, 
          duration: 0.8, 
          ease: "easeOut" 
        } 
      },
    }}
    className={className}
  >
    {children}
  </motion.section>
);

const ToursSection = ({ 
  title, 
  description, 
  tours = [], 
  loading = false, 
  theme = "white", 
  showViewAll = false, 
  badge 
}) => {
  const themeClasses = {
    white: "bg-white",
    gradient: "bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50",
  };

  const hasTours = tours.length > 0;

  return (
    <section className={`py-16 md:py-20 relative overflow-hidden ${themeClasses[theme]}`}>
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-200 rounded-full blur-3xl opacity-10 translate-x-1/3 -translate-y-1/3"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-200 rounded-full blur-3xl opacity-10 -translate-x-1/3 translate-y-1/3"></div>
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-12"
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {badge && (
            <motion.div 
              className="inline-flex items-center px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold mb-4 shadow-sm"
              variants={fadeUp}
            >
              {badge.icon}
              {badge.text}
            </motion.div>
          )}
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-800">{title}</h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            {description}
          </p>
        </motion.div>

        {/* Tours Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <LoadingSpinner size="lg" message="Loading tours..." />
          </div>
        ) : (
          <>
            {hasTours ? (
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
                variants={staggerContainer}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.1 }}
              >
                {tours.map((tour) => (
                  <motion.div key={tour.id} variants={fadeUp}>
                    <TourCard tour={tour} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <EmptyState 
                title="No tours available"
                message="Check back soon for new adventures!"
                className="py-12"
              />
            )}

            {/* View All Button */}
            {showViewAll && hasTours && (
              <motion.div
                className="text-center"
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
              >
                <Link
                  to="/tours"
                  className="inline-flex items-center px-6 sm:px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  View All Tours
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </motion.div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

const SearchSection = () => (
  <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-16 md:py-20 relative overflow-hidden">
    <div className="absolute top-0 left-0 w-64 h-64 bg-blue-300 rounded-full blur-3xl opacity-20 -translate-x-1/3 -translate-y-1/3"></div>
    <div className="absolute bottom-0 right-0 w-80 h-80 bg-indigo-300 rounded-full blur-3xl opacity-20 translate-x-1/3 translate-y-1/3"></div>
    
    <div className="container mx-auto px-4 sm:px-6 text-center relative z-10">
      <motion.h2
        className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-gray-800"
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
      >
        Discover Your Perfect Adventure
      </motion.h2>
      <motion.p
        className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed"
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
      >
        Explore breathtaking destinations and create unforgettable memories with our curated tours.
      </motion.p>
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
        className="max-w-2xl mx-auto"
      >
        <TourSearchBar />
      </motion.div>
    </div>
  </section>
);

const StatsSection = () => (
  <section className="py-16 bg-white border-t border-gray-200">
    <div className="container mx-auto px-4 sm:px-6">
      <motion.div
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 text-center"
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
      >
        {STATS_DATA.map((stat, index) => (
          <motion.div 
            key={index} 
            className="p-4 sm:p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl sm:rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 hover:translate-y-[-2px]"
            variants={fadeUp}
          >
            <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-2">{stat.value}</div>
            <div className="text-sm sm:text-base text-gray-600 font-medium">{stat.label}</div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
);

const CTASection = () => (
  <section className="relative py-16 md:py-20 bg-gradient-to-r from-blue-600 to-indigo-700 text-white overflow-hidden">
    <div className="absolute top-0 left-0 w-full h-full bg-black/10"></div>
    <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3"></div>
    
    <motion.div
      className="relative container mx-auto px-4 sm:px-6 text-center"
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
    >
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 drop-shadow-lg">
        Ready for Your Next Adventure?
      </h2>
      <p className="text-lg sm:text-xl mb-8 max-w-2xl mx-auto opacity-90 leading-relaxed">
        Join thousands of travelers who trust us to create their perfect vacation memories.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          to="/tours"
          className="inline-flex justify-center items-center bg-white text-blue-600 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600"
        >
          Explore All Tours
        </Link>
        <Link
          to="/contact"
          className="inline-flex justify-center items-center border-2 border-white text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600"
        >
          Contact Us
        </Link>
      </div>
    </motion.div>
  </section>
);

// Fallback components
const CarouselFallback = () => (
  <div className="h-[60vh] bg-gradient-to-r from-blue-400 to-indigo-500 flex items-center justify-center">
    <LoadingSpinner message="Loading featured destinations..." />
  </div>
);

const HeroFallback = () => (
  <div className="h-[60vh] bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white">
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-4">Discover Amazing Tours</h1>
      <p className="text-xl opacity-90">Your adventure starts here</p>
    </div>
  </div>
);

const EmptyState = ({ title, message, className = "" }) => (
  <div className={`text-center py-12 ${className}`}>
    <div className="max-w-sm mx-auto">
      <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
      <h3 className="text-lg font-semibold text-gray-600 mb-2">{title}</h3>
      <p className="text-gray-500">{message}</p>
    </div>
  </div>
);

export default Home;