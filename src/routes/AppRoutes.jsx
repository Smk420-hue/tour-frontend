// src/AppRoutes.jsx
import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import LoadingSpinner from "../components/common/LoadingSpinner";
import Layout from "../components/layout/Layout";

// Lazy load pages
const Home = lazy(() => import("../pages/Home"));
const TourListing = lazy(() => import("../pages/TourListing"));
const TourDetails = lazy(() => import("../pages/TourDetails"));
const Booking = lazy(() => import("../components/booking/BookingPage"));
const Profile = lazy(() => import("../pages/Profile"));
const Login = lazy(() => import("../pages/Login"));
const Register = lazy(() => import("../pages/Register"));
const MyBookings = lazy(() => import("../pages/MyBookings"));
const NotFound = lazy(() => import("../pages/NotFound"));
const AboutUs = lazy(() => import("../pages/Aboutus"));
const ContactUs = lazy(() => import("../pages/Contactus"));
const AdminDashboard = lazy(() => import("../pages/admin/AdminDashboard"));
const Customizetour = lazy(() => import("../pages/CustomTour"));
const ThankYou = lazy(() => import("../pages/ThankYou"));
const DealPage = lazy(() => import("../pages/DealPage"));
// const DealDetails = lazy(() => import("../pages/DealDetails"));
const BookingSuccess = lazy(() => import("../pages/BookingSuccess"));


const AppRoutes = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        {/* Routes with Layout */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/tours" element={<TourListing />} />
          <Route path="/tours/search" element={<TourListing />} />
          <Route path="/tours/category/:category" element={<TourListing />} />
          <Route path="/tours/state/:state" element={<TourListing />} />
          <Route path="/tours/city/:city" element={<TourListing />} />
          <Route path="/tours/country/:country" element={<TourListing />} />
          <Route path="/tours/price/:min-:max" element={<TourListing />} />
          <Route path="/tours/duration/:min-:max" element={<TourListing />} />
          <Route path="/tours/difficulty/:level" element={<TourListing />} />
          <Route path="/tours/amenities/:amenities" element={<TourListing />} />
          <Route path="/tours/guide/:guideId" element={<TourListing />} />
          <Route path="/tours/featured" element={<TourListing />} />
          <Route path="/tours/new" element={<TourListing />} />
          <Route path="/tours/:id" element={<TourDetails />} />
          <Route path="/aboutus" element={<AboutUs />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/customize-tour" element={<Customizetour />} />
          <Route path="/thankyou" element={<ThankYou />} />
          <Route path="/deals" element={<DealPage />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/booking-success" element={<BookingSuccess />} />

          <Route
            path="/booking/:tourId"
            element={
              <PrivateRoute>
                <Booking />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route
            path="/my-bookings"
            element={
              <PrivateRoute>
                <MyBookings />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <PrivateRoute adminOnly={true}>
                <AdminDashboard />
              </PrivateRoute>
            }
          />
        </Route>

        {/* Routes without Layout */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;