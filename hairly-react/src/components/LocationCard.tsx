import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { MapPin } from "lucide-react"; // Ensure lucide-react is installed
import { Button } from "@/components/ui/button";
import {Location} from "@/apiService";



interface LocationCardProps {
  location: Location | null;
}
const LocationCard: React.FC<LocationCardProps> = ({location}) => {

return (
    <>
    <Card className="mb-8">
        <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-6 h-6" />
              Salon Location
            </CardTitle>
          </CardHeader>
          <CardContent>
            {location ? (
              <div>
                <p className="text-lg font-semibold">{location?.city}</p>
                <p>{location.street}</p>
                <p>{`${location.buildingNumber}, ${location.apartmentNumber}, ${location.province}, ${location.zipCode}`}</p>
                <p className="text-gray-500">{`${location.longitude}, ${location.latitude}`}</p>
                <Button variant="outline" className="mt-4 rounded-xl border-non bg-rose-100">
                  Get Directions
                </Button>
              </div>
            ) : (
              <p className="text-gray-500">No location information available</p>
            )}
          </CardContent>
        </Card>
        </>
    )
};
export default LocationCard;