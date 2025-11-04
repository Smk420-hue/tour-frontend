// src/components/review/ReviewForm.jsx
import { useState } from "react";

const ReviewForm = ({ onSubmit }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (comment.trim()) {
      onSubmit({ rating, comment });
      setRating(5);
      setComment("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow rounded p-4 mb-4">
      <h4 className="font-semibold mb-2 text-gray-800">Leave a Review</h4>
      <div className="mb-2">
        <label className="block text-gray-700 mb-1">Rating</label>
        <select
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="border rounded px-2 py-1 w-full"
        >
          {[5, 4, 3, 2, 1].map((r) => (
            <option key={r} value={r}>
              {r} ★
            </option>
          ))}
        </select>
      </div>
      <div className="mb-2">
        <label className="block text-gray-700 mb-1">Comment</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="border rounded px-2 py-1 w-full"
          rows={3}
          placeholder="Write your review..."
        ></textarea>
      </div>
      <button
        type="submit"
        className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-400 transition-colors duration-300"
      >
        Submit Review
      </button>
    </form>
  );
};

export default ReviewForm;
