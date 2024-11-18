// AppointmentList.js
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card"; 
import { ScrollArea } from './ui/scroll-area';

const AppointmentCard = ({ title, appointments, loading, error, filterStatuses }) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-4 mb-2 bg-gray-100">
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-sm text-gray-500">Loading appointments...</p>
        ) : error ? (
          <p className="text-sm text-red-500">{error}</p>
        ) : (
          <ScrollArea className="h-[250px] pr-4">
            <ul className="space-y-4 rounded-xl border shadow-md p-3">
              {appointments
                .filter((appointment) => filterStatuses.includes(appointment.status))
                .map((appointment, index) => (
                  <li key={index} className="border-b border-gray-100 pb-4 last:border-b-0 last:pb-0">
                    <div className="flex justify-between">
                      <div className="text-sm font-bold pb-2">{appointment.serviceName}</div>
                      <div className="text-sm font-bold">${appointment.servicePrice}</div>
                    </div>
                    <div className="text-sm">
                      <p>Client: {appointment.clientFullName}</p>
                    </div>
                    <div className="text-sm text-gray-700">Status: {appointment.status}</div>
                    <div className="text-sm text-gray-700">
                      Appointment Date: {appointment.scheduledTime.slice(0, 5)}, {appointment.scheduledDate}
                    </div>
                  </li>
                ))}
            </ul>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};

export default AppointmentCard;
