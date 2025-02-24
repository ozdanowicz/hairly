import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DayOfWeek, Schedule } from "@/apiService";
import { useTranslation } from 'react-i18next';

interface SalonScheduleViewProps {
  schedule: Schedule[];
}

const SalonScheduleView = ({ schedule }: SalonScheduleViewProps) => {
  const { t } = useTranslation();
  const [displaySchedule, setDisplaySchedule] = useState<Schedule[]>(schedule);

  useEffect(() => {
    if (schedule) {
      setDisplaySchedule(schedule);
    }
  }, [schedule]);

  const groupedSchedules = displaySchedule.reduce((acc, curr) => {
    const { dayOfWeek } = curr;
    if (!acc[dayOfWeek]) {
      acc[dayOfWeek] = [];
    }
    acc[dayOfWeek].push(curr);
    return acc;
  }, {} as Record<string, Schedule[]>);

  const sortedDays = Object.keys(groupedSchedules).sort((a, b) => {
    return Object.values(DayOfWeek).indexOf(a) - Object.values(DayOfWeek).indexOf(b);
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6 pt-6 bg-gray-100 mb-4 rounded-xl">
        <CardTitle>{t('schedule.title')}</CardTitle>
      </CardHeader>
      <CardContent>
        {displaySchedule.length > 0 ? (
          <ul className="space-y-4">
            {sortedDays.map((day) => (
              <li key={day} className="border-b pb-5 relative">
                <h3 className="font-semibold pb-1">{t(`days.${day}`)}</h3>
                {groupedSchedules[day].map((item, index) => (
                  <div key={index}>
                    <p className="text-sm text-gray-800">{t('schedule.open')}: {item.openingTime.slice(0, 5) || "N/A"}</p>
                    <p className="text-sm text-gray-800">{t('schedule.close')}: {item.closingTime.slice(0, 5) || "N/A"}</p>
                  </div>
                ))}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">{t('schedule.noSchedule')}</p>
        )}
      </CardContent>
    </Card>
  );
};

export default SalonScheduleView;