import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Save } from "lucide-react";
import { Schedule, fetchEmployeeByUser, fetchEmployeeAppointments, fetchEmployeeSpecializations, Specialization, fetchEmployeeSalon, fetchEmployeeSchedule, EmployeeAppointment, updateUserPersonalInfo, updateAppointmentStatus, AppointmentStatus } from '@/apiService';
import { fetchSalonSchedule } from '@/salonService';
import EmployeeScheduleCard from './EmployeeScheduleCard';
import SalonScheduleView from './SalonScheduleView';
import AppointmentCardEmployee from './AppointmentCardEmployee';
import { toast } from 'react-toastify';
import PersonalInfoCard from './PersonalInfoCard';
import { useTranslation } from 'react-i18next';

interface EmployeeInfo {
  id: number;
  name: string;
  surname: string;
  email: string;
  phone: string;
}

interface EmployeeDashboardProps {
  user: EmployeeInfo;
}

export function EmployeeDashboard({ user }: EmployeeDashboardProps) {
  const { t } = useTranslation();
  const [employeeInfo, setEmployeeInfo] = useState<EmployeeInfo>({
    id: user.id,
    name: user.name,
    surname: user.surname,
    phone: user.phone,
    email: user.email,
  });
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [salonSchedules, setSalonSchedules] = useState<Schedule[]>([]);
  const [specializations, setSpecializations] = useState<Specialization[]>([]);
  const [appointments, setAppointments] = useState<EmployeeAppointment[]>([]);
  const [loading, setLoading] = useState({ appointments: true, specializations: true });
  const [error, setError] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const fetchedAppointments = await fetchEmployeeAppointments(user.id);
        setAppointments(fetchedAppointments);
        await updateOutdatedAppointments(fetchedAppointments);
      } catch (error) {
        setError(t('employeeDashboard.failedToLoadAppointments'));
      } finally {
        setLoading((prev) => ({ ...prev, appointments: false }));
      }

      try {
        const fetchedSchedules = await fetchEmployeeSchedule(user.id);
        setSchedules(fetchedSchedules);
      } catch (error) {
        setError(t('employeeDashboard.failedToLoadSchedules'));
      }

      try {
        const fetchedEmployee = await fetchEmployeeByUser(user.id);
        const salonId = await fetchEmployeeSalon(fetchedEmployee.id);
        if (salonId) {
          const fetchedSalonSchedules = await fetchSalonSchedule(salonId);
          setSalonSchedules(fetchedSalonSchedules);
        }
      } catch (error) {
        setError(t('employeeDashboard.failedToLoadSalonOrEmployeeData'));
      }

      try {
        const fetchedSpecializations = await fetchEmployeeSpecializations(user.id);
        setSpecializations(fetchedSpecializations);
      } catch (error) {
        setError(t('employeeDashboard.failedToLoadSpecializations'));
      } finally {
        setLoading((prev) => ({ ...prev, specializations: false }));
      }
    };

    loadData();
  }, [user.id]);

  const updateOutdatedAppointments = async (appointments: EmployeeAppointment[]) => {
    const now = new Date();
    for (const appointment of appointments) {
      const appointmentDate = new Date(`${appointment.scheduledDate}T${appointment.scheduledTime}`);
      if (appointmentDate < now && appointment.status !== AppointmentStatus.COMPLETED) {
        try {
          await updateAppointmentStatus(appointment.id, AppointmentStatus.COMPLETED);
          console.log(`Updated appointment ${appointment.id} to COMPLETED`);
        } catch (error) {
          console.error("Failed to update appointment status:", error);
        }
      }
    }
  };

  const handleEdit = () => setEditMode(true);

  const handleSave = (updatedInfo: EmployeeInfo) => {
    try {
      setEmployeeInfo(updatedInfo); 
      updateUserPersonalInfo(user.id, updatedInfo); 
      toast.success(t('employeeDashboard.personalInfoUpdated'));
      setEditMode(false);
    } catch (error) {
      console.error("Failed to save updated info:", error);
      setError(t('employeeDashboard.failedToUpdatePersonalInfo'));
      toast.error(t('employeeDashboard.failedToUpdatePersonalInfo'));
    }
  };

  return (
    <section className="bg-cover bg-rose-50 bg-center min-h-screen flex items-center justify-center px-4 py-4">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg dark:border md:mt-0 p-6 dark:bg-rose-200 dark:border-rose-700 opacity-95">
        <h1 className="text-2xl font-bold leading-tight tracking-tight text-rose-900 mb-6 dark:text-black">
          {t('employeeDashboard.title')}
        </h1>
        <div className="grid gap-6 md:grid-cols-2">
        <PersonalInfoCard
          info={employeeInfo}
          editMode={editMode}
          onEdit={handleEdit}
          onSave={handleSave}
          isEmailEditable={false}
        />
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-4 pb-4 mb-2 bg-gray-100">
            <CardTitle>{t('employeeDashboard.specializations')}</CardTitle>
            </CardHeader>
            <CardContent>
              {loading.specializations ? (
                <p>{t('employeeDashboard.loadingSpecializations')}</p>
              ) : error ? (
                <p className="text-red-500">{error}</p>
              ) : (
                <div>
                  {specializations.map((spec) => (
                    <Card className="grid mx:grid-rows-2 mx:grid-cols-2 mb-2 shadow-sm">
                   <div className="rounded-xl bg-gray-50 border text-gray-800">
                   <nav className="flex flex-row-2 p-1">
                     <div className="items-center rounded-xl">
                     <CardHeader className="px-2 py-2">
                      <CardTitle>
                      <span className="text-md p-1" key={spec.specialization}>
                      {spec.specialization?.charAt(0).toUpperCase() + spec.specialization?.slice(1).toLowerCase()}
                    </span>
                    </CardTitle>
                    </CardHeader>
                    <div>
                      <CardContent className="py-3">
                      <ul className="text-sm text-gray-800 space-y-1">
                        {spec.services && spec.services.length > 0 ? (
                          spec.services.map((service) => (
                            <li
                              key={service.id}
                              className="flex items-center rounded-lg text-gray-700 text-sm font-medium"
                            >
                              <span className="truncate">{service.name}</span>
                            </li>
                          ))
                        ) : (
                          <li className="italic text-gray-500">{t('employeeDashboard.noServicesAvailable')}</li>
                        )}
                      </ul>
                      </CardContent>
                      </div>
                     </div>
                   </nav>
                 </div>
                 </Card>
                  ))}
              </div>
              )}
            </CardContent>
          </Card>
         <AppointmentCardEmployee title={t('employeeDashboard.upcomingAppointments')} appointments={appointments} loading={loading.appointments} error={error} filterStatuses={['CONFIRMED', 'UPCOMING']}/>
         <AppointmentCardEmployee title={t('employeeDashboard.pastAppointments')} appointments={appointments} loading={loading.appointments} error={error} filterStatuses={['COMPLETED', 'CANCELLED']}/>
         <EmployeeScheduleCard employeeId={employeeInfo.id} schedules={schedules}></EmployeeScheduleCard>
         <SalonScheduleView schedule={salonSchedules} />
         <Card className="overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2 pb-2 mb-2 bg-gray-100">
              <CardTitle>
              <div className="flex items-center">
                <img className="mr-2 w-6 h-6 " src="/src/assets/google-calendar.png"></img>
                <h3 className="font-bold">{t('employeeDashboard.googleCalendar')}</h3>
              </div>
              </CardTitle>
               </CardHeader>
            <CardContent>
              <p className="text-gray-800 text-sm mb-4">{t('employeeDashboard.syncGoogleCalendar')}</p>
              <Button 
                variant="outline"
                className="justify-center rounded-xl text-white bg-rose-500 shadow border-non hover:bg-rose-600 hover:text-white"
                onClick={() => window.open('https://calendar.google.com', '_blank')}
              >
                {t('employeeDashboard.goToGoogleCalendar')}
              </Button>
            </CardContent>
          </Card>        
          </div>
      </div>
    </section>
  );
}

export default EmployeeDashboard;