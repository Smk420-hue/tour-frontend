import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] bg-gray-50 px-4 text-center">
      <h1 className="text-8xl font-bold text-gray-800 mb-4">404</h1>
      <h2 className="text-2xl md:text-3xl font-semibold text-gray-700 mb-2">
        Oops! Page Not Found
      </h2>
      <p className="text-gray-500 mb-8 max-w-md">
        The page you're looking for doesn't exist or has been moved.  
        Try returning to the homepage or exploring other tours!
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-6 py-3 text-white bg-blue-600 hover:bg-blue-700 rounded-full transition-all duration-300 shadow-md"
      >
        <FaArrowLeft className="text-lg" />
        Go Back Home
      </Link>
    </div>
  );
};

export default NotFound;
