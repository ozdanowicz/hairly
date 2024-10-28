import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

interface Review {
    id: number;
    rating: number;
    comment: string;
    createdAt: string;
  }

const ReviewCard: React.FC<{ review: Review }> = ({ review }) => {
    return (
      <Card className="mb-4">
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-500">
              {review.createdAt.slice(0, 10)}
            </span>
          </div>
          <p className="text-gray-700">{review.comment}</p>
        </CardContent>
      </Card>
    );
  };
  export default ReviewCard;