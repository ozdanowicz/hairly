import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { fetchClientAppointments, fetchClientReviews, ClientAppointment, Review, submitReview, ReviewRequest, updateAppointmentStatus, AppointmentStatus, isAppointmentReviewed } from '@/apiService';
import { toast } from 'react-toastify';
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Star } from "lucide-react";
import PersonalInfoCard from "./PersonalInfoCard";
import { useTranslation } from 'react-i18next';
import AppointmentCardClient from './AppointmentCardClient';

interface ClientInfo {
  id: number;
  name: string;
  surname: string;
  phone: string;
  email: string;
}

interface ClientDashboardProps {
  user: ClientInfo;
}

export function ClientDashboard({ user }: ClientDashboardProps) {
  const { t } = useTranslation();
  const [clientInfo, setClientInfo] = useState<ClientInfo>({
    id: user.id,
    name: user.name,
    surname: user.surname,
    phone: user.phone,
    email: user.email,
  });

  const [appointments, setAppointments] = useState<ClientAppointment[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loadingReviews, setLoadingReviews] = useState<boolean>(true);
  const [loadingAppointments, setLoadingAppointments] = useState<boolean>(true);
  const [appointmentId, setAppointmentId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoadingAppointments(true);
        const fetchedAppointments = await fetchClientAppointments(user.id);
        const appointmentsWithReviewStatus = await Promise.all(
          fetchedAppointments.map(async (appointment) => {
            const reviewed = await isAppointmentReviewed(appointment.id);
            return { ...appointment, reviewed };
          })
        );
        setAppointments(appointmentsWithReviewStatus);
        await updateOutdatedAppointments(appointmentsWithReviewStatus);
      } catch (error) {
        console.error("Error fetching appointments:", error);
        setError(t('clientDashboard.failedToLoadAppointments'));
      } finally {
        setLoadingAppointments(false);
      }

      try {
        setLoadingReviews(true);
        const fetchedReviews = await fetchClientReviews(user.id);
        setReviews(fetchedReviews);
      } catch (error) {
        console.error("Error fetching reviews:", error);
        setError(t('clientDashboard.failedToLoadReviews'));
      } finally {
        setLoadingReviews(false);
      }
    };

    loadData();
  }, [user.id]);

  const updateOutdatedAppointments = async (appointments: ClientAppointment[]) => {
    const now = new Date();
    for (const appointment of appointments) {
      const appointmentDate = new Date(`${appointment.scheduledDate}T${appointment.scheduledTime}`);
      if (appointmentDate < now && appointment.status !== AppointmentStatus.COMPLETED) {
        try {
          await updateAppointmentStatus(appointment.id, AppointmentStatus.COMPLETED);
        } catch (error) {
          console.error("Failed to update appointment status:", error);
        }
      }
    }
  };

  const handleOpenReviewModal = (id: number) => {
    setAppointmentId(id);
    setIsReviewModalOpen(true);
  };

  const handleCloseReviewModal = () => {
    setIsReviewModalOpen(false);
    setAppointmentId(null);
    setRating(0);
    setReviewText("");
  };

  const handleSubmitReview = async () => {
    console.log("SubmitReview", appointmentId, rating, reviewText);
    if (appointmentId === null) {
      console.error("Appointment ID is missing");
      return;
    }

    try {
      const reviewRequest: ReviewRequest = {
        rating,
        comment: reviewText,
      };

      await submitReview(appointmentId, user.id, reviewRequest);
      toast.success(t('clientDashboard.reviewSubmitted'));
      handleCloseReviewModal();
      // Update the reviewed status of the appointment
      setAppointments((prevAppointments) =>
        prevAppointments.map((appointment) =>
          appointment.id === appointmentId ? { ...appointment, reviewed: true } : appointment
        )
      );
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error(t('clientDashboard.failedToSubmitReview'));
    }
  };

  return (
    <section className="bg-rose-50 min-h-screen p-4 md:p-8 lg:p-12">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-6 md:p-8 dark:bg-rose-200 dark:border-rose-700">
        <h1 className="text-3xl font-bold text-rose-900 mb-8 dark:text-black">
          {t('clientDashboard.title')}
        </h1>

        <div className="grid gap-8 md:grid-cols-2">
          <PersonalInfoCard
            info={clientInfo}
            editMode={editMode}
            onEdit={() => setEditMode(true)}
            onSave={() => setEditMode(false)}
            isEmailEditable={false}
          />
          <AppointmentCardClient
            title={t('clientDashboard.upcomingAppointments')}
            appointments={appointments}
            loading={loadingAppointments}
            error={error}
            filterStatuses={['UPCOMING', 'CONFIRMED']}
            onReview={handleOpenReviewModal}
          />  
          <AppointmentCardClient
            title={t('clientDashboard.completedAppointments')}
            appointments={appointments}
            loading={loadingAppointments}
            error={error}
            filterStatuses={['COMPLETED']}
            onReview={handleOpenReviewModal}
          />

          <AppointmentCardClient
            title={t('clientDashboard.canceledAppointments')}
            appointments={appointments}
            loading={loadingAppointments}
            error={error}
            filterStatuses={['CANCELLED']}
            onReview={handleOpenReviewModal}
          />

        </div>
      </div>

      {isReviewModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
            <h2 className="text-xl font-medium mb-4">{t('clientDashboard.submitReview')}</h2>

            {/* Review Form */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="rating">{t('clientDashboard.rating')}</Label>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-6 h-6 cursor-pointer transition-colors duration-200 ${
                        star <= (hoverRating || rating)
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300"
                      }`}
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                    />
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="review">{t('clientDashboard.review')}</Label>
                <Textarea
                  id="review"
                  placeholder={t('clientDashboard.writeReview')}
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  required
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  className="rounded-xl bg-gray-100"
                  variant="ghost"
                  size="sm"
                  onClick={handleCloseReviewModal}
                >
                  {t('button.cancel')}
                </Button>
                <Button
                  className="rounded-xl bg-rose-500 text-white"
                  size="sm"
                  onClick={handleSubmitReview}
                >
                  {t('button.add')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default ClientDashboard;