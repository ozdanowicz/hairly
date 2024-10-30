import React, { useEffect, useState } from 'react';
import { SalonCard } from './SalonCard';
import { SalonHomeCard } from '../components/SalonHomeCard';
import { fetchSalons, fetchSalonsByCriteria, fetchSalonDetails, Salon } from '../apiService'; // Ensure all imports are correct

interface SalonListProps {
  isHome?: boolean;
  searchQuery?: {
    city?: string;
    location?: [number, number];
    popularity?: string;
    reviews?: string;
    date?: string;
    salonName?: string;
  };
}

const SalonList: React.FC<SalonListProps> = ({ isHome = false, searchQuery }) => {
  const [salons, setSalons] = useState<Salon[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchResults, setSearchResults] = useState<Salon[]>([]); // Initialize as empty array

  // Fetch initial list of salons
  useEffect(() => {
    const loadSalons = async () => {
      try {
        const data = await fetchSalons();
        setSalons(data.slice(0, 6));
      } catch (err) {
        setError('Failed to load salons');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadSalons();
  }, []);

  // Search for salons based on criteria
  useEffect(() => {
    const searchSalons = async () => {
      if (!searchQuery) return;

      try {
        const results = await fetchSalonsByCriteria(searchQuery);
        console.log('Search results:', results);

        // Fetch detailed info for each salon
        const detailedSalons = await Promise.all(
          results.map((salon: Salon) => fetchSalonDetails(salon.id)) // Ensure correct type here
        );

        setSearchResults(detailedSalons);
      } catch (err) {
        console.error('Failed to load search results', err);
        setError('Failed to load search results');
      }
    };

    searchSalons();
  }, [searchQuery]);

  // Loading state
  if (loading) {
    return <div>Loading salons...</div>;
  }

  // Error handling
  if (error) {
    return <div>Error: {error}</div>;
  }

  // Determine which salons to display
  const salonsToDisplay = isHome ? salons.slice(0, 3) : (searchResults.length > 0 ? searchResults : salons);

  return (
    <div className={`container mx-auto py-8 ${isHome ? 'grid grid-cols-1 md:grid-cols-3 gap-4' : ''}`}>
      {salonsToDisplay.map((salon) => ( // Map over salonsToDisplay
        isHome ? (
          <SalonHomeCard key={salon.id} salon={salon} /> 
        ) : (
          <SalonCard key={salon.id} salon={salon} />
        )
      ))}
    </div>
  );
};

export default SalonList;
