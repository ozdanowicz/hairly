import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Save, Edit, Plus, Trash, X } from "lucide-react";
import { DayOfWeek, ScheduleRequest, addEmployeeSchedule, fetchEmployeeSchedule, updateSchedule, deleteSchedule, Schedule, ScheduleType } from "@/apiService";
import { toast } from "react-toastify";
import { Label } from "@/components/ui/label";
import { useTranslation } from 'react-i18next';


interface EmployeeScheduleCardProps {
  employeeId: string;
  schedules: Schedule[];
  onSave: (updatedSchedule: Schedule[]) => void;
}

const EmployeeScheduleCard = ({ employeeId, schedules: schedule, onSave }: EmployeeScheduleCardProps) => {
  const [editedSchedule, setEditedSchedule] = useState<Schedule[]>(schedule);
  const [isEditing, setIsEditing] = useState(false);
  const [newDay, setNewDay] = useState<ScheduleRequest | null>(null);
  const {t} = useTranslation();

  useEffect(() => {
    if (schedule) {
      setEditedSchedule(schedule);
    }
  }, [schedule]);

  const handleTimeChange = (index: number, field: keyof ScheduleRequest, value: string) => {
    const updatedSchedule = [...editedSchedule];
    updatedSchedule[index] = { ...updatedSchedule[index], [field]: value || null };
    setEditedSchedule(updatedSchedule);
  };

  const handleAddDay = () => {
    setNewDay({ dayOfWeek: DayOfWeek.MONDAY, openingTime: "", closingTime: "" });
  };

  const handleNewDayChange = (field: keyof ScheduleRequest, value: string) => {
    if (newDay) {
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

    return !(end1Min <= start2Min || end2Min <= start1Min);
  };

  const groupedSchedules = Array.isArray(editedSchedule) ? editedSchedule.reduce((acc, curr) => {
    const { dayOfWeek } = curr;
    if (!acc[dayOfWeek]) {
      acc[dayOfWeek] = [];
    }
    acc[dayOfWeek].push(curr);
    return acc;
  }, {} as Record<string, Schedule[]>) : {};
  

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
        newDay.type = ScheduleType.EMPLOYEE;
        const savedDay = await addEmployeeSchedule(Number(employeeId), newDay);
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
      for (let i = 0; i < editedSchedule.length; i++) {
        const day = editedSchedule[i];

        if (!isTimeValid(day.openingTime, day.closingTime)) {
          toast.error("Opening time must be before closing time");
          return;
        }

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
    setEditedSchedule(schedule);
    setIsEditing(false);
    setNewDay(null);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 pt-4 bg-gray-100 mb-4 rounded-xl">
        <CardTitle>{t('schedule.yourSchedule')}</CardTitle>
        {isEditing ? (
          <div className="flex gap-2">
            <Button className="border-none bg-white rounded-xl" onClick={handleSave} variant="outline" size="sm">
              <Save className="w-4 h-4 mr-2" /> {t('button.save')}
            </Button>
            <Button className="border-none bg-white rounded-xl" onClick={handleCancel} variant="ghost" size="sm">
              <X className="w-4 h-4 mr-2" /> {t('button.cancel')}
            </Button>
          </div>
        ) : (
          <Button className="border-none bg-white rounded-xl" onClick={() => setIsEditing(true)} variant="outline" size="sm">
            <Edit className="w-4 h-4 mr-2" /> {t('button.edit')}
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
            <Plus className="w-4 h-4" /> {t('button.addDay')}
          </Button>
        )}

        {newDay && (
          <div className="border-b pb-4 mb-4 relative">
            <Label className="font-bold"> {t('schedule.day')}</Label>
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
            <Label className="font-bold"> {t('schedule.open')}</Label>
            <input
              className="w-full p-2 border rounded mb-2"
              type="time"
              value={newDay.openingTime || ""}
              onChange={(e) => handleNewDayChange("openingTime", e.target.value)}
            />
            <Label className="font-bold"> {t('schedule.close')}</Label>
            <input
              className="w-full p-2 border rounded mb-2"
              type="time"
              value={newDay.closingTime || ""}
              onChange={(e) => handleNewDayChange("closingTime", e.target.value)}
            />
            <Button
              className="border-none bg-green-500 text-white rounded-xl"
              onClick={handleSaveNewDay}
              variant="outline"
              size="sm"
            >
              {t('button.save')}
            </Button>
          </div>
        )}

        {sortedDays.map((day) => {
          const daySchedule = groupedSchedules[day];
          return (
            <div key={day} className="mb-4">
              <h3 className="font-bold mb-2">
                {day.charAt(0).toUpperCase() + day.slice(1).toLowerCase()}
              </h3>
              {daySchedule.map((sched, index) => (
                <div key={sched.id} className="flex justify-between mb-1 items-center">
                  <span className="text-sm text-gray-800">
                    {sched.openingTime.slice(0,5)} - {sched.closingTime.slice(0,5)}
                  </span>
                  {isEditing && (
                    <Button
                      className="bg-red-500 text-white rounded-xl"
                      onClick={() => handleRemoveDay(sched.id, index)}
                      variant="outline"
                      size="sm"
                    >
                      <Trash className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default EmployeeScheduleCard;
