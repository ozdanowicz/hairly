import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Scissors, Star } from 'lucide-react';
import { Salon, fetchSalonDetails, Service} from '../apiService';
import { fetchEmployeesBySalon, fetchSalonReviews, fetchSalonSchedule, fetchSalonServices } from '../salonService';
import { Employee, Review, Schedule } from '../apiService';
import EmployeesCard from './EmployeesCard.tsx';
import ImageCarousel from "./ImageCarousel";
import SalonServices from './SalonServices.tsx';
import LocationCard from './LocationCard.tsx';
import SalonScheduleView from './SalonScheduleView.tsx';

const SalonDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [salon, setSalon] = useState<Salon | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [schedule, setSchedule] = useState<Schedule[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ setSelectedService] = useState<Service | null>(null); // Track selected service

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
      } catch (err) {
        setError('Failed to load salon details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadSalon();
  }, [id]);

  if (loading) {
    return <div>Loading salon...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!salon) {
    return <div>No salon found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-[300px_1fr] gap-8">
        <div className="space-y-6">
          <Card>
            <CardHeader className="bg-gray-100 pt-4 pb-4 mb-3 rounded-xl">
              <CardTitle className="flex items-center gap-2">
                <Scissors className="w-6 h-6" />
                {salon.name}
              </CardTitle>
              </CardHeader>
              <CardContent>{salon.description}</CardContent>
          </Card>

          {/* Employees Section */}
          <EmployeesCard salonId={salon.id} isOwnerDashboard={false} />
          <Card>
            <CardHeader className="bg-gray-100 rounded-xl pt-4 pb-4 mb-3">
              <CardTitle>Recent Ratings</CardTitle>
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
          <LocationCard location={salon.location} />
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          <ImageCarousel images={salon.salonImages} />
          <SalonServices services={salon.services} setSelectedService={setSelectedService} />
          <SalonScheduleView schedule={schedule} />
        </div>
      </div>
    </div>
  );
};

export default SalonDetails;
