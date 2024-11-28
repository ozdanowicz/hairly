import { Card, CardContent } from "@/components/ui/card";
import { Link as NavLink } from "react-router-dom";
import { Salon} from "../apiService"; // Import Salon from the service layer
import ImageCarousel from "../components/ImageCarousel";
import RatingStars from "../components/RatingStars";

interface CardProps {
  salon: Salon;
}
export const SalonHomeCard: React.FC<CardProps> = ({ salon }) => {
  const images = salon.salonImages ?? [];
  console.log(images);
    return (
      <>
        <Card className="w-full max-w-7xl mx-auto p-3 mb-6 bg-white rounded-xl shadow-lg border-none">
          <CardContent className="p-0">
            <div className="flex flex-col md:flex-row">
              <div className="w-full flex flex-col justify-between">
              <div className="w-full mb-4">
                <ImageCarousel images={salon.salonImages} />
              </div>
                <div>
                  <NavLink to={`/salon/${salon.id}`}>
                    <h2 className="text-1.5xl font-bold text-red-600 mb-4">{salon.name}</h2>
                  </NavLink>
                </div>
                <div className="space-y-2">
                <p className="text-sm">
                  <span className="font-semibold">Location:</span>{" "}
                  {salon.location
                    ? `${salon.location.city || ""}`
                    : "Location not available"}
                </p>
                  <p className="text-sm">
                    <span className="font-semibold">Price Range:</span> {salon.priceRange[0]} - {salon.priceRange[1]} zl
                  </p>
                  <div className="flex items-center">
                    <span className="font-semibold text-sm mr-2">Rating:</span>
                    <RatingStars rating={salon.averageRating ?? 0} />
                    <span className="ml-2 text-sm text-gray-600">({salon.averageRating ?? "No rating"})</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
       
      </>
    );
  };
export default SalonHomeCard;
