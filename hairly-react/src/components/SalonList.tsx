import { SalonCard3 } from './SalonCard';


const sampleSalon = {
  name: 'Modern Cuts',
  images: [
    'https://via.placeholder.com/300x200', 
    'https://via.placeholder.com/300x200',
    'https://via.placeholder.com/300x200',
  ],
  description: 'A modern salon providing top-notch services for all your haircare needs.',
  services: ['Haircut', 'Coloring', 'Styling'],
  address: 'Bialystok, Pogodna 4a',
  priceRange: ['10', '200'] as [string, string],
  rating: 4.5,
  reviewsCount: 10,
};

const SalonList = () => {
  return (
    <div className="container mx-auto py-8">
      <SalonCard3 salon={sampleSalon} />
    </div>
  );
};

export default SalonList;