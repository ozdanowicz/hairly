import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pen, Save } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { fetchEmployeeAppointments, Appointment, fetchEmployeeSpecializations, loadSpecializations, updateEmployeeSpecializations, Specialization, SpecializationEnum, } from '@/apiService';

interface EmployeeInfo {
  id: number;
  name: string;
  surname: string;
  email: string;
  phone: string;
}

interface SpecializationEnum {
  specialization: string;
}

interface EmployeeDashboardProps {
  user: EmployeeInfo;
}

export function EmployeeDashboard({ user }: EmployeeDashboardProps) {
  const [employeeInfo, setEmployeeInfo] = useState<EmployeeInfo>({
    id: user.id,
    name: user.name,
    surname: user.surname,
    phone: user.phone,
    email: user.email,
  });
  const [specializations, setSpecializations] = useState<Specialization[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [allSpecializations, setAllSpecializations] = useState<SpecializationEnum[]>([]);
  const [newSpecialization, setNewSpecialization] = useState('');
  const [loadingAppointments, setLoadingAppointments] = useState<boolean>(true);
  const [loadingSpecializations, setLoadingSpecializations] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoadingAppointments(true);
        const fetchedAppointments = await fetchEmployeeAppointments(employeeInfo.id);
        setAppointments(fetchedAppointments);
      } catch (error) {
        console.error("Error fetching appointments:", error);
        setError("Failed to load appointments");
      } finally {
        setLoadingAppointments(false);
      }

      try {
        setLoadingSpecializations(true);
        const [fetchedSpecializations, fetchedAllSpecializations] = await Promise.all([
          fetchEmployeeSpecializations(user.id),
          loadSpecializations()
        ]);
        setSpecializations(fetchedSpecializations);
        setAllSpecializations(fetchedAllSpecializations);
      } catch (error) {
        console.error("Error fetching specializations:", error);
        setError("Failed to load specializations");
      } finally {
        setLoadingSpecializations(false);
      }
    };

    loadData();
  }, [user.id]);

  const handleAddSpecialization = () => {
    if (newSpecialization.trim() && !specializations.some(spec => spec.specialization === newSpecialization)) {
      setSpecializations([...specializations, { specialization: newSpecialization }]); // Add new specialization
      setNewSpecialization(''); // Clear the input field
    }
  };

  const handleDeleteSpecialization = (specializationToDelete) => {
    setSpecializations(specializations.filter(spec => spec.specialization !== specializationToDelete));
  };

  const handleSpecializationChange = (value: string) => {
    const selectedSpecialization = allSpecializations.find(spec => spec.name === value);
    if (selectedSpecialization && !specializations.some(spec => spec.name === value)) {
        setSpecializations([...specializations, selectedSpecialization]);
    }
    };
  const handleEdit = () => setEditMode(true);

  const handleSave = async () => {
    setEditMode(false);
    try {
      await updateEmployeeSpecializations(user.id, specializations);
    } catch (error) {
      console.error("Error updating specializations:", error);
      setError("Failed to update specializations");
    }
  };

  return (
    <section className="bg-cover bg-rose-50 bg-center min-h-screen flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg dark:border md:mt-0 p-6 dark:bg-rose-200 dark:border-rose-700 opacity-95">
        <h1 className="text-2xl font-bold leading-tight tracking-tight text-rose-900 mb-6 dark:text-black">
          Employee Dashboard
        </h1>
        
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Personal Information</CardTitle>
              <Button variant="ghost" size="icon" onClick={editMode ? handleSave : handleEdit}>
                {editMode ? <Save className="h-4 w-4" /> : <Pen className="h-4 w-4" />}
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {Object.entries(employeeInfo).map(([key, value]) => {
                  if (key === 'specializations' || key === 'id') return null;
                  return (
                    <div key={key} className="flex justify-between">
                      <span className="font-medium">{key.charAt(0).toUpperCase() + key.slice(1)}:</span>
                      {editMode ? (
                        <input
                          type="text"
                          value={value as string}
                          onChange={(e) => setEmployeeInfo(prev => ({ ...prev, [key]: e.target.value })) }
                          className="bg-rose-50 border border-rose-300 text-rose-900 text-sm rounded-lg focus:ring-rose-500 focus:border-rose-500 p-1 dark:bg-rose-100 dark:border-rose-300 dark:placeholder-rose-400 dark:text-black"
                        />
                      ) : (
                        <span>{value as string}</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Specializations</CardTitle>
              <Button variant="ghost" size="icon" onClick={editMode ? handleSave : handleEdit}>
                {editMode ? <Save className="h-4 w-4" /> : <Pen className="h-4 w-4" />}
              </Button>
            </CardHeader>
            <CardContent>
              {loadingSpecializations ? (
                <p>Loading specializations...</p>
              ) : editMode ? (
                <div>
                  <Select onValueChange={handleSpecializationChange}>
                    <SelectTrigger className="w-full rounded-xl bg-white">
                      <SelectValue placeholder="Select a specialization" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      {allSpecializations.map((spec) => (
                        <SelectItem className="rounded-xl" key={spec} value={spec}>
                          {spec}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {specializations.map((spec) => (
                      <div key={spec.specialization} className="flex items-center bg-rose-100 text-rose-800 text-xs font-medium px-2.5 py-0.5 rounded">
                        <span>{spec.specialization}</span>
                        <button onClick={() => handleDeleteSpecialization(spec.specialization)} className="ml-2 text-red-500">Delete</button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {specializations.map((spec) => (
                    <span key={spec.specialization} className="bg-rose-100 text-rose-800 text-xs font-medium px-2.5 py-0.5 rounded">
                      {spec.specialization}
                    </span>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Appointments Card */}
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Appointments</CardTitle>
            </CardHeader>
            <CardContent>
              {loadingAppointments ? (
                <p>Loading appointments...</p>
              ) : error ? (
                <p className="text-red-500">{error}</p>
              ) : appointments.length > 0 ? (
                <ul className="space-y-2">
                  {appointments.map((appointment, index) => (
                    <li key={index} className="flex justify-between">
                      <span>{appointment.scheduledTime}</span>
                      <span>{appointment.serviceId}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No upcoming appointments</p>
              )}
            </CardContent>
          </Card>

          <Card className="flex flex-col justify-center items-center p-6 bg-gradient-to-br from-rose-400 to-rose-600 text-white">
             <calendar-clock className="w-16 h-16 mb-4" />
            <h3 className="text-xl font-bold mb-2">Google Calendar</h3>
            <p className="text-center mb-4">Sync your work schedule with Google Calendar</p>
            <Button 
              variant="secondary" 
              className="bg-white text-rose-600 rounded-xl hover:bg-rose-100"
              onClick={() => window.open('https://calendar.google.com', '_blank')}
            >
              Go to My Google Calendar
            </Button>
          </Card>

          {/* Work Schedule Placeholder Card */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Work Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">Work schedule information will be displayed here.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

export default EmployeeDashboard;
