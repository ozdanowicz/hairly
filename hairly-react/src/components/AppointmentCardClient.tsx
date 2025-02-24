import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

const AppointmentCardClient = ({ title, appointments, loading, error, filterStatuses, onReview }) => {
  const { t } = useTranslation();

  const filteredAppointments = appointments.filter((appointment) =>
    filterStatuses.includes(appointment.status)
  );

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-4 mb-2 bg-gray-100">
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-sm text-gray-500">{t("loading")}</p>
        ) : error ? (
          <p className="text-sm text-red-500">{error}</p>
        ) : filteredAppointments.length === 0 ? (
          <p className="text-sm text-gray-500">{t("noAppointments")}</p>
        ) : (
          <ScrollArea className="h-[250px] pr-4">
            <ul className="space-y-4 rounded-xl border shadow-md p-3">
              {filteredAppointments.map((appointment, index) => (
                <li key={index} className="border-b border-gray-100 pb-4 last:border-b-0 last:pb-0">
                  <div className="flex justify-between">
                    <div className="text-sm font-bold pb-2">{appointment.serviceName}</div>
                    <div className="text-sm font-bold">${appointment.servicePrice}</div>
                  </div>
                  <div className="text-sm">
                    <p>{t("appointment.employee")}: {appointment.employeeFullName}</p>
                    <p>{t("appointment.salon")}: {appointment.salonName}</p>
                  </div>
                  <div className="text-sm text-gray">{t("appointment.duration")}: {appointment.serviceDurationMinutes} min</div>
                  <div className="text-sm">{t("appointment.status")}: {appointment.status}</div>
                  <div className="text-sm text-gray-700">
                    {t("appointment.date")}: {appointment.scheduledTime.slice(0, 5)}, {appointment.scheduledDate}
                  </div>
                  {appointment.status === 'COMPLETED' && !appointment.reviewed && (
                    <div className="flex justify-end mt-2">
                      <Button size="sm" onClick={() => onReview(appointment.id)}>
                        {t("review.add")}
                      </Button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};

export default AppointmentCardClient;