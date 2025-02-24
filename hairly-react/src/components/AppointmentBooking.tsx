import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "react-toastify";
import { Employee, Service, fetchEmployeesByService, AvailableAppointment, AppointmentRequest, bookAppointment, fetchUserData, User } from "@/apiService";
import { InteractiveSalonCalendarComponent } from "./InteractiveAppointmentCalendar";
import { useAuth } from "@/tokenService";
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();

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
        toast.error(t('failedToFetchDates'));
    }
};

const fetchLoggedInClient = async () => {
  
   console.log(token);
  if (!token) {
    toast.error(t('mustBeLoggedIn'));
    return;
  }

  try {
    const userData = await fetchUserData(token);
    if (userData.role !== 'CLIENT') {
      toast.error(t('mustHaveClientRole'));
      return;
    }
    console.log("User Data:", userData.id);
    setLoggedInClient(userData);
  } catch (error) {
    console.error('Error fetching user data:', error);
    toast.error(t('failedToFetchUserData'));
  }
};
  useEffect(() => {
    fetchLoggedInClient();
    const fetchEmployees = async () => {
      if (selectedService) {
        try {
          const fetchedEmployees = await fetchEmployeesByService(selectedService);
          setAvailableEmployees(fetchedEmployees);
          setSelectedEmployee(null); 
        } catch (error) {
          toast.error(t('failedToLoadEmployees'));
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
      toast.error(t('selectAllFields'));
      return;
    }

    const appointmentRequest: AppointmentRequest = {
      salonId: salonId,
      clientId: loggedInClient?.id,
      employeeId: selectedEmployee,
      serviceId: selectedService,
      scheduledDate: selectedDate.toISOString().split('T')[0],
      scheduledTime: selectedTime,
    };

    console.log("Appointment Request:", appointmentRequest);

    try {
      const appointment = await bookAppointment(appointmentRequest);
        toast.success(t('appointmentBooked'));
    } catch (error) {
      console.error("Error booking appointment:", error);
      //toast.error(t('failedToBookAppointment'));
    }
    setSelectedEmployee(null);
    setSelectedService(null);
    setSelectedDate(null);
    setSelectedTime(null);
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-gray-800">{t('bookAppointmentTitle')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <label htmlFor="service" className="block text-sm font-medium text-gray-800 mb-1">
            {t('selectService')}
          </label>
          <Select onValueChange={(value) => setSelectedService(Number(value))} >
            <SelectTrigger id="service" className="border border-gray-300 rounded-xl">
              <SelectValue placeholder={t('chooseService')} />
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
            {t('selectEmployee')}
          </label>
          <Select
            onValueChange={(value) => setSelectedEmployee(Number(value))}
            disabled={!selectedService || availableEmployees.length === 0} 
          >
            <SelectTrigger id="employee" className="border border-gray-300 rounded-xl">
              <SelectValue
                placeholder={
                  !selectedService
                    ? t('selectEmployeeFirst')
                    : availableEmployees.length === 0
                    ? t('noEmployeesAvailable')
                    : t('chooseEmployee')
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
          {t('bookAppointmentTitle')}
        </Button>
      </CardContent>
    </Card>
  );
}

export default SalonAppointmentBooking;