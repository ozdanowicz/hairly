import React, { useState, useEffect } from 'react';
import { fetchReviews, Review } from '../reviewService.ts';
import { useTranslation } from 'react-i18next';

interface ReviewListProps {
  salonId: number;
}

const ReviewList: React.FC<ReviewListProps> = ({ salonId }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    const loadReviews = async () => {
      try {
        const reviewsData = await fetchReviews(salonId);
        setReviews(reviewsData);
      } catch (err) {
        setError('Failed to load reviews');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadReviews();
  }, [salonId]);

  if (loading) {
    return <p>{t('review.loading')}</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h2 className="text-2xl font-bold mb-4">{t('review.customer')}</h2>
      {reviews.length === 0 ? (
        <p className="text-center text-gray-500">{t('review.noReviews')}</p>
      ) : (
        reviews.map((review) => (
          <div key={review.id} className="p-4 mb-4 border rounded-lg shadow-sm">
            <div className="flex items-center">
              <span className="text-yellow-500">{'★'.repeat(review.rating)}</span>
              <span className="ml-2 text-sm text-gray-600">{review.createdAt.slice(0,10)}</span>
            </div>
            <p className="mt-2 text-gray-800">{review.comment}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default ReviewList;
