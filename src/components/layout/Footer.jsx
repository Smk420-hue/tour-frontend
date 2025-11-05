// src/components/layout/Footer.jsx
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaYoutube } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useState } from "react";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    
    setIsLoading(true);
    
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 5000);
    } catch (error) {
      console.error('Subscription failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const quickLinks = [
    { name: "Home", path: "/" },
    { name: "Tours", path: "/tours" },
    { name: "customize tour", path: "/customize-tour" },
    { name: "About Us", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  const socialLinks = [
    { Icon: FaFacebookF, href: "https://facebook.com", label: "Facebook", color: "hover:text-blue-500" },
    { Icon: FaInstagram, href: "https://instagram.com", label: "Instagram", color: "hover:text-pink-500" },
    { Icon: FaTwitter, href: "https://twitter.com", label: "Twitter", color: "hover:text-blue-400" },
    { Icon: FaLinkedinIn, href: "https://linkedin.com", label: "LinkedIn", color: "hover:text-blue-600" },
    { Icon: FaYoutube, href: "https://youtube.com", label: "YouTube", color: "hover:text-red-500" },
  ];

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 relative overflow-hidden">
      {/* Background Pattern */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12">
          
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-teal-400 to-blue-500 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold text-lg">N</span>
              </div>
              <h3 className="text-2xl font-bold text-white">NikhilTours&travels</h3>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              Discover extraordinary journeys with NikhilTours&travels. We craft unforgettable travel experiences with carefully curated tours, expert guides, and seamless service.
            </p>
            <div className="flex items-center text-sm text-gray-400">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
              <span>24/7 Customer Support</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-6 relative inline-block">
              Quick Links
              <span className="absolute bottom-0 left-0 w-1/2 h-0.5 bg-teal-400"></span>
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-teal-400 transition-all duration-300 flex items-center group text-sm"
                  >
                    <span className="w-1 h-1 bg-gray-600 rounded-full mr-3 group-hover:bg-teal-400 transition-colors"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-6 relative inline-block">
              Contact
              <span className="absolute bottom-0 left-0 w-1/2 h-0.5 bg-orange-400"></span>
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start">
                <span className="text-teal-400 mr-3">📧</span>
                <span>hello@NikhilTours&travels.com</span>
              </div>
              <div className="flex items-start">
                <span className="text-teal-400 mr-3">📞</span>
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-start">
                <span className="text-teal-400 mr-3">📍</span>
                <span>123 Travel Street<br />Adventure City, AC 12345</span>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-6 relative inline-block">
              Newsletter
              <span className="absolute bottom-0 left-0 w-1/2 h-0.5 bg-purple-400"></span>
            </h3>
            <p className="text-gray-400 text-sm mb-4">
              Get travel inspiration, exclusive deals, and expert tips delivered to your inbox.
            </p>
            
            <form onSubmit={handleSubscribe} className="space-y-3">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              <button
                type="submit"
                disabled={isLoading || subscribed}
                className="w-full bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Subscribing...
                  </>
                ) : subscribed ? (
                  "✅ Subscribed!"
                ) : (
                  "Subscribe Now"
                )}
              </button>
            </form>

            {subscribed && (
              <p className="text-green-400 text-sm mt-3 animate-fade-in">
                🎉 Welcome to the NikhilTours&travels family! Check your email for a welcome gift.
              </p>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
            
            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map(({ Icon, href, label, color }, index) => (
                <a
                  key={index}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-gray-400 ${color} transition-all duration-300 transform hover:scale-110 p-2 bg-gray-800 rounded-lg hover:bg-gray-700`}
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>

            {/* Copyright */}
            <div className="text-center lg:text-right">
              <p className="text-gray-500 text-sm">
                © {currentYear} <span className="text-teal-400 font-semibold">NikhilTours&travels</span>. 
                All rights reserved. | 
                <a href="/privacy" className="hover:text-teal-400 ml-2 transition-colors">Privacy Policy</a> • 
                <a href="/terms" className="hover:text-teal-400 ml-2 transition-colors">Terms of Service</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
