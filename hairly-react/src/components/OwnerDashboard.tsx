import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {  Edit } from "lucide-react"
import { Employee, Service, Schedule, Salon } from "@/apiService"
import { fetchOwnerSalon, fetchSalonSchedule, fetchEmployeesBySalon, fetchServices} from "@/apiService"
import ImageCarousel from "./ImageCarousel"

import EmployeesCard from "./EmployeesCard"
import LocationCard from "./LocationCard"
import { NavLink } from "react-router-dom"


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

export function SalonOwnerDashboard({ user }: OwnerDashboardProps) {
  const [ownerInfo] = useState<OwnerInfo>({ ...user });
  const [salon, setSalon] = useState<Salon | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [schedule, setSchedule] = useState<Schedule[]>([]);
  const [salonPhotos, setSalonPhotos] = useState<SalonPhoto[]>([{ id: 1, url: "/placeholder.svg" }]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const fetchedSalon = await fetchOwnerSalon(user.id);
        setSalon(fetchedSalon);
        setServices(fetchedSalon.services);
        if (fetchedSalon && fetchedSalon.id) {
          setSchedule(await fetchSalonSchedule(fetchedSalon.id));
          setEmployees(await fetchEmployeesBySalon(fetchedSalon.id));
          setServices(await fetchServices(fetchedSalon.id));
        }
      } catch (error) {
        console.error("Failed to fetch salon data:", error);
      }
    };
    loadData();
  }, [user.id]);

  return (
    <section className="bg-rose-50 min-h-screen p-4 md:p-8 lg:p-12">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-6 md:p-8 dark:bg-rose-200 dark:border-rose-700">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-rose-900 mb-8 dark:text-black">
          Salon Owner Dashboard
        </h1>
        <NavLink to="/profile/owner-edit-dashboard" state={{ user }}>
        <Button variant="outline" className="flex items-center gap-2 border-none rounded-xl">
          <Edit className="w-4 h-4" />
          Edit Salon Info
        </Button>
      </NavLink>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Salon Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2">
            <p className="font-semibold">Salon Name:</p>
            <p className="font-medium mb-4">{salon?.name || "No salon name yet"}</p>
            <p className="font-semibold">Description:</p>
            <p className="font-medium mb-4">{salon?.description || "No description yet"}</p>
            </div>
          </CardContent>
        </Card>
        <LocationCard location={salon?.location} />

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Schedule</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-3 gap-4">
            {schedule.map((day) => (
              <div key={day.dayOfWeek} className="flex flex-col space-y-1">
                <span className="font-semibold">{day.dayOfWeek.charAt(0).toUpperCase() + day.dayOfWeek.slice(1).toLowerCase()}</span>
                <p>Opening Time: {day.openingTime.slice(0,5) || "N/A"}</p>
                <p>Closing Time: {day.closingTime.slice(0,5) || "N/A"}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Salon Employees</CardTitle>
          </CardHeader>
          <CardContent>
          <EmployeesCard salonId={salon?.id || 0} />
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">Services Offered</CardTitle>
          </CardHeader>
          <CardContent>
            {services?.length > 0 ? (
              <ul className="space-y-4">
                {services?.map((service, index) => (
                  <li key={index} className="border-b pb-4">
                    <h3 className="font-semibold">{service.name}</h3>
                    {service.description && <p className="text-gray-600">{service.description}</p>}
                    <p className="text-lg font-bold">${service.price.toFixed(2)}</p>
                    <p className="text-sm text-gray-500">
                      Duration: {service.durationMinutes} minutes
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 p-2">No services available.</p>
            )}
          </CardContent>
      </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Salon Photos</CardTitle>
          </CardHeader>
          <CardContent>
          <ImageCarousel images={salon?.salonImages} />
          </CardContent>
        </Card>

        <Card className="bg-destructive text-destructive-foreground">
          <CardHeader>
            <CardTitle>Danger Zone</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Deleting your salon will permanently remove all associated data. This action cannot be undone.</p>
            <p className="text-red-600 font-bold">Delete Salon Action (not clickable in view mode)</p>
          </CardContent>
        </Card>
       
      </div>
    </section>
  );
}

export default SalonOwnerDashboard;
