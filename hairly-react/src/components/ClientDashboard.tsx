'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Pen, Save } from "lucide-react"
import { fetchClientAppointments, fetchClientReviews, Appointment, Review } from '@/apiService'
import RatingStars from './RatingStars'

interface ClientInfo {
  id: number
  name: string
  surname: string
  phone: string
  email: string
}

interface ClientDashboardProps {
  user: ClientInfo;
}

export function ClientDashboard({ user }: ClientDashboardProps) {
  const [clientInfo, setClientInfo] = useState<ClientInfo>({ ...user });

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loadingAppointments, setLoadingAppointments] = useState<boolean>(true);
  const [loadingReviews, setLoadingReviews] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false)

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

  const handleEdit = () => setEditMode(true)
  const handleSave = () => setEditMode(false)

  return (
    <section className="bg-rose-50 min-h-screen p-4 md:p-8 lg:p-12">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-6 md:p-8 dark:bg-rose-200 dark:border-rose-700">
        <h1 className="text-3xl font-bold text-rose-900 mb-8 dark:text-black">
          Client Dashboard
        </h1>

        <div className="grid gap-8 md:grid-cols-2">
          <Card className="md:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xl font-bold">Personal Information</CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={editMode ? handleSave : handleEdit}
              >
                {editMode ? <Save className="h-5 w-5" /> : <Pen className="h-5 w-5" />}
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {Object.entries(clientInfo).map(([key, value]) =>
                  key !== 'userId' && (
                    <div key={key} className="flex flex-col space-y-1">
                      <span className="font-semibold text-gray-700">{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                      {editMode ? (
                        <input
                          type="text"
                          value={value}
                          onChange={(e) => setClientInfo((prev) => ({ ...prev, [key]: e.target.value }))}
                          className="bg-rose-50 border border-rose-300 text-rose-900 text-sm rounded-lg focus:ring-rose-500 focus:border-rose-500 p-2 dark:bg-rose-100 dark:border-rose-300 dark:placeholder-rose-400 dark:text-black"
                        />
                      ) : (
                        <span className="text-gray-600">{value}</span>
                      )}
                    </div>
                  )
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-bold">Upcoming Appointments</CardTitle>
            </CardHeader>
            <CardContent>
              {loadingAppointments ? (
                <p className="text-gray-500">Loading appointments...</p>
              ) : appointments.length > 0 ? (
                <ul className="space-y-4">
                  {appointments.map((appointment, index) => (
                    <li key={index} className="border-b pb-4">
                      <div className="grid gap-2">
                        <div className="flex justify-between">
                          <span className="font-semibold">Date:</span>
                          <span className="text-gray-500">{appointment.scheduledTime.slice(11,16)}, {appointment.scheduledTime.slice(0, 10)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-semibold">Status:</span>
                          <span className="text-gray-500">{appointment.status.toLocaleLowerCase()}</span>
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
                <p className="text-gray-500">No upcoming appointments</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-bold">Your Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              {loadingReviews ? (
                <p className="text-gray-500">Loading reviews...</p>
              ) : reviews.length > 0 ? (
                <ul className="space-y-4">
                  {reviews.map((review, index) => (
                    <li key={index} className="border-b pb-4">
                      <div className="grid gap-2">
                        <div className="flex justify-between">
                          <span className="font-semibold">Salon:</span>
                          <span className="text-gray-500">{review.salonName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-semibold">Rating:</span>
                          <RatingStars rating={review.rating}></RatingStars>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-semibold">Date:</span>
                          <span className="text-gray-500">{review.createdAt.slice(0,10)}</span>
                        </div>
                        <p className="mt-2 text-gray-500">{review.comment}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No reviews yet</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
export default ClientDashboard;