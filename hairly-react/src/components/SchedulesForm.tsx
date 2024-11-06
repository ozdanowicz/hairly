import { useState } from "react";
import {Button } from "@/components/ui/button";
import {Input } from "@/components/ui/input";
import {Label } from "@/components/ui/label";
import { updateSalonSchedule } from "@/apiService";

function ScheduleForm({ salonId, schedule, onSave }) {
  const [scheduleState, setScheduleState] = useState(schedule);

  const handleChange = (index, field, value) => {
    const updatedSchedule = [...scheduleState];
    updatedSchedule[index][field] = value;
    setScheduleState(updatedSchedule);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateSalonSchedule(salonId, scheduleState);
    onSave(); // Notify parent of update success
  };

  return (
    <form onSubmit={handleSubmit}>
      {scheduleState.map((day, index) => (
        <div key={index}>
          <Label>{day.dayOfWeek}</Label>
          <Input
            type="time"
            value={day.openingTime}
            onChange={(e) => handleChange(index, "openingTime", e.target.value)}
          />
          <Input
            type="time"
            value={day.closingTime}
            onChange={(e) => handleChange(index, "closingTime", e.target.value)}
          />
        </div>
      ))}
      <Button type="submit">Save Schedule</Button>
    </form>
  );
}

export default ScheduleForm;
