// src/components/review/ReviewCard.jsx
const ReviewCard = ({ review }) => {
  return (
    <div className="bg-white shadow rounded p-4 mb-3">
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-semibold text-gray-800">{review.userName}</h4>
        <span className="text-yellow-500 font-bold">{review.rating} ★</span>
      </div>
      <p className="text-gray-700">{review.comment}</p>
      <p className="text-gray-400 text-sm mt-1">{new Date(review.createdAt).toLocaleDateString()}</p>
    </div>
  );
};

export default ReviewCard;
