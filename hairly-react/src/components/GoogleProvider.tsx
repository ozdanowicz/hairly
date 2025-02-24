import React from 'react';
import { LoadScript, Library, AdvancedMarkerElement } from '@react-google-maps/api';

const libraries: Library[] = ["places"]; 

const GoogleMapsLoader: React.FC = ({ children }) => {
  return (
    <LoadScript googleMapsApiKey="AIzaSyCxis-LH5lNs4Zk64rl7jmfslq93djr634" libraries={libraries}>
      {children}
    </LoadScript>
  );
};

export default GoogleMapsLoader;