import { useState, useEffect } from 'react';
import { Scissors, MapPin, Calendar, Search } from 'lucide-react';
import { Button } from "./ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { GoogleMap } from "@react-google-maps/api";
import {useTranslation} from 'react-i18next';
import { Dialog } from "@/components/ui/dialog";
import { MarkerClusterer } from "@googlemaps/markerclusterer";

import {fetchLocations, Location, PaginatedResponse, fetchSalonsByLocation, Salon} from '@/apiService';

interface SearchBarProps {
  onSearch: (query: {
    city?: string;
    location?: [number, number];
    popularity?: string;
    reviews?: string;
    date?: string | number;  
    salonName?: string;
  }) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [salonName, setSalonName] = useState('');
  const [city, setCity] = useState('');
  const [date, setDate] = useState<Date | null>(null);
  const [sortFilter, setSortFilter] = useState<string>('');
  const { t } = useTranslation();
  const [showMapDialog, setShowMapDialog] = useState(false); 
  const [locations, setLocations] = useState<Location[]>([]);
  const [chosenLocation, setChosenLocation] = useState<Location | null>(null);
  const [selectedSalons, setSelectedSalons] = useState<Salon[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [mapCenter, setMapCenter] = useState({lat: 0, lng: 0});
  const cluster = new MarkerClusterer({
    markers: locations.map(location => new google.maps.Marker({
      position: { lat: location.latitude, lng: location.longitude },
      title: location.street,
    })),
  });


  useEffect(() => {
    const loadLocations = async () => {
      try {
        const response: PaginatedResponse<Location> = await fetchLocations(page);
        setLocations(response.content);
        setTotalPages(response.totalPages);
        if(locations.length > 0) {
          let sumLat = 0;
          let sumLng = 0;
          locations.forEach(location => {
            sumLat += location.latitude!;
            sumLng += location.longitude!;
          });
          setMapCenter({lat: sumLat / locations.length, lng: sumLng / locations.length});
        }
        console.log(locations);
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    };

    if(chosenLocation) {
      fetchSalonsByLocation(chosenLocation.id).then(setSelectedSalons).catch(error => {
        console.error("Error fetching salons:", error);
      });
    }

    loadLocations();
  }, [page]);

  const handleSearch = () => {
    const searchQuery = {
      salonName: salonName || undefined,
      city: city || undefined,
      date: date ? date.toISOString() : undefined,
      popularity: sortFilter.includes('popularity') ? (sortFilter.includes('highest') ? 'highest' : 'lowest') : undefined,
      reviews: sortFilter.includes('rating') ? (sortFilter.includes('highest') ? 'highest' : 'lowest') : undefined,
    };
  
    onSearch(searchQuery); 
  };
  const handleShowMap = () => {
    setShowMapDialog(true);
  };

  const handleCloseMapDialog = () => {
    setShowMapDialog(false);
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 bg-white rounded-xl shadow-lg">
      <div className="flex flex-wrap items-center gap-2 sm:flex-nowrap">
        <div className="relative flex-grow min-w-[200px] w-full sm:w-[300px] rounded-xl">
          <Scissors className="absolute left-3 top-1/2 transform -translate-y-1/2 text-red-500" size={18} />
          <Input
            type="text"
            placeholder={t('salonInfo.salonName')}
            className="pl-10 border-gray-300 focus:border-gray-500 focus:ring focus:ring-gray-300 rounded-xl"
            value={salonName}
            onChange={(e) => setSalonName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearch(); 
              }
            }}
          />
        </div>

        <div className="relative flex-grow min-w-[200px] w-full sm:w-[200px] rounded-xl">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-red-500" size={18} />
          <Input
            type="text"
            placeholder={t('location.city')}
            className="pl-10 border-gray-300 focus:border-gray-500 focus:ring focus:ring-gray-300 rounded-xl"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearch(); 
              }
            }}
          />
        </div>

        <div className="relative flex-grow min-w-[200px] w-full sm:w-auto rounded-xl">
        <Select onValueChange={(value) => setSortFilter(value)}>
          <SelectTrigger className="pl-3 border-gray-300 focus:border-gray-500 focus:ring focus:ring-gray-300 rounded-xl">
            <SelectValue placeholder={t('searchBar.sort')} />
          </SelectTrigger>
          <SelectContent className="bg-white shadow-lg rounded-xl border-gray-300">
            <SelectItem value="highest_rating">{t('searchBar.highestRating')}</SelectItem>
            <SelectItem value="lowest_rating">{t('searchBar.lowestRating')}</SelectItem>
            <SelectItem value="highest_popularity">{t('searchBar.mostPopular')}</SelectItem>
            <SelectItem value="lowest_popularity">{t('searchBar.leastPopular')}</SelectItem>
            <SelectItem value="alphabetical">{t('searchBar.aToZ')}</SelectItem>
            <SelectItem value="reverse_alphabetical">{t('searchBar.zToA')}</SelectItem>
          </SelectContent>
        </Select>
        </div>
        <Button className="rounded-xl border border-gray-300"onClick={handleShowMap}>{t('button.seeOnMap')}</Button>
      <Dialog open={showMapDialog} onOpenChange={(isOpen) => setShowMapDialog(isOpen)}>
        {showMapDialog && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg z-50">
              <h2 className="text-xl font-bold mb-4">{t('map')}</h2>
              <GoogleMap
                mapContainerStyle={{ height: "400px", width: "800px" }}
                center={mapCenter}
                zoom={12}
                onLoad={(map) => {

                  const validLocations = locations.filter(
                    (location) =>
                      location.latitude !== undefined &&
                      location.longitude !== undefined &&
                      !isNaN(location.latitude) &&
                      !isNaN(location.longitude)
                  );


                  const markers = validLocations.map((location) => {
                    console.log(`Creating marker for location: ${location.street}, ${location.buildingNumber}`);

                    const marker = new google.maps.Marker({
                      position: { lat: location.latitude, lng: location.longitude },
                      title: `${location.street} ${location.buildingNumber}`,
                    });

                    const infoWindow = new google.maps.InfoWindow(); 

                    marker.addListener("click", async () => {
                      console.log(`Marker clicked for location: ${location.street}, ${location.buildingNumber}`);

                      try {
                        const salons = await fetchSalonsByLocation(location.id);
                        console.log("Fetched salons for location:", location.id, salons);
                        setSelectedSalons(salons);
                        setChosenLocation(location);

                        const infoWindowContent = `
                          <div>
                            // <h3>${location.street} ${location.buildingNumber}</h3>
                            // <p>${location.city}, ${location.zipCode}</p>
                            <h4>Salons:</h4>
                            ${salons
                              .map(
                                (salon) => `
                              <div>
                                <strong>${salon.name}</strong>
                                <p>${salon.description}</p>
                              </div>`
                              )
                              .join("")}
                          </div>
                        `;

                        console.log("InfoWindow Content:", infoWindowContent);

                        infoWindow.setContent(infoWindowContent); 
                        infoWindow.open(map, marker);
                      
                      } catch (error) {
                        console.error("Error fetching salons by location:", error);
                      }
                    });

                    return marker;
                  });

                  console.log("Markers created:", markers);
                  const clusterer = new MarkerClusterer({ markers, map });
                  console.log("MarkerClusterer created:", clusterer);
                }}
              />
              <Button className='rounded-xl border border-gray-200' onClick={handleCloseMapDialog}>{t('button.close')}</Button>
            </div>
          </div>
        )}
      </Dialog>
        <Button
          className="bg-red-500 hover:bg-red-500 text-white min-w-[100px] w-full sm:w-auto rounded-xl"
          onClick={handleSearch}
        >
          <Search className="mr-2 h-4 w-4" /> {t('button.search')}
        </Button>

        
      </div>
    </div>
  );
};
export default SearchBar;