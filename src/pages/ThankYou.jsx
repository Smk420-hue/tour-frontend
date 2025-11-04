// src/pages/ThankYou.jsx
import { Link } from "react-router-dom";

const ThankYou = () => {
  return (
    <div className="h-screen flex flex-col justify-center items-center bg-green-50 text-center p-6">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-lg">
        <h1 className="text-3xl font-bold text-green-700 mb-4">
          Successfully Submitted!
        </h1>
        <p className="text-gray-700 mb-6">
          Our representative will contact you soon.
        </p>
        <Link
          to="/"
          className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default ThankYou;
