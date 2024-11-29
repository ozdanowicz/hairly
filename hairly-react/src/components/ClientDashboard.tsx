'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { fetchClientAppointments, fetchClientReviews, ClientAppointment, Review, submitReview, ReviewRequest } from '@/apiService';
import { toast } from 'react-toastify';
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Star } from "lucide-react";
import PersonalInfoCard from "./PersonalInfoCard";

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
        setAppointments(fetchedAppointments);
      } catch (error) {
        console.error("Error fetching appointments:", error);
        setError("Failed to load appointments");
      } finally {
        setLoadingAppointments(false);
      }

      try {
        setLoadingReviews(true);
        const fetchedReviews = await fetchClientReviews(user.id);
        setReviews(fetchedReviews);
      } catch (error) {
        console.error("Error fetching reviews:", error);
        setError("Failed to load reviews");
      } finally {
        setLoadingReviews(false);
      }
    };

    loadData();
  }, [user.id]);


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
      toast.success("Review submitted successfully");
      handleCloseReviewModal(); // Close the modal after submission
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Failed to submit review");
    }
  };

  const categorizedAppointments = appointments.reduce<{
    completed: ClientAppointment[];
    canceled: ClientAppointment[];
    other: ClientAppointment[];
  }>(
    (acc, appointment) => {
      if (appointment.status === "COMPLETED") {
        acc.completed.push(appointment);
      } else if (appointment.status === "CANCELED") {
        acc.canceled.push(appointment);
      } else {
        acc.other.push(appointment);
      }
      return acc;
    },
    { completed: [], canceled: [], other: [] }
  );

  return (
    <section className="bg-rose-50 min-h-screen p-4 md:p-8 lg:p-12">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-6 md:p-8 dark:bg-rose-200 dark:border-rose-700">
        <h1 className="text-3xl font-bold text-rose-900 mb-8 dark:text-black">
          Client Dashboard
        </h1>

        <div className="grid gap-8 md:grid-cols-2">
          <PersonalInfoCard
            info={clientInfo}
            editMode={editMode}
            onEdit={() => setEditMode(true)}
            onSave={() => setEditMode(false)}
            isEmailEditable={false}
          />

          {/* Completed Appointments */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-4 mb-4 bg-gray-100">
              <CardTitle className="font-bold">Completed Appointments</CardTitle>
            </CardHeader>
            <CardContent>
              {categorizedAppointments.completed.length > 0 ? (
                <ul className="space-y-4">
                  {categorizedAppointments.completed.map((appointment) => (
                    <li key={appointment.id} className="border-b pb-4">
                      <div className="grid gap-2">
                        <div className="flex justify-between">
                          <span className="font-semibold">Date:</span>
                          <span className="text-gray-500">{appointment.scheduledDate}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-semibold">Service:</span>
                          <span className="text-gray-500">{appointment.serviceName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-semibold">Salon:</span>
                          <span className="text-gray-500">{appointment.salonName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-semibold">ID:</span>
                          <span className="text-gray-500">{appointment.id}</span>
                        </div>
                        {!appointment.reviewId && (
                          <Button onClick={() => handleOpenReviewModal(appointment.id)}>
                            Add Review
                          </Button>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No completed appointments</p>
              )}
            </CardContent>
          </Card>
          {isReviewModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
            <h2 className="text-xl font-medium mb-4">Submit Your Review</h2>

            {/* Review Form */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="rating">Rating</Label>
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
                <Label htmlFor="review">Review</Label>
                <Textarea
                  id="review"
                  placeholder="Write your review here"
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
                  Cancel
                </Button>
                <Button
                  className="rounded-xl bg-rose-500 text-white"
                  size="sm"
                  onClick={handleSubmitReview}
                >
                  Submit
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

          {/* Canceled Appointments */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-4 mb-4 bg-gray-100">
              <CardTitle className="font-bold">Canceled Appointments</CardTitle>
            </CardHeader>
            <CardContent>
              {categorizedAppointments.canceled.length > 0 ? (
                <ul className="space-y-4">
                  {categorizedAppointments.canceled.map((appointment) => (
                    <li key={appointment.id} className="border-b pb-4">
                      <div className="grid gap-2">
                        <div className="flex justify-between">
                          <span className="font-semibold">Date:</span>
                          <span className="text-gray-500">{appointment.scheduledDate}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-semibold">Service:</span>
                          <span className="text-gray-500">{appointment.serviceName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-semibold">Salon:</span>
                          <span className="text-gray-500">{appointment.salonName}</span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No canceled appointments</p>
              )}
            </CardContent>
          </Card>

          {/* Other Appointments */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-4 mb-4 bg-gray-100">
              <CardTitle className="font-bold">Other Appointments</CardTitle>
            </CardHeader>
            <CardContent>
              {categorizedAppointments.other.length > 0 ? (
                <ul className="space-y-4">
                  {categorizedAppointments.other.map((appointment) => (
                    <li key={appointment.id} className="border-b pb-4">
                      <div className="grid gap-2">
                        <div className="flex justify-between">
                          <span className="font-semibold">Date:</span>
                          <span className="text-gray-500">{appointment.scheduledDate}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-semibold">Service:</span>
                          <span className="text-gray-500">{appointment.serviceName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-semibold">Salon:</span>
                          <span className="text-gray-500">{appointment.salonName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-semibold">Status:</span>
                          <span className="text-gray-500">{appointment.status}</span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No other appointments</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

export default ClientDashboard;