import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Save, Edit, X, Plus, Trash, Calendar } from "lucide-react";
import { Service, ServiceRequest } from "@/apiService";
import { addNewService, deleteService, updateService } from "@/apiService";
import { toast } from "react-toastify";
import { Label } from "@/components/ui/label";
import { useTranslation } from 'react-i18next';

interface ServicesCardProps {
  salonId: string;
  services?: Service[];
  onSave: (updatedServices: Service[]) => void;
}

const ServicesCard = ({ salonId, services = [], onSave }: ServicesCardProps) => {
  const { t } = useTranslation();  
  const [editedServices, setEditedServices] = useState<ServiceRequest[]>(services);
  const [isEditing, setIsEditing] = useState(false);
  const [newService, setNewService] = useState<ServiceRequest | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (services) {
      setEditedServices(services);
    }
  }, [services]);

  const handleServiceChange = (index: number, field: keyof Service, value: string | number) => {
    const updatedServices = [...editedServices];
    updatedServices[index] = { ...updatedServices[index], [field]: value };
    setEditedServices(updatedServices);
  };

  const handleAddServiceClick = () => {
    setNewService({ name: "", description: "", price: 0, durationMinutes: 0 });
    setError(null);
  };

  const handleNewServiceChange = (field: keyof Service, value: string | number) => {
    if (newService) {
      setNewService({ ...newService, [field]: value });
    }
  };

  const validateService = (service: ServiceRequest) => {
    if (!service.name || service.name.trim() === "") {
      return t('service.nameEmpty'); 
    }
    if (service.price <= 0) {
      return t('service.priceInvalid');
    }
    return null; 
  };

  const handleSaveNewService = async () => {
    if (newService) {
      const validationError = validateService(newService);
      if (validationError) {
        setError(validationError);
        return;
      }

      try {
        const savedService = await addNewService(salonId, newService);
        setEditedServices([...editedServices, savedService]);
        setNewService(null);
        if (!isEditing) setIsEditing(true);
        toast.success(t('service.addedSuccess', { name: newService.name }));
      } catch (error) {
        console.error("Error adding new service:", error);
        toast.error(t('service.addFailed'));
      }
    }
  };

  const handleRemoveService = async (serviceId: number, index: number) => {
    try {
      await deleteService(serviceId);
      const updatedServices = editedServices.filter((_, i) => i !== index);
      setEditedServices(updatedServices);
    } catch (error) {
      console.error("Error removing service:", error);
    }
  };

  const handleSave = async () => {
    let hasError = false;

    try {
      await Promise.all(
        editedServices.map(async (service) => {
          const validationError = validateService(service);
          if (validationError) {
            setError(validationError);
            hasError = true;
          } else {
            setError(null);
            if (service.id) {
              await updateService(service.id, service);
            }
          }
        })
      );

      if (hasError) {
        toast.error(t('service.nameEmpty')); 
        return;
      }

      onSave(editedServices);
      setIsEditing(false);
      setError(null);

      toast.success(t('service.updatedSuccess'));
    } catch (error) {
      console.error("Error saving services:", error);
      toast.error(t('service.saveFailed'));
    }
  };

  const handleCancel = () => {
    setEditedServices(services);
    setIsEditing(false);
    setNewService(null);
    setError(null);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 pt-4 bg-gray-100 mb-4 rounded-xl">
        <CardTitle>{t('service.title')}</CardTitle>
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
            className="mb-4 border-none bg-rose-500 text-white rounded-xl"
            onClick={handleAddServiceClick}
            variant="outline"
            size="sm"
          >
            <Plus className="w-4 h-4" /> {t('button.add')}
          </Button>
        )}
        {newService && (
          <div className="border-b pb-4 mb-4 relative">
            <input
              className="w-full p-2 border rounded mb-2"
              value={newService.name}
              onChange={(e) => handleNewServiceChange("name", e.target.value)}
              placeholder={t('service.name')}
            />
            {error && !newService.name && <p className="text-red-500 text-sm">{error}</p>}
            <textarea
              className="w-full p-2 border rounded mb-2"
              value={newService.description}
              onChange={(e) => handleNewServiceChange("description", e.target.value)}
              rows={2}
              placeholder={t('service.description')}
            />
            <div className="flex gap-2 mb-2">
              <input
                className="p-2 border rounded w-1/2"
                type="number"
                value={newService.price}
                onChange={(e) => handleNewServiceChange("price", parseFloat(e.target.value))}
                placeholder={t('service.price')}
              />
              {error && newService.price <= 0 && <p className="text-red-500 text-sm">{error}</p>}
              <input
                className="p-2 border rounded w-1/2"
                type="number"
                value={newService.durationMinutes}
                onChange={(e) => handleNewServiceChange("durationMinutes", parseInt(e.target.value))}
                placeholder={t('service.duration')}
              />
            </div>
            <Button
              className="border-none bg-red-400 text-white rounded-xl"
              onClick={handleSaveNewService}
              variant="outline"
              size="sm"
            >
              <Save className="w-4 h-4" /> {t('button.save')}
            </Button>
          </div>
        )}
        {editedServices.length > 0 ? (
          <ul className="space-y-4">
            {editedServices.map((service, index) => (
              <li key={service.id || index} className="border-b pb-5 relative">
                {isEditing ? (
                  <div className="space-y-3">
                    <div>
                      <Label className="font-bold">{t('service.name')}</Label>
                      <input
                        className="w-full p-2 border rounded"
                        value={service.name}
                        onChange={(e) => handleServiceChange(index, "name", e.target.value)}
                        placeholder={t('service.name')}
                      />
                      {error && !service.name && <p className="text-red-500 text-sm">{error}</p>}
                    </div>
                    <div>
                      <Label className="font-bold">{t('service.description')}</Label>
                      <textarea
                        className="w-full p-2 border rounded"
                        value={service.description}
                        onChange={(e) => handleServiceChange(index, "description", e.target.value)}
                        rows={2}
                        placeholder={t('service.description')}
                      />
                    </div>
                    <div className="flex gap-2">
                      <div>
                        <Label className="p-2 font-bold">{t('service.price')}</Label>
                        <input
                          className="p-2 border rounded w-1/2"
                          type="number"
                          value={service.price}
                          onChange={(e) => handleServiceChange(index, "price", parseFloat(e.target.value))}
                          placeholder={t('service.price')}
                        />
                        {error && service.price <= 0 && <p className="text-red-500 text-sm">{error}</p>}
                      </div>
                      <div>
                        <Label className="p-2 font-bold">{t('service.duration')}</Label>
                        <input
                          className="p-2 border rounded w-1/2"
                          type="number"
                          value={service.durationMinutes}
                          onChange={(e) => handleServiceChange(index, "durationMinutes", parseInt(e.target.value))}
                          placeholder={t('service.duration')}
                        />
                      </div>
                      <Button
                        className="absolute right-0 border-none bg-rose-700 text-white rounded-xl"
                        onClick={() => handleRemoveService(service.id as number, index)}
                        variant="outline"
                        size="sm"
                      >
                        <Trash className="w-4 h-4" /> {t('button.delete')}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <h3 className="font-semibold mb-1">{service.name}</h3>
                    {service.description && <p className="text-sm text-gray-600">{service.description}</p>}
                    <div className="flex justify-between mt-2">
                      <p className="font-bold">${service.price.toFixed(2)}</p>
                      <p className="text-sm text-gray-500">{t('service.duration')}: {service.durationMinutes} {t('service.minutes')}</p>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">{t('service.noServices')}</p>
        )}
      </CardContent>
    </Card>
  );
};

export default ServicesCard;
