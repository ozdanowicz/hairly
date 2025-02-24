import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import ReviewListComponent from "../components/ReviewListing"; 
import { Link as NavLink } from "react-router-dom";
import { Salon } from "../apiService"; 
import ImageCarousel from "../components/ImageCarousel";
import RatingStars from "../components/RatingStars";
import { useTranslation } from 'react-i18next';


interface SalonCardProps {
  salon: Salon;
}

export const SalonCard: React.FC<SalonCardProps> = ({ salon }) => {
  const [showReviews, setShowReviews] = useState(false);
  const images = salon.salonImages ?? [];
  const {t} = useTranslation();

  console.log(salon);

  return (
    <>
      <Card className="w-full max-w-7xl mx-auto p-3 mb-6 bg-white rounded-xl shadow-lg border-none">
        <CardContent className="p-0">
          <div className="flex flex-col md:flex-row">
            {/* Salon Info */}
            <div className="w-full md:w-1/2 p-4 flex flex-col justify-between">
              <div>
                <NavLink to={`/salon/${salon.id}`}>
                  <h2 className="text-2xl font-bold text-red-600 mb-4">{salon.name ?? "No salon name yet"}</h2>
                </NavLink>
                <p className="text-gray-600 mb-4">{salon.description ?? "No description yet"}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm">
                  <span className="font-semibold">{t('location.title')}: </span> 
                  {`${salon.location?.street ?? t('location.noStreet')} ${salon.location?.buildingNumber ?? ''}, ${salon.location?.city ?? t('location.noCity')}`}
                </p>
                <p className="text-sm">
                  <span className="font-semibold">{t('salonInfo.priceRange')}: </span> 
                  {salon.priceRange && salon.priceRange.length > 0 
                    ? `${salon.priceRange[0]} - ${salon.priceRange[1]} zl`
                    : "-"}
                </p>
                <div className="flex items-center">
                  <span className="font-semibold text-sm mr-2">{t('salonInfo.rating')}:</span>
                  <RatingStars rating={salon.averageRating ?? 0} />
                  <span className="ml-2 text-sm text-gray-600">({salon.averageRating.toFixed(2) ?? t('salonInfo.noRating')})</span>
                </div>
                <button
                  onClick={() => setShowReviews(true)}
                  className="text-rose-700 hover:underline text-sm font-medium"
                >
                   {t('salonInfo.reviews')}
                </button>
              </div>
            </div>
            <div className="w-full md:w-1/2">
              <ImageCarousel images={images} />
            </div>
          </div>
        </CardContent>
      </Card>
      <AnimatePresence>
        {showReviews && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          >
            <div className="bg-white p-6 rounded-xl max-w-xl w-full relative">
              <button
                onClick={() => setShowReviews(false)}
                className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
              >
                {t('button.close')}
              </button>
              <ReviewListComponent salonId={salon.id} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SalonCard;
