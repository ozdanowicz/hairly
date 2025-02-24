import { useState } from "react";
import {Button } from "@/components/ui/button";
import {Input } from "@/components/ui/input";
import {Label } from "@/components/ui/label";
import {Textarea} from "@/components/ui/textarea";
import { updateSalonServices } from "@/apiService";

function ServiceForm({ salonId, services, onSave }) {
  const [serviceState, setServiceState] = useState(services);

  const handleChange = (index, field, value) => {
    const updatedServices = [...serviceState];
    updatedServices[index][field] = value;
    setServiceState(updatedServices);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateSalonServices(salonId, serviceState);
    onSave(); 
  };

  return (
    <form onSubmit={handleSubmit}>
      {serviceState.map((service, index) => (
        <div key={index} className="service">
          <Label>Service Name</Label>
          <Input
            value={service.name}
            onChange={(e) => handleChange(index, "name", e.target.value)}
          />
          <Label>Description</Label>
          <Textarea
            value={service.description}
            onChange={(e) => handleChange(index, "description", e.target.value)}
          />
          <Label>Price</Label>
          <Input
            type="number"
            value={service.price}
            onChange={(e) => handleChange(index, "price", parseFloat(e.target.value))}
          />
          <Label>Duration (Minutes)</Label>
          <Input
            type="number"
            value={service.durationMinutes}
            onChange={(e) => handleChange(index, "durationMinutes", parseInt(e.target.value))}
          />
        </div>
      ))}
      <Button type="submit">Save Services</Button>
    </form>
  );
}

export default ServiceForm;
