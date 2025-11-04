// src/components/tour/TourSearchBar.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const TourSearchBar = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/tours/search?q=${query}`);
      setQuery("");
    }
  };

  return (
    <form
      onSubmit={handleSearch}
      className="flex items-center space-x-2 mb-4"
    >
      <input
        type="text"
        placeholder="Search tours..."
        className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button
        type="submit"
        className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-400 transition-colors duration-300"
      >
        Search
      </button>
    </form>
  );
};

export default TourSearchBar;
