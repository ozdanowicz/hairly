import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "react-toastify";
import { Employee, Service, fetchEmployeesByService, AvailableAppointment, AppointmentRequest, bookAppointment, fetchUserData, User } from "@/apiService";
import { InteractiveSalonCalendarComponent } from "./InteractiveAppointmentCalendar";
import { useAuth } from "@/tokenService";

interface Appointment {
  employeeId: number;
  serviceId: number;
  date: Date;
  time: string;
}

export function SalonAppointmentBooking({ employees, services, salonId }: { employees: Employee[], services: Service[], salonId: number }) {
  const { token } = useAuth();
  const [availableEmployees, setAvailableEmployees] = useState<Employee[]>([]);
  const [availableServices, setAvailableServices] = useState<Service[]>(services);
  const [loggedInClient, setLoggedInClient] = useState<User | null>(null);
  const [availableDates, setAvailableDates] = useState<AvailableAppointment[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<number | null>(null);
  const [selectedService, setSelectedService] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const fetchAvailableDates = async (employeeId: number, startDate: Date, endDate: Date): Promise<void> => {
    try {
        const response = await fetch(
            `http://localhost:8080/api/v1/calendar/${employeeId}/available-appointments?startDate=${startDate.toISOString().split('T')[0]}&endDate=${endDate.toISOString().split('T')[0]}`
        );
        const data = await response.json();

        console.log("Fetched Data:", data);

        const transformedData = data.map((item: { date: string; availableTimes: string[] }) => ({
            date: item.date, 
            availableTimes: item.availableTimes, 
        }));

        console.log("Transformed Data:", transformedData);

        setAvailableDates(transformedData); 
    } catch (error) {
        console.error("Error fetching available dates:", error);
        toast.error("Failed to fetch available dates");
    }
};

const fetchLoggedInClient = async () => {
  if (!token) {
    toast.error("You must be logged in to book an appointment");
    return;
  }

  try {
    const userData = await fetchUserData(token);
    if (userData.role !== 'CLIENT') {
      toast.error("You must have a client role to book an appointment");
      return;
    }
    setLoggedInClient(userData);
  } catch (error) {
    console.error("Error fetching logged in client:", error);
    toast.error("Failed to fetch logged in client");
  }
}
 
  useEffect(() => {
    fetchLoggedInClient();

    const fetchEmployees = async () => {
      if (selectedService) {
        try {
          const fetchedEmployees = await fetchEmployeesByService(selectedService);
          setAvailableEmployees(fetchedEmployees);
          setSelectedEmployee(null); // Reset selected employee when service changes
        } catch (error) {
          toast.error("Failed to load employees");
        }
      } else {
        setAvailableEmployees(employees); 
      }
    };
    fetchEmployees();
  }, [selectedService, employees]);

  useEffect(() => {
    if (selectedEmployee) {
      const today = new Date();
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

      fetchAvailableDates(selectedEmployee, startOfMonth, endOfMonth);
    }
  }, [selectedEmployee]);

  const handleBookAppointment = async () => {
    if (!selectedEmployee || !selectedService || !selectedDate || !selectedTime) {
      toast.error("Please select all required fields");
      return;
    }

    if (!loggedInClient) {
      toast.error("You must be logged in to book an appointment");
      return;
    }

    const appointmentRequest: AppointmentRequest = {
      salonId: salonId,
      clientId: loggedInClient.id,
      employeeId: selectedEmployee,
      serviceId: selectedService,
      scheduledDate: selectedDate.toISOString().split('T')[0],
      scheduledTime: selectedTime,
    };

    try {
      await bookAppointment(appointmentRequest);
      toast.success("Appointment booked successfully!");
    } catch (error) {
      console.error("Error booking appointment:", error);
      toast.error("Failed to book appointment");
    }

    setSelectedEmployee(null);
    setSelectedService(null);
    setSelectedDate(null);
    setSelectedTime(null);
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-gray-800">Book an Appointment</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <label htmlFor="service" className="block text-sm font-medium text-gray-800 mb-1">
            Select Service
          </label>
          <Select onValueChange={(value) => setSelectedService(Number(value))} >
            <SelectTrigger id="service" className="border border-gray-300 rounded-xl">
              <SelectValue placeholder="Choose a service" />
            </SelectTrigger>
            <SelectContent className="bg-white text-black border-gray-200 rounded-xl">
              {services.map((service) => (
                <SelectItem key={service.id} value={service.id.toString()}>
                  {service.name} - ${service.price}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label htmlFor="employee" className="block text-sm font-medium text-gray-800 mb-1">
            Select Employee
          </label>
          <Select
            onValueChange={(value) => setSelectedEmployee(Number(value))}
            disabled={!selectedService || availableEmployees.length === 0} 
          >
            <SelectTrigger id="employee" className="border border-gray-300 rounded-xl">
              <SelectValue
                placeholder={
                  !selectedService
                    ? "Select a service first"
                    : availableEmployees.length === 0
                    ? "No employees available"
                    : "Choose an employee"
                }
              />
            </SelectTrigger>
            <SelectContent className="bg-white text-black border-gray-300 rounded-xl">
              {availableEmployees.map((employee) => (
                <SelectItem key={employee.id} value={employee.id.toString()}>
                  {employee.name} {employee.surname}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <InteractiveSalonCalendarComponent
          availableDates={availableDates}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          selectedTime={selectedTime}
          setSelectedTime={setSelectedTime}
        />

        <Button
          onClick={handleBookAppointment}
          className="w-full"
          disabled={!selectedEmployee || !selectedService || !selectedDate || !selectedTime}
        >
          Book Appointment
        </Button>
      </CardContent>
    </Card>
  );
}

export default SalonAppointmentBooking;