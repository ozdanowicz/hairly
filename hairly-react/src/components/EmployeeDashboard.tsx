import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Pen, Save } from "lucide-react"
import { fetchEmployeeAppointments, Appointment, Specialization } from '@/apiService'

interface EmployeeInfo {
  id: number;
  name: string
  surname: string
  email: string
  phone: string
}

interface EmployeeDashboardProps {
  user: EmployeeInfo
}

export function EmployeeDashboard({ user }: EmployeeDashboardProps) {
  const [employeeInfo, setEmployeeInfo] = useState<EmployeeInfo>({
    id: user.id,
    name: user.name,
    surname: user.surname,
    phone: user.phone,
    email: user.email,
  });
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loadingAppointments, setLoadingAppointments] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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
    };

    loadData();
  }, [employeeInfo.id]);

  const [editMode, setEditMode] = useState(false)

  const handleEdit = () => {
    setEditMode(true)
  }

  const handleSave = () => {
    setEditMode(false)
  }

  return (
    <section
      className="bg-cover bg-rose-50 bg-center min-h-screen flex items-center justify-center px-4 py-8"
    >
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg dark:border md:mt-0 p-6 dark:bg-rose-200 dark:border-rose-700 opacity-95">
        <h1 className="text-2xl font-bold leading-tight tracking-tight text-rose-900 mb-6 dark:text-black">
          Employee Dashboard
        </h1>
        
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Personal Information</CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={editMode ? handleSave : handleEdit}
              >
                {editMode ? <Save className="h-4 w-4" /> : <Pen className="h-4 w-4" />}
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {Object.entries(employeeInfo).map(([key, value]) => {
                  if (key === 'specializations' || key === 'salon' || key === 'id') return null;
                  return (
                    <div key={key} className="flex justify-between">
                      <span className="font-medium">{key.charAt(0).toUpperCase() + key.slice(1)}:</span>
                      {editMode ? (
                        <input
                          type="text"
                          value={value as string}
                          onChange={(e) => setEmployeeInfo(prev => ({ ...prev, [key]: e.target.value }))}
                          className="bg-rose-50 border border-rose-300 text-rose-900 text-sm rounded-lg focus:ring-rose-500 focus:border-rose-500 p-1 dark:bg-rose-100 dark:border-rose-300 dark:placeholder-rose-400 dark:text-black"
                        />
                      ) : (
                        <span>{value as string}</span>
                      )}
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* <Card>
            <CardHeader>
              <CardTitle>Salon Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">Name:</span>
                  <span>{employeeInfo.salon.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Address:</span>
                  <span>{employeeInfo.salon.address}</span>
                </div>
              </div>
            </CardContent>
          </Card> */}

          {/* <Card>
            <CardHeader>
              <CardTitle>Specializations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {employeeInfo.specializations.map((spec) => (
                  <span key={spec.id} className="bg-rose-100 text-rose-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded">
                    {spec.name}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card> */}

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
  )
}

export default EmployeeDashboard