import React from 'react';
import Hero from "../components/Hero";
import ViewAllOfferts from "../components/ViewAllOfferts";
import SalonOwnerInfo from "../components/SalonOwnerInfo";

import About from "../components/About";
import SalonList from '@/components/SalonList';

const HomePage: React.FC = () => {
  return (
    <>
      <Hero />
      <About />
      {/* <SalonOwnerInfo/> */}
      <SalonList isHome={true} />
      <ViewAllOfferts />
    </>
  );
}

export default HomePage;