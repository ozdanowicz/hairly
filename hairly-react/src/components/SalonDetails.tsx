import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Scissors, Star } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Salon, fetchSalonDetails, Service, fetchEmployeeDetails } from '../apiService';
import { fetchEmployeesBySalon, fetchSalonReviews, fetchSalonSchedule, fetchSalonServices } from '../salonService';
import { Employee, Review, Schedule } from '../apiService';
import EmployeesCard from './EmployeesCard.tsx';
import ImageCarousel from "./ImageCarousel";
import SalonServices from './SalonServices.tsx';
import LocationCard from './LocationCard.tsx';
import SalonScheduleView from './SalonScheduleView.tsx';
import ReactDOM from 'react-dom';
import SalonAppointmentBooking from './AppointmentBooking.tsx';

const SalonDetails: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const [salon, setSalon] = useState<Salon | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [schedule, setSchedule] = useState<Schedule[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [setSelectedService] = useState<Service | null>(null); 

  useEffect(() => {
    const loadSalon = async () => {
      try {
        const data = await fetchSalonDetails(Number(id));
        setSalon(data);
        const reviewsData = await fetchSalonReviews(Number(id));
        setReviews(reviewsData);

        const scheduleData = await fetchSalonSchedule(Number(id));
        setSchedule(scheduleData);

        const servicesData = await fetchSalonServices(Number(id));
        setServices(servicesData);

        const employeeList = await fetchEmployeesBySalon(Number(id));
        const detailedEmployees = await Promise.all(
          employeeList.map(async (employee) => {
            const detailedEmployee = await fetchEmployeeDetails(employee.id);
            return detailedEmployee;
          })
        );
        setEmployees(detailedEmployees);
      } catch (err) {
        setError(t('error.loadingSalonDetails'));
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadSalon();
  }, [id, t]);

  if (loading) {
    return <div>{t('loadingSalon')}</div>;
  }

  if (error) {
    return <div>{t('error')}: {error}</div>;
  }

  if (!salon) {
    return <div>{t('noSalonFound')}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-[400px_1fr] gap-8">
        <div className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pt-4 pb-4 mb-3 bg-gray-100 rounded-xl">
              <CardTitle className="flex items-center gap-2">
                <Scissors className="w-6 h-6" />
                {salon.name}
                <Button 
            onClick={() => setShowBookingModal(true)} 
            className="rounded-xl ml-16 bg-rose-700 text-white hover:bg-rose-800">
            {t('bookAppointment')}
          </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>{salon.description}</CardContent>
          </Card>

          <EmployeesCard salonId={id} isOwnerDashboard={false} />
          <Card>
            <CardHeader className="bg-gray-100 rounded-xl pt-4 pb-4 mb-3">
              <CardTitle>{t('recentRatings')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reviews?.map((review) => (
                  <div key={review.id} className="border-b pb-4 last:border-b-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">{review.author?.name}</p>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{review.comment}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <SalonScheduleView schedule={schedule} />
          {showBookingModal && ReactDOM.createPortal(
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 rounded-xl">
              <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full relative max-h-[80vh] overflow-y-auto">
                <button 
                  className="absolute top-4 right-4 text-gray-900 hover:text-gray-700"
                  onClick={() => setShowBookingModal(false)}
                >
                  ✕
                </button>
                <SalonAppointmentBooking 
                  employees={employees} 
                  services={services} 
                  salonId={parseInt(id, 10)}
                />
              </div>
            </div>,
            document.body
          )}
        </div>

        <div className="space-y-8">
          <ImageCarousel images={salon.salonImages} />
          <SalonServices services={salon.services} setSelectedService={setSelectedService} />
          <LocationCard salonId={id} isOwner={false} />
        </div>
      </div>
    </div>
  );
};

export default SalonDetails;
