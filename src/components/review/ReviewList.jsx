// src/components/review/ReviewList.jsx
import ReviewCard from "./ReviewCard";

const ReviewList = ({ reviews }) => {
  if (!reviews || reviews.length === 0)
    return <p className="text-gray-600">No reviews yet.</p>;

  return (
    <div className="space-y-2">
      {reviews.map((review) => (
        <ReviewCard key={review.id} review={review} />
      ))}
    </div>
  );
};

export default ReviewList;
