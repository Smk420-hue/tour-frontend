import React from "react";

const AboutUs = () => {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header Section */}
      <section className="text-center mb-12">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
          About Nikhil Travels
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Your trusted travel partner for unforgettable journeys.  
          At Nikhil Travels, we believe every trip should be an experience, not just a destination.
        </p>
      </section>

      {/* Mission & Vision */}
      <section className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="bg-white shadow-md rounded-2xl p-6 border-l-4 border-indigo-500">
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">Our Mission</h2>
          <p className="text-gray-600 leading-relaxed">
            To provide exceptional travel services that create lasting memories.  
            We aim to deliver safe, affordable, and personalized journeys for every traveler.
          </p>
        </div>
        <div className="bg-white shadow-md rounded-2xl p-6 border-l-4 border-purple-500">
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">Our Vision</h2>
          <p className="text-gray-600 leading-relaxed">
            To be the most trusted travel agency, recognized for excellence, innovation, and commitment  
            in curating unique travel experiences across the world.
          </p>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-8">
          Why Choose Nikhil Travels?
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-xl shadow-md text-center border border-indigo-100">
            <h3 className="text-xl font-semibold mb-3 text-indigo-700">Expert Guidance</h3>
            <p className="text-gray-600">With years of experience, our team ensures you get the best itineraries and travel deals.</p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-6 rounded-xl shadow-md text-center border border-purple-100">
            <h3 className="text-xl font-semibold mb-3 text-purple-700">Personalized Trips</h3>
            <p className="text-gray-600">We design journeys tailored to your needs, whether it's leisure, adventure, or business travel.</p>
          </div>
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-xl shadow-md text-center border border-indigo-100">
            <h3 className="text-xl font-semibold mb-3 text-indigo-700">24/7 Support</h3>
            <p className="text-gray-600">Travel worry-free with our dedicated support team available anytime, anywhere.</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center bg-gradient-to-r from-indigo-50 to-purple-50 p-8 rounded-2xl shadow-md border border-indigo-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-3">Let's Plan Your Next Adventure</h2>
        <p className="text-gray-600 mb-5">Reach out to us today and start your journey with Nikhil Travels.</p>
        <a
          href="/contact"
          className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105"
        >
          Contact Us
        </a>
      </section>
    </main>
  );
};

export default AboutUs;
