// src/components/layout/Footer.jsx
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { useState } from "react";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
    setEmail("");
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <footer className="bg-gray-900 text-gray-300 py-14">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
          {/* About */}
          <div>
            <h3 className="text-2xl font-bold mb-4 text-teal-400 tracking-wide">Travel Co.</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Explore the world with confidence. We offer handpicked tours, seamless booking, and unforgettable memories — one destination at a time.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-white">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { name: "Home", link: "/" },
                { name: "Tours", link: "/tours" },
                { name: "Booking", link: "/booking" },
                { name: "Profile", link: "/profile" },
                { name: "Contact", link: "/contact" },
              ].map((item, i) => (
                <li key={i}>
                  <a
                    href={item.link}
                    className="hover:text-orange-400 transition-all duration-300 inline-block hover:translate-x-1"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="md:col-span-2">
            <h3 className="text-xl font-semibold mb-4 text-white">Stay in the Loop</h3>
            <p className="text-gray-400 mb-5 text-sm">
              Join our travel family! Get exclusive offers, destination inspiration, and insider travel tips in your inbox.
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-400"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button
                type="submit"
                className="px-6 py-3 bg-orange-500 hover:bg-orange-400 rounded-md text-white font-semibold transition-all duration-300 shadow-md hover:shadow-orange-400/30"
              >
                Subscribe
              </button>
            </form>
            {submitted && (
              <p className="text-teal-400 mt-3 text-sm animate-fade-in">
                🎉 Subscribed successfully!
              </p>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 my-10"></div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Social Media Icons */}
          <div className="flex space-x-5 mb-4 md:mb-0">
            {[
              { Icon: FaFacebookF, link: "#", label: "Facebook" },
              { Icon: FaTwitter, link: "#", label: "Twitter" },
              { Icon: FaInstagram, link: "#", label: "Instagram" },
              { Icon: FaLinkedinIn, link: "#", label: "LinkedIn" },
            ].map(({ Icon, link, label }, i) => (
              <a
                key={i}
                href={link}
                aria-label={label}
                className="text-gray-400 hover:text-teal-400 transition-all duration-300 hover:scale-110"
              >
                <Icon size={18} />
              </a>
            ))}
          </div>

          {/* Copyright */}
          <p className="text-gray-500 text-sm text-center md:text-right">
            © {new Date().getFullYear()}{" "}
            <span className="text-teal-400 font-semibold">Travel Co.</span> — All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
