import React from "react";
import ReviewCard from "./ReviewCard"

interface Review {
  id: number;
  rating: number;
  comment: string;
  createdAt: string;
}

const ReviewListComponent: React.FC<{ reviews: Review[] }> = ({ reviews }) => {
  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h2 className="text-2xl font-bold mb-4">Customer Reviews</h2>
      {reviews.length === 0 ? (
        <p className="text-center text-gray-500">No reviews yet.</p>
      ) : (
        reviews.map((review) => <ReviewCard key={review.id} review={review} />)
      )}
    </div>
  );
};
export function ReviewList() {
  const sampleReviews: Review[] = [
    {
      id: 1,
      rating: 4,
      comment: "Great product! It exceeded my expectations.",
      createdAt: "2023-06-15T10:30:00Z",
    },
    {
      id: 2,
      rating: 5,
      comment: "Absolutely love it. Would definitely recommend to others.",
      createdAt: "2023-06-14T15:45:00Z",
    },
    {
      id: 3,
      rating: 3,
      comment: "It's okay. Does the job but could be better.",
      createdAt: "2023-06-13T09:20:00Z",
    },
  ];

  return <ReviewListComponent reviews={sampleReviews} />;
}

export default ReviewListComponent;
