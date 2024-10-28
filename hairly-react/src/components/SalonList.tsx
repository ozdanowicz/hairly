import React, { useEffect, useState } from 'react';
import { SalonCard } from './SalonCard';
import { SalonHomeCard } from '../components/SalonHomeCard';
import { fetchSalons, Salon } from '../apiService';
import {fetchSalonsByCriteria  } from '../apiService';

interface SalonListProps {
  isHome?: boolean;
  salons: Salon[];
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
  const [searchResults, setSearchResults] = useState<Salon[] | null>(null);

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

  useEffect(() => {
    const searchSalons = async () => {
      if (!searchQuery) return; 
  
      try {
        const results = await fetchSalonsByCriteria(searchQuery);
        console.log('Search results:', results); 
        setSearchResults(results); 
      } catch (err) {
        console.error('Failed to load search results', err);
        setError('Failed to load search results');
      }
    };
  
    searchSalons();
  }, [searchQuery]);

  if (loading) {
    return <div>Loading salons...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const salonsToDisplay = Array.isArray(isHome ? salons.slice(0, 3) : searchResults || salons) 
  ? (isHome ? salons.slice(0, 3) : searchResults || salons) 
  : [];


  return (
    <div className={`container mx-auto py-8 ${isHome ? 'grid grid-cols-1 md:grid-cols-3 gap-4' : ''}`}>
      {salonsToDisplay.map((salon) =>
        isHome ? <SalonHomeCard key={salon.id} salon={salon} /> : <SalonCard key={salon.id} salon={salon} />
      )}
    </div>
  );
};

export default SalonList;