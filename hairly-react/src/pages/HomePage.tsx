import React from 'react';
import Hero from "../components/Hero";
import OffertListing from "../components/OffertListing";
import ViewAllOfferts from "../components/ViewAllOfferts";
import SalonOwnerInfo from "../components/SalonOwnerInfo";

import About from "../components/About";

const HomePage: React.FC = () => {
  return (
    <>
      <Hero />
      <About />
      <SalonOwnerInfo/>
      <OffertListing isHome={true} />
      <ViewAllOfferts />
    </>
  );
}

export default HomePage;