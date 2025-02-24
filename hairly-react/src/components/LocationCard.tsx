import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { MapPin, Save, X, Trash, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Location, createSalonLocation, deleteSalonLocation, fetchLocation } from "@/apiService";
import { toast } from "react-toastify";
import { Label } from "@/components/ui/label";
import { StandaloneSearchBox, GoogleMap, Marker } from "@react-google-maps/api";
import { useTranslation } from 'react-i18next';

interface LocationCardProps {
  salonId: number;
  isOwner: boolean; 
}

const LocationCard: React.FC<LocationCardProps> = ({ salonId, isOwner }) => {
  const { t } = useTranslation();
  const [isAdding, setIsAdding] = useState(false);
  const [location, setLocation] = useState<Location | null>(null);
  const [newLocation, setNewLocation] = useState<Location | null>(null);
  const [searchBox, setSearchBox] = useState<google.maps.places.SearchBox | null>(null);
  const [markerPosition, setMarkerPosition] = useState({ lat: 0, lng: 0 });
  const [mapCenter, setMapCenter] = useState({ lat: 0, lng: 0 });

  useEffect(() => {
    const fetchSalonLocation = async () => {
      try {
        const salonLocation = await fetchLocation(salonId);
        setLocation(salonLocation);
        if (salonLocation) {
          setMarkerPosition({ lat: salonLocation.latitude ?? 0, lng: salonLocation.longitude ?? 0 });
          setMapCenter({ lat: salonLocation.latitude ?? 0, lng: salonLocation.longitude ?? 0 });
        }
      } catch (error) {
        console.error("Error fetching location:", error);
      }
    };

    fetchSalonLocation();
  }, [salonId]);

  const onPlacesChanged = () => {
    const places = searchBox?.getPlaces();
    if (!places || places.length === 0) return;
    const place = places[0];
    const parsedData = parseGoogleMapsResponse(place);

    setNewLocation({
      city: parsedData.city,
      street: parsedData.street,
      buildingNumber: parsedData.buildingNumber,
      apartmentNumber: parsedData.apartmentNumber,
      latitude: parsedData.latitude,
      longitude: parsedData.longitude,
      zipCode: parsedData.zipCode,
    });

    setMarkerPosition({
      lat: parsedData.latitude,
      lng: parsedData.longitude,
    });

    setMapCenter({
      lat: parsedData.latitude,
      lng: parsedData.longitude,
    });
  };

  const parseGoogleMapsResponse = (place: google.maps.places.PlaceResult) => {
    const addressComponents = place.address_components;
    let city = "", street = "", zipCode = "", country = "", buildingNumber = "", apartmentNumber = "";

    addressComponents?.forEach((component) => {
      if (component.types.includes("locality")) city = component.long_name;
      if (component.types.includes("postal_code")) zipCode = component.long_name;
      if (component.types.includes("street_number")) buildingNumber = component.long_name;
      if (component.types.includes("route")) street = component.long_name;
      if (component.types.includes("apartment")) apartmentNumber = component.long_name;
    });

    const latitude = place.geometry?.location?.lat() ?? 0;
    const longitude = place.geometry?.location?.lng() ?? 0;

    return { street, city, zipCode, country, buildingNumber, apartmentNumber, latitude, longitude };
  };

  const validateLocation = () => {
    if (!newLocation?.city || newLocation.city.trim() === "") return t('toast.error.locationCity');
    if (!newLocation?.street || newLocation.street.trim() === "") return t('toast.error.locationStreet');
    if (!newLocation?.buildingNumber || newLocation.buildingNumber.trim() === "") return t('toast.error.locationBuildingNumber');
    return null;
  };

  const handleSaveLocation = async () => {
    const validationError = validateLocation();
    if (validationError) {
      toast.error(validationError);
      return;
    }

    try {
      const savedLocation = await createSalonLocation(salonId, newLocation);
      toast.success(t('toast.locationAdd'));
      setLocation(savedLocation);
      setNewLocation(null);
      setIsAdding(false);
    } catch (error) {
      toast.error(t('toast.error.locationAdd'));
    }
  };

  const handleDeleteLocation = async () => {
    if (location?.id) {
      try {
        await deleteSalonLocation(location.id);
        toast.success(t('toast.locationDelete'));
        setLocation(null);
        setMarkerPosition({ lat: 0, lng: 0 });
        setMapCenter({ lat: 0, lng: 0 });
      } catch (error) {
        toast.error(t('toast.error.locationDelete'));
      }
    }
  };

  return (
    <Card className="border-0 shadow-lg rounded-xl bg-white">
      <CardHeader className="flex justify-between p-4 bg-gray-100 rounded-t-xl">
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-6 h-6" />
          {t('location.title')}
        </CardTitle>

        {isOwner && !location && !isAdding && (
          <Button onClick={() => setIsAdding(true)} variant="outline" size="sm">
            <Plus className="w-4 h-4 mr-2" /> {t('button.add')}
          </Button>
        )}
      </CardHeader>

      <CardContent className="space-y-4 p-6">
        {isAdding && isOwner && (
          <div>
            <Label className="font-semibold">{t('search')}</Label>
            <StandaloneSearchBox onLoad={(ref) => setSearchBox(ref)} onPlacesChanged={onPlacesChanged}>
              <input type="text" placeholder={t('location.searchBar')} className="w-full p-2 border rounded-md shadow-sm mb-2" />
            </StandaloneSearchBox>
            <GoogleMap mapContainerStyle={{ height: "300px", width: "100%" }} center={mapCenter} zoom={15}>
              <Marker position={markerPosition} />
            </GoogleMap>

            <Button onClick={handleSaveLocation} variant="outline" className="mt-4 bg-green-500 text-white rounded-md">
              <Save className="w-4 h-4 mr-2" /> Save Location
            </Button>
            <Button onClick={() => setIsAdding(false)} variant="ghost" className="ml-2 text-gray-500">
              <X className="w-4 h-4 mr-2" /> Cancel
            </Button>
          </div>
        )}

        {location && (
          <div className="flex flex-col space-y-4">
            <GoogleMap mapContainerStyle={{ height: "300px", width: "100%" }} center={mapCenter} zoom={15}>
              <Marker position={markerPosition} />
            </GoogleMap>
            <div className="flex justify-between items-center">
              <div>
                <p>{location.street}, {location.city}</p>
                <p>{location.zipCode}, {location.buildingNumber}</p>
              </div>
              {isOwner && (
                <Button className="rounded-xl border-non" onClick={handleDeleteLocation} variant="outline" color="rose" size="sm">
                  <Trash className="w-4 h-4 mr-2" /> {t('button.delete')}
                </Button>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LocationCard;