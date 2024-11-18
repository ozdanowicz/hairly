import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { MapPin, Edit, Save, X, Trash, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Location, updateSalonLocation, deleteSalonLocation, createSalonLocation } from "@/apiService";
import { toast } from "react-toastify";
import { Label } from "@/components/ui/label";


interface LocationCardProps {
  location: Location | null;
  salonId: string;
  showEditButton?: boolean;
}
const LocationCard: React.FC<LocationCardProps> = ({ salonId,location, showEditButton = false }) => {
  const [isEditingLocation, setIsEditingLocation] = useState(false);
  const [addLocation, setAddLocation] = useState(false);
  const [editableLocation, setEditableLocation] = useState<Location | null>(location);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);


  const validateLocation = () => {
    const errors: any = {
      city: "",
      street: "",
      buildingNumber: "",
    };

    if (!editableLocation?.city || editableLocation.city.trim() === "") {
      errors.city = "City is required.";
    }
    if (!editableLocation?.street || editableLocation.street.trim() === "") {
      errors.street = "Street is required.";
    }
    if (!editableLocation?.buildingNumber || editableLocation.buildingNumber.trim() === "") {
      errors.buildingNumber = "Building number is required.";
    }

    return errors;
  };

  useEffect(() => {
    if (location && !addLocation) {
      setEditableLocation(location);
    }

  }, [location, addLocation]);

  const handleInputChange = (field: keyof Location, value: string) => {
    if (editableLocation) {
      setEditableLocation({ ...editableLocation, [field]: value });
    }
  };

  const handleSaveLocation = async () => {
    const errors = validateLocation();
    if (Object.values(errors).some((error) => error !== "")) {
      setValidationErrors(errors);
      toast.error(Object.values(errors).join("\n") + "\n");
      return;
    }

    if (editableLocation?.id && !addLocation) {
      // Update existing location
      try {
        await updateSalonLocation(editableLocation.id, editableLocation);
        toast.success("Location updated successfully!");
        setIsEditingLocation(false);
      } catch (error) {
        toast.error("Failed to update location.");
      }
    } else if (addLocation) {
      try {
        const newLocation = await createSalonLocation(salonId,editableLocation);
        setEditableLocation(newLocation);
        toast.success("New location created successfully!");
        setAddLocation(false);
        setIsEditingLocation(false);
      } catch (error) {
        toast.error("Failed to create new location.");
      }
    }
  };

  const handleDeleteLocation = async () => {
    if (editableLocation && editableLocation.id) {
      try {
        await deleteSalonLocation(editableLocation.id);
        setEditableLocation(null);
        toast.success("Location deleted successfully!");
      } catch (error) {
        toast.error("Failed to delete location.");
      }
    }
  };
  
  const handleNewLocation = () => {
    setEditableLocation({} as Location); // Set empty location object
    setAddLocation(true); // Enable addLocation mode
    setIsEditingLocation(false);
  };

