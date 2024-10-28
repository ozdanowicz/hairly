import React from "react"
import { useState } from 'react';
import Pagination from "../components/Pagination"
import SalonList from "../components/SalonList"
import SearchBar from "../components/SearchBar"

const SalonsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<{  
    city?: string; 
    location?: [number, number];
    popularity?: string; 
    reviews?: string; 
    date?: string | number; 
    salonName?: string  
  }>({});
  

  const handleSearch = (query: { 
    city?: string; 
    location?: [number, number];
    popularity?: string; 
    reviews?: string; 
    date?: string; 
    salonName?: string 
  }) => {
    setSearchQuery(query); 
  };

  return (
    <section className="bg-rose-50 px-4 py-6">
      <SearchBar onSearch={handleSearch} />
      {/* Pass searchQuery to SalonList */}
      <SalonList isHome={false} searchQuery={searchQuery} />
      <Pagination />
    </section>
  );
};


export default SalonsPage;