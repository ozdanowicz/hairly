import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useLocation } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Edit, Save, X } from "lucide-react"
import { Employee, Service, Schedule, Salon } from "@/apiService"
import { fetchOwnerSalon, fetchSalonSchedule, fetchEmployeesBySalon, fetchServices} from "@/apiService"
import ImageCarousel from "./ImageCarousel"
import EmployeesCard from "./EmployeesCard"
import LocationCard from "./LocationCard"
import { updateSalonLocation, updateSalonServices } from "@/apiService";


interface OwnerInfo {
  id: number
  name: string
  surname: string
  email: string
  phone: string
}

interface SalonPhoto {
  id: number
  url: string
}

interface OwnerDashboardProps {
  user: OwnerInfo
}

export function OwnerDashboardEdit() {
  const location = useLocation();
  const { user } = location.state as OwnerDashboardProps;
  const [isEditingLocation, setIsEditingLocation] = useState(false);
  const [isEditingServices, setIsEditingServices] = useState(false);
  const [isEditingSchedule, setIsEditingSchedule] = useState(false);
  //const [ownerInfo] = useState<OwnerInfo>({ ...user });
  const [salon, setSalon] = useState<Salon | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [schedule, setSchedule] = useState<Schedule[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [salonPhotos, setSalonPhotos] = useState<SalonPhoto[]>([{ id: 1, url: "/placeholder.svg" }]);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const fetchedSalon = await fetchOwnerSalon(user.id);
        setSalon(fetchedSalon);
        setServices(fetchedSalon.services || []);
        setSchedule(fetchedSalon.schedule || []);
        if (fetchedSalon && fetchedSalon.id) {
          setEmployees(await fetchEmployeesBySalon(fetchedSalon.id));
        }
      } catch (error) {
        console.error("Failed to fetch salon data:", error);
      }
    };
    loadData();
  }, [user.id]);

  const handleEdit = () => {
    setIsEditing(true);
  };
  

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  
    try {
      if (salon && salon.id) {
        const formData = new FormData(event.currentTarget);
  
        // Update Salon Location
        const updatedLocation = {
          street: formData.get('street') as string,
          city: formData.get('city') as string,
          state: formData.get('state') as string,
          zipCode: formData.get('zipCode') as string,
        };
        await updateSalonLocation(salon.id, updatedLocation);
  
        // Update Salon Services
        const updatedServices = services.map((service, index) => ({
          id: service.id,
          name: formData.get(`serviceName${index}`) as string,
          description: formData.get(`serviceDescription${index}`) as string,
          price: parseFloat(formData.get(`servicePrice${index}`) as string),
          durationMinutes: parseInt(formData.get(`serviceDuration${index}`) as string),
        }));
        const updatedServicesResponse = await updateSalonServices(salon.id, updatedServices);
        
        // Optionally update the state if backend returned updated data
        setServices(updatedServicesResponse);
  
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Failed to update salon data:", error);
    }
  };
  

  return (
    <section className="bg-rose-50 min-h-screen p-4 md:p-8 lg:p-12">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-6 md:p-8 dark:bg-rose-200 dark:border-rose-700">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-rose-900 mb-8 dark:text-black">
            Salon Owner Dashboard
          </h1>
          {!isEditing ? (
            <Button variant="outline" className="flex items-center gap-2 border-none rounded-xl" onClick={handleEdit}>
              <Edit className="w-4 h-4" />
              Edit Salon Info
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button type="submit" form="salonForm" variant="outline" className="flex items-center gap-2">
                <Save className="w-4 h-4" />
                Save Changes
              </Button>
              <Button variant="ghost" className="flex items-center gap-2" onClick={handleCancel}>
                <X className="w-4 h-4" />
                Cancel
              </Button>
            </div>
          )}
        </div>

        <form id="salonForm" onSubmit={handleSave}>
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Salon Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <Label htmlFor="name">Salon Name</Label>
                <Input
                  id="name"
                  name="name"
                  defaultValue={salon?.name || ""}
                  disabled={!isEditing}
                />
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  defaultValue={salon?.description || ""}
                  disabled={!isEditing}
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Location</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="street">Street</Label>
                  <Input
                    id="street"
                    name="street"
                    defaultValue={salon?.location?.street || ""}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    name="city"
                    defaultValue={salon?.location?.city || ""}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    name="state"
                    defaultValue={salon?.location?.state || ""}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="zipCode">Zip Code</Label>
                  <Input
                    id="zipCode"
                    name="zipCode"
                    defaultValue={salon?.location?.zipCode || ""}
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {schedule?.map((day) => (
              <div key={day.dayOfWeek} className="space-y-2">
                  <Label>{day.dayOfWeek.charAt(0).toUpperCase() + day.dayOfWeek.slice(1).toLowerCase()}</Label>
                  <div className="flex gap-2">
                    <Input
                      type="time"
                      name={`${day.dayOfWeek}OpeningTime`}
                      defaultValue={day.openingTime?.slice(0, 5)}
                      disabled={!isEditing}
                    />
                    <Input
                      type="time"
                      name={`${day.dayOfWeek}ClosingTime`}
                      defaultValue={day.closingTime?.slice(0, 5)}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              ))}
              </div>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Services</CardTitle>
            </CardHeader>
            <CardContent>
            {services?.map((service, index) => (
              <div key={index} className="mb-4 p-4 border rounded">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor={`serviceName${index}`}>Service Name</Label>
                    <Input
                      id={`serviceName${index}`}
                      name={`serviceName${index}`}
                      defaultValue={service.name || ""}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor={`servicePrice${index}`}>Price</Label>
                    <Input
                      id={`servicePrice${index}`}
                      name={`servicePrice${index}`}
                      type="number"
                      step="0.01"
                      defaultValue={service.price || 0}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor={`serviceDescription${index}`}>Description</Label>
                    <Textarea
                      id={`serviceDescription${index}`}
                      name={`serviceDescription${index}`}
                      defaultValue={service.description || ""}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor={`serviceDuration${index}`}>Duration (minutes)</Label>
                    <Input
                      id={`serviceDuration${index}`}
                      name={`serviceDuration${index}`}
                      type="number"
                      defaultValue={service.durationMinutes || 0}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </div>
            ))}
            </CardContent>
          </Card>
        </form>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Salon Employees</CardTitle>
          </CardHeader>
          <CardContent>
            <EmployeesCard salonId={salon?.id || 0} isEditing={isEditing} />
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Salon Photos</CardTitle>
          </CardHeader>
          <CardContent>
            <ImageCarousel images={salon?.salonImages || []} isEditing={isEditing} />
          </CardContent>
        </Card>

        <Card className="bg-destructive text-destructive-foreground">
          <CardHeader>
            <CardTitle>Danger Zone</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Deleting your salon will permanently remove all associated data. This action cannot be undone.</p>
            <Button variant="destructive" className="flex items-center gap-2">
              Delete Salon
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
} 
export default OwnerDashboardEdit;