import { useState } from "react";
import {Button } from "@/components/ui/button";
import {Input } from "@/components/ui/input";
import {Label } from "@/components/ui/label";
import { updateSalonLocation } from "@/apiService";

function LocationForm({ salonId, location, onSave }) {
  const [formState, setFormState] = useState(location);

  const handleChange = (e) => setFormState({ ...formState, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateSalonLocation(salonId, formState);
    onSave(); // Notify parent of update success
  };

  return (
    <form onSubmit={handleSubmit}>
      <Label>Street</Label>
      <Input name="street" value={formState.street} onChange={handleChange} />

      <Label>City</Label>
      <Input name="city" value={formState.city} onChange={handleChange} />

      <Label>State</Label>
      <Input name="state" value={formState.state} onChange={handleChange} />

      <Label>Zip Code</Label>
      <Input name="zipCode" value={formState.zipCode} onChange={handleChange} />

      <Button type="submit">Save Location</Button>
    </form>
  );
}

export default LocationForm;
