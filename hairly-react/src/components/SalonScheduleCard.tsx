import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Save, Edit, Plus, Trash, X } from "lucide-react";
import { DayOfWeek, ScheduleRequest, addSalonSchedule, updateSchedule, deleteSchedule, Schedule, ScheduleType } from "@/apiService";
import { toast } from "react-toastify";
import { Label } from "@/components/ui/label";

interface ScheduleCardProps {
  salonId: string;
  schedule: Schedule[];
  onSave: (updatedSchedule: Schedule[]) => void;
}

const SalonScheduleCard = ({ salonId, schedule, onSave }: ScheduleCardProps) => {
  const [editedSchedule, setEditedSchedule] = useState<Schedule[]>(schedule);
  const [isEditing, setIsEditing] = useState(false);
  const [newDay, setNewDay] = useState<ScheduleRequest | null>(null);

  useEffect(() => {
    if (schedule) {
      setEditedSchedule(schedule);
    }
  }, [schedule]);

  const handleTimeChange = (index: number, field: keyof ScheduleRequest, value: string) => {
    const updatedSchedule = [...editedSchedule];
    // Ensure the time is in "HH:mm" format
    updatedSchedule[index] = { ...updatedSchedule[index], [field]: value || null };
    setEditedSchedule(updatedSchedule);
  };
  

  const handleAddDay = () => {
    setNewDay({ dayOfWeek: DayOfWeek.MONDAY, openingTime: "", closingTime: ""});
  };

  const handleNewDayChange = (field: keyof ScheduleRequest, value: string) => {
    if (newDay) {
      // Save the time value as a simple string in "HH:mm" format
      setNewDay({ ...newDay, [field]: value || null });
    }
  };

  const doesOverlap = (start1: string, end1: string, start2: string, end2: string) => {
    const toMinutes = (time: string) => {
      const [hours, minutes] = time.split(":").map(Number);
      return hours * 60 + minutes;
    };
  
    const start1Min = toMinutes(start1);
    const end1Min = toMinutes(end1);
    const start2Min = toMinutes(start2);
    const end2Min = toMinutes(end2);
  
    // Check if times overlap
    return !(end1Min <= start2Min || end2Min <= start1Min);
  };

  const groupedSchedules = editedSchedule.reduce((acc, curr) => {
    const { dayOfWeek } = curr;
    if (!acc[dayOfWeek]) {
      acc[dayOfWeek] = [];
    }
    acc[dayOfWeek].push(curr);
    return acc;
  }, {} as Record<string, Schedule[]>);

  // Get the days sorted
  const sortedDays = Object.keys(groupedSchedules).sort((a, b) => {
    return Object.values(DayOfWeek).indexOf(a) - Object.values(DayOfWeek).indexOf(b);
  });
  
  
  const isTimeValid = (openingTime: string, closingTime: string) => {
    const convertToMinutes = (time: string) => {
      const [hours, minutes] = time.split(":").map(Number);
      return hours * 60 + minutes; 
    };
  
    const openingTimeInMinutes = convertToMinutes(openingTime);
    const closingTimeInMinutes = convertToMinutes(closingTime);
  
    return openingTimeInMinutes < closingTimeInMinutes;
  };
  


  const handleSaveNewDay = async () => {
    if (newDay) {
      if (!isTimeValid(newDay.openingTime, newDay.closingTime)) {
        toast.error("Opening time must be before closing time");
        return;
      }
  
      for (let i = 0; i < editedSchedule.length; i++) {
        const existingDay = editedSchedule[i];
        if (existingDay.dayOfWeek === newDay.dayOfWeek) {
          if (doesOverlap(newDay.openingTime, newDay.closingTime, existingDay.openingTime, existingDay.closingTime)) {
            toast.error(`The schedule for ${newDay.dayOfWeek.charAt(0).toUpperCase() + newDay.dayOfWeek.slice(1).toLowerCase()} overlaps with another schedule.`);
            return;
          } 
        }
      }
  
      try {
        newDay.type = ScheduleType.SALON;
        const savedDay = await addSalonSchedule(salonId, newDay);
        setEditedSchedule([...editedSchedule, savedDay]);
        setNewDay(null);
        toast.success("Day added successfully");
      } catch (error) {
        console.error("Error adding new day", error);
        toast.error("Failed to add new day");
      }
    }
  };
  

  const handleRemoveDay = async (scheduleId: number, index: number) => {
    try {
        await deleteSchedule(scheduleId);
        const updatedSchedule = editedSchedule.filter((_, i) => i !== index);
        setEditedSchedule(updatedSchedule);
        toast.success("Schedule removed successfully");
    } catch (error) {
        console.error("Error removing schedule", error);
        toast.error("Failed to remove schedule");
    }
    
  };

  const handleSave = async () => {
    try {
      // Check for any time overlap for each day
      for (let i = 0; i < editedSchedule.length; i++) {
        const day = editedSchedule[i];
  
        // Check if the current time range is valid
        if (!isTimeValid(day.openingTime, day.closingTime)) {
          toast.error("Opening time must be before closing time");
          return;
        }
  
        // Check for overlap with other days for the same day of the week
        for (let j = 0; j < editedSchedule.length; j++) {
          if (i !== j && day.dayOfWeek === editedSchedule[j].dayOfWeek) {
            const otherDay = editedSchedule[j];
            if (doesOverlap(day.openingTime, day.closingTime, otherDay.openingTime, otherDay.closingTime)) {
              toast.error(`The schedule for ${day.dayOfWeek.charAt(0).toUpperCase() + day.dayOfWeek.slice(1).toLowerCase()} overlaps with another schedule.`);
              return;
            }
          }
        }
  
        if (day.id) {
          await updateSchedule(day.id, day);
        }
      }
  
      onSave(editedSchedule);
      setIsEditing(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to save schedule");
    }
  };
  

  const handleCancel = () => {
    setEditedSchedule(schedule); // Reset to the initial schedule
    setIsEditing(false);
    setNewDay(null);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 pt-4 bg-gray-100 mb-4 rounded-xl">
        <CardTitle>Schedule</CardTitle>
        {isEditing ? (
          <div className="flex gap-2">
            <Button className="border-none bg-white rounded-xl" onClick={handleSave} variant="outline" size="sm">
              <Save className="w-4 h-4 mr-2" /> Save
            </Button>
            <Button className="border-none bg-white rounded-xl" onClick={handleCancel} variant="ghost" size="sm">
              <X className="w-4 h-4 mr-2" /> Cancel
            </Button>
          </div>
        ) : (
          <Button className="border-none bg-white rounded-xl" onClick={() => setIsEditing(true)} variant="outline" size="sm">
            <Edit className="w-4 h-4 mr-2" /> Edit
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {isEditing && (
          <Button
            className="mb-4 border-none bg-rose-600 text-white rounded-xl"
            onClick={handleAddDay}
            variant="outline"
            size="sm"
          >
            <Plus className="w-4 h-4" /> Add Day
          </Button>
        )}

        {newDay && (
          <div className="border-b pb-4 mb-4 relative">
            <Label className="font-bold">Day</Label>
            <select
              className="w-full p-2 border rounded mb-2"
              value={newDay.dayOfWeek}
              onChange={(e) => handleNewDayChange("dayOfWeek", e.target.value)}
            >
              {Object.values(DayOfWeek).map((day) => (
                <option key={day} value={day}>
                  {day.charAt(0).toUpperCase() + day.slice(1).toLowerCase()}
                </option>
              ))}
            </select>
            <Label className="font-bold">Opening Time</Label>
            <input
              className="w-full p-2 border rounded mb-2"
              type="time"
              value={newDay.openingTime || ""}
              onChange={(e) => handleNewDayChange("openingTime", e.target.value)}
            />
            <Label className="font-bold">Closing Time</Label>
            <input
              className="w-full p-2 border rounded mb-2"
              type="time"
              value={newDay.closingTime || ""}
              onChange={(e) => handleNewDayChange("closingTime", e.target.value)}
            />
            <Button className="absolute right-0 border-none bg-rose-400 text-white rounded-xl" onClick={handleSaveNewDay} variant="outline" size="sm">
              <Save className="w-4 h-4" /> Save
            </Button>
          </div>
        )}

        {editedSchedule.length > 0 ? (
          <ul className="space-y-4">
            {editedSchedule.map((day, index) => (
              <li key={day.id || index} className="border-b pb-5 relative">
                {isEditing ? (
                  <div className="space-y-3">
                    <div>
                      <Label className="font-bold">Day</Label>
                      <select
                        className="w-full p-2 border rounded mb-2"
                        value={day.dayOfWeek}
                        onChange={(e) => handleTimeChange(index, "dayOfWeek", e.target.value)}
                      >
                        {Object.values(DayOfWeek).map((dayOfWeek) => (
                          <option key={dayOfWeek} value={dayOfWeek}>
                            {dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1).toLowerCase()}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label className="font-bold">Opening Time</Label>
                      <input
                        className="w-full p-2 border rounded"
                        type="time"
                        value={day.openingTime || ""}
                        onChange={(e) => handleTimeChange(index, "openingTime", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label className="font-bold">Closing Time</Label>
                      <input
                        className="w-full p-2 border rounded"
                        type="time"
                        value={day.closingTime || ""}
                        onChange={(e) => handleTimeChange(index, "closingTime", e.target.value)}
                      />
                    </div>
                    <Button
                      className="absolute right-0 border-none bg-rose-700 text-white rounded-xl"
                      onClick={() => handleRemoveDay(day.id, index)}
                      variant="outline"
                      size="sm"
                    >
                      <Trash className="w-4 h-4" /> Delete
                    </Button>
                  </div>
                ) : (
                  <>
                    <h3 className="font-semibold">{day.dayOfWeek.charAt(0).toUpperCase() + day.dayOfWeek.slice(1).toLowerCase()}</h3>
                    <p>Open: {day.openingTime.slice(0,5) || "N/A"}</p>
                    <p>Close: {day.closingTime.slice(0,5) || "N/A"}</p>
                  </>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No schedule available.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default SalonScheduleCard;