return (
    <>
    <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pt-4 pb-4 mb-3 bg-gray-100  rounded-xl">
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-6 h-6" />
              Salon Location
            </CardTitle>
            {showEditButton && (
          isEditingLocation ? (
            <div className="flex gap-2">
              <Button 
              className="border-non bg-white rounded-xl" 
              onClick={handleSaveLocation} 
              variant="outline" 
              size="sm">
                <Save className="w-4 h-4 mr-2" /> Save
              </Button>
              <Button 
              className="border-non bg-white rounded-xl"
               onClick={() => {
                setIsEditingLocation(false); 
                setAddLocation(false);
                setEditableLocation(location);
               }} 
                variant="ghost" 
                size="sm">
                <X className="w-4 h-4 mr-2" /> Cancel
              </Button>
            </div>
          ) : (
            <div className="flex space-x-2">
            {editableLocation ? (
              <>
                <Button
                  className="border-none bg-rose-700 rounded-xl text-white"
                  onClick={handleDeleteLocation}
                  variant="outline"
                  size="sm"
                >
                  <Trash className="w-4 h-4 text-white" /> Delete
                </Button>
                <Button className="border-none bg-white rounded-xl" onClick={() => setIsEditingLocation(true)} variant="outline" size="sm">
                  <Edit className="w-4 h-4 mr-2" /> Edit
                </Button>
              </>
            ) : (
              <Button className="border-none bg-white rounded-xl" onClick={handleNewLocation} variant="outline" size="sm">
                <Plus className="w-4 h-4" /> Add
              </Button>
            )}
          </div>
          )
        )}
          </CardHeader>
          <CardContent>
          {editableLocation && (isEditingLocation || addLocation) ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="font-semibold">City</Label>
                    <input
                      className={`w-full p-2 border rounded mb-2 ${validationErrors.city ? 'border-red-500' : ''}`}
                      value={editableLocation.city || ''}
                      onChange={(e) => handleInputChange("city", e.target.value)}
                      placeholder="City"
                    />
                    {validationErrors.city && (
                      <p className="text-red-500 text-sm">{validationErrors.city}</p>
                    )}
                  </div>

                  <div>
                    <Label className="font-semibold">Street</Label>
                    <input
                      className={`w-full p-2 border rounded mb-2 ${validationErrors.street ? 'border-red-500' : ''}`}
                      value={editableLocation.street || ''}
                      onChange={(e) => handleInputChange("street", e.target.value)}
                      placeholder="Street"
                    />
                    {validationErrors.street && (
                      <p className="text-red-500 text-sm">{validationErrors.street}</p>
                    )}
                  </div>

                  <div>
                    <Label className="font-semibold">Building number</Label>
                    <input
                      className={`w-full p-2 border  rounded mb-2 ${validationErrors.buildingNumber ? 'border-red-500' : ''}`}
                      value={editableLocation.buildingNumber || ''}
                      onChange={(e) => handleInputChange("buildingNumber", e.target.value)}
                      placeholder="Building Number"
                    />
                    {validationErrors.buildingNumber && (
                      <p className="text-red-500 text-sm">{validationErrors.buildingNumber}</p>
                    )}
                  </div>

                  <div>
                    <Label className="font-semibold">Apartment number</Label>
                    <input
                      className="w-full p-2 border rounded mb-2"
                      value={editableLocation.apartmentNumber || ''}
                      onChange={(e) => handleInputChange("apartmentNumber", e.target.value)}
                      placeholder="Apartment Number"
                    />
                  </div>

                  <div>
                    <Label className="font-semibold">Province</Label>
                    <input
                      className="w-full p-2 border rounded mb-2"
                      value={editableLocation.province || ''}
                      onChange={(e) => handleInputChange("province", e.target.value)}
                      placeholder="Province"
                    />
                  </div>

                  <div>
                    <Label className="font-semibold">Zip Code</Label>
                    <input
                      className="w-full p-2 border rounded mb-2"
                      value={editableLocation.zipCode || ''}
                      onChange={(e) => handleInputChange("zipCode", e.target.value)}
                      placeholder="Zip Code"
                    />
                  </div>

                  <div>
                    <Label className="font-semibold">Longitude</Label>
                    <input
                      className="w-full p-2 border rounded mb-2"
                      value={editableLocation.longitude || ''}
                      onChange={(e) => handleInputChange("longitude", e.target.value)}
                      placeholder="Longitude"
                    />
                  </div>

                  <div>
                    <Label className="font-semibold">Latitude</Label>
                    <input
                      className="w-full p-2 border rounded mb-2"
                      value={editableLocation.latitude || ''}
                      onChange={(e) => handleInputChange("latitude", e.target.value)}
                      placeholder="Latitude"
                    />
                  </div>
                </div>
          ) : (
            editableLocation && (
              <div className="grid grid-cols-1 md:grid-cols-2">
                
                  <div>
                  <p className="font-semibold mb-2">City</p>
                  <p className="mb-3 text-gray-700">{editableLocation.city}</p>
                    </div>
                    <div>
                    <p className="font-semibold mb-2">Province</p>
                    <p className="mb-3 text-gray-700">{editableLocation.province || '-'}</p>
                    </div>
                    <div>
                    <p className="font-semibold mb-2">Street</p>
                    <p className="mb-3 text-gray-700">{editableLocation.street}</p>
                    </div>
                    <div>
                    <p className="font-semibold mb-2">Zip Code</p>
                    <p className="mb-3 text-gray-700">{editableLocation.zipCode || '-'}</p>
                    </div>
                    <div>
                    <p className="font-semibold mb-2">Building Number</p>
                    <p className="mb-3 text-gray-700">{editableLocation.buildingNumber}</p>
                    </div>
                    <div>
                    <p className="font-semibold mb-2">Longitude</p>
                    <p className="mb-3 text-gray-700">{editableLocation.longitude || '-'}</p>
                    </div>
                    <div>
                    <p className="font-semibold mb-2">Apartment Number</p>
                    <p className="mb-3 text-gray-700">{editableLocation.apartmentNumber || '-'}</p>
                    </div>
                 <div>
                 <p className="font-semibold mb-2">Latitude</p>
                 <p className="mb-3 text-gray-700">{editableLocation.latitude || '-'}</p>
                </div>
            </div>
              
            )
          )}
      </CardContent>
        </Card>
        </>
    )
};
export default LocationCard;