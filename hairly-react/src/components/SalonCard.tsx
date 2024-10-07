import { useState } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { ReviewList } from "./ReviewListing"; 
import {Link as NavLink}  from "react-router-dom"

interface Salon {
  name: string;
  images: string[];
  description: string;
  services: string[];
  address: string;
  priceRange: [string, string];
  rating: number;
  reviewsCount: number;
}

interface SalonCardProps {
  salon: Salon;
}

export const SalonCard3: React.FC<SalonCardProps> = ({ salon }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [showReviews, setShowReviews] = useState(false);

  const nextImage = () => {
    setDirection(1);
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % salon.images.length);
  };

  const prevImage = () => {
    setDirection(-1);
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + salon.images.length) % salon.images.length);
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? "100%" : "-100%",
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? "100%" : "-100%",
      opacity: 0,
    }),
  };

  // Helper function to render star ratings
  const renderStars = (rating: number) => {
    const stars: JSX.Element[] = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`w-4 h-4 ${rating >= i + 1 ? "text-yellow-400" : "text-gray-300"}`}
          fill={rating >= i + 1 ? "currentColor" : "none"}
        />
      );
    }
    return stars;
  };

  return (
    <>
      <Card className="w-full max-w-7xl mx-auto p-3 bg-white rounded-xl shadow-lg border-none">
        <CardContent className="p-0">
          <div className="flex flex-col md:flex-row">
            <div className="w-full md:w-1/2 p-4 flex flex-col justify-between">
              <div>
                <NavLink to="/salon/{id}">
                  <h2 className="text-2xl font-bold text-red-600 mb-4">{salon.name}</h2>
                </NavLink>
                <p className="text-gray-600 mb-4">{salon.description}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm">
                  <span className="font-semibold">Location:</span> {salon.address}
                </p>
                <p className="text-sm">
                  <span className="font-semibold">Price Range:</span> {salon.priceRange[0]} - {salon.priceRange[1]} zl
                </p>
                <div className="flex items-center">
                  <span className="font-semibold text-sm mr-2">Rating:</span>
                  {renderStars(salon.rating)}
                  <span className="ml-2 text-sm text-gray-600">({salon.rating})</span>
                </div>
                {/* Reviews Button */}
                <button
                  onClick={() => setShowReviews(true)}
                  className="text-blue-600 hover:underline text-sm font-medium"
                >
                  {salon.reviewsCount} Reviews
                </button>
              </div>
            </div>

            <div className="w-full md:w-1/2 relative h-[300px] md:h-[400px] overflow-hidden">
              <AnimatePresence initial={false} custom={direction}>
                <motion.img
                  key={currentImageIndex}
                  src={salon.images[currentImageIndex]}
                  alt={`Salon image ${currentImageIndex + 1}`}
                  className="absolute w-full h-full object-cover"
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 },
                  }}
                />
              </AnimatePresence>
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-colors z-10"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-colors z-10"
                aria-label="Next image"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
                {salon.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setDirection(index > currentImageIndex ? 1 : -1);
                      setCurrentImageIndex(index);
                    }}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index === currentImageIndex ? "bg-white" : "bg-gray-400"
                    }`}
                    aria-label={`Go to image ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Review Modal */}
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
                Close
              </button>
              <ReviewList />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
