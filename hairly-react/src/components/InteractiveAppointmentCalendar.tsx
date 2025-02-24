import { format } from 'date-fns';
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AvailableAppointment } from '@/apiService';

interface InteractiveSalonCalendarProps {
  availableDates: AvailableAppointment[]; 
  selectedDate: Date | null; 
  setSelectedDate: (date: Date | null) => void; 
  selectedTime: string | null; 
  setSelectedTime: (time: string | null) => void; 
}

export function InteractiveSalonCalendarComponent({
  availableDates,
  selectedDate,
  setSelectedDate,
  selectedTime,
  setSelectedTime,
}: InteractiveSalonCalendarProps) {
  const isDateAvailable = (date: Date): boolean => {
    const formattedDate = format(date, "yyyy-MM-dd");
    return availableDates.some((availableDate) => availableDate.date === formattedDate);
  };
  const getAvailableTimesForDate = (date: Date): string[] => {
    const formattedDate = format(date, "yyyy-MM-dd");
    const matchingDate = availableDates.find(
      (availableDate) => availableDate.date === formattedDate
    );
    return matchingDate ? matchingDate.availableTimes : [];
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="space-y-6 mt-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Available Date
          </label>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => {
              setSelectedDate(date);
              setSelectedTime(null); 
            }}
            className="rounded-xl border border-gray-200"
            modifiers={{
              available: (date) => isDateAvailable(date), 
              selected: (date) =>
                selectedDate && date.toDateString() === selectedDate.toDateString(), 
            }}
            modifiersStyles={{
              available: {
                backgroundColor: 'rgba(52, 211, 153, 0.1)', 
                borderRadius: '50%',
                border: '2px solid #34D399', 
              },
              selected: {
                backgroundColor: 'rgba(255, 0, 0, 0.2)', 
                borderRadius: '50%',
                border: '2px solid #FF0000', 
              },
            }}
            disabled={(date) => !isDateAvailable(date)}
          />
        </div>

        {selectedDate && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Available Times for {format(selectedDate, "MMMM d, yyyy")}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {getAvailableTimesForDate(selectedDate).map((availableTime) => (
                <Button
                  key={availableTime}
                  variant={selectedTime === availableTime ? "outline" : "default"}
                  onClick={() => setSelectedTime(availableTime)}
                  className="rounded-xl"
                >
                  {availableTime.slice(0,5)} 
                </Button>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}