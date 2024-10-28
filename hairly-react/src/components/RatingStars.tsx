import { Star } from "lucide-react";

interface RatingStarsProps {
  rating: number; 
}

export const RatingStars: React.FC<RatingStarsProps> = ({ rating }) => {
  const renderStars = () => {
    return Array.from({ length: 5 }, (_, i) => {
      if (rating >= i + 1) {
        return <Star key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" />;
      } else if (rating > i && rating < i + 1) {
        return (
          <div key={i} className="relative w-4 h-4">
            <Star className="absolute top-0 left-0 w-4 h-4 text-gray-300" fill="none" />
            <Star
              className="absolute top-0 left-0 w-4 h-4 text-yellow-400"
              fill="currentColor"
              style={{ clipPath: 'inset(0 50% 0 0)' }}
            />
          </div>
        );
      } else {
        return <Star key={i} className="w-4 h-4 text-gray-300" fill="none" />;
      }
    });
  };
  return <div className="flex items-center">{renderStars()}</div>;
};

export default RatingStars;
