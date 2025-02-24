import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Edit, Save, TrashIcon, X, Plus, Sparkle } from "lucide-react"
import { Employee, Service, Schedule, Salon, fetchSalonDetails} from "@/apiService"
import { fetchOwnerSalon, fetchSalonSpecializations, updateSpecialization, updateSalonInfo, Specialization, SpecializationEnum, createSalonSpecialization, deleteSalonSpecialization} from "@/apiService"
import {fetchSalonSchedule} from "@/salonService"
import { fetchEmployeesBySalon, createSalon } from "@/salonService"
import EmployeesCard from "./EmployeesCard"
import LocationCard from "./LocationCard"
import { toast } from "react-toastify";
import SalonPhotoManager from "./SalonPhotoManager"
import ServicesCard from "./ServicesCard"
import { Label } from "@/components/ui/label"
import SalonScheduleCard from "./SalonScheduleCard"
import { useTranslation } from 'react-i18next';
interface OwnerInfo {
  id: number
  name: string
  surname: string
  email: string
  phone: string
}

interface SalonPhoto {
  id: number
  url: string
}

interface OwnerDashboardProps {
  user: OwnerInfo
}




export function SalonOwnerDashboard({ user }: OwnerDashboardProps) {
  const [salon, setSalon] = useState<Salon | null>(null);
  const [specializations, setSpecializations] = useState<Specialization[]>([]); 
  const [newSpecialization, setNewSpecialization] = useState<SpecializationEnum | null>(null);
  const [editingSpecialization, setEditingSpecialization] = useState<Specialization | null>(null);
  const [selectedSpecialization, setSelectedSpecialization] = useState<SpecializationEnum>(SpecializationEnum.HAIRDRESSER);
  const [services, setServices] = useState<Service[]>([]);
  const [schedule, setSchedule] = useState<Schedule[]>([]);
  const [salonName, setSalonName] = useState(salon?.name || "");
  const [salonDescription, setSalonDescription] = useState(salon?.description || "");
  const [selectedServices, setSelectedServices] = useState<Set<number>>(new Set()) 

  const [salonPhotos, setSalonPhotos] = useState<SalonPhoto[]>([{ id: 1, url: "/placeholder.svg" }]);
  const [isEditingSalonInfo, setIsEditingSalonInfo] = useState(false);
  const [isEditingSchedule, setIsEditingSchedule] = useState(false);
  const [isEditingServices, setIsEditingServices] = useState(false);
  const [isSalonRegistered, setIsSalonRegistered] = useState(false); 
  const {t} = useTranslation();


  useEffect(() => {
    const loadData = async () => {
      try {
        const fetchedSalon = await fetchOwnerSalon(user.id);
        setSalon(fetchedSalon);
        setSalonName(salon?.name || "");
        setSalonDescription(salon?.description || "");
        setServices(fetchedSalon.services);
        if (fetchedSalon && fetchedSalon.id) {
          setSchedule(await fetchSalonSchedule(fetchedSalon.id));
          //setEmployees(await fetchEmployeesBySalon(fetchedSalon.id));
          setServices(fetchedSalon.services || []);
          setSpecializations(await fetchSalonSpecializations(fetchedSalon.id));
        }
      } catch (error) {
        console.error("Failed to fetch salon data:", error);
      }
    };
    loadData();
  }, [user.id]);

  const handleRegisterSalon = async () => {
    if (!salonName || !salonDescription) {
      toast.error(t('toast.registerSalon.error'));
      return;
    }

    try {
      await createSalon(user.id, { name: salonName, description: salonDescription });
      try {
        setSalon(await fetchOwnerSalon(user.id));
      } catch (error) {
        console.error("Failed to fetch salon data after registration:", error);
      }

      setIsSalonRegistered(true);
      toast.success(t('toast.registerSalon.success'));
    } catch (error) {
      toast.error(t('toast.registerSalon.fail'));
      console.error("Error registering salon:", error);
    }
  };

  const handleAddSpecialization = () => {
    setEditingSpecialization({
      specialization: "",
      services: [],
    });
    setSelectedServices(new Set());
  };
  
  const handleServiceChange = (serviceId: number) => {
    setSelectedServices((prev) => {
      const updated = new Set(prev);
      if (updated.has(serviceId)) {
        updated.delete(serviceId); 
      } else {
        updated.add(serviceId); 
      }
      return updated;
    });
  };
  
  

  const handleDeleteSpecialization = async (specializationId: number) => {
    try {
      await deleteSalonSpecialization(specializationId);
      setSpecializations(specializations.filter((item) => item.id !== specializationId));
      toast.success(t('toast.specializationDelete'));
    } catch (error) {
      toast.error(t('toast.error.specializationDelete'));
      console.error("Error deleting specialization:", error);
    }
  };

  const handleEditSpecialization = (specialization: Specialization) => {
    setEditingSpecialization(specialization);
    setSelectedSpecialization(specialization.specialization); 
    const selectedServiceIds = new Set(specialization.services.map((service) => service.id));
    setSelectedServices(selectedServiceIds); 
  };
  

  const handleSaveSpecialization = async () => {
    if (!selectedSpecialization) {
      toast.error(t('toast.error.specializationNoName'));
      return;
    }
  
    const newSpecializationData = {
      specialization: selectedSpecialization,
      services: Array.from(selectedServices),
    };
  
    try {
      if (editingSpecialization?.id) {
        const updatedSpecialization = await updateSpecialization(
          editingSpecialization.id,
          selectedSpecialization,
          Array.from(selectedServices)
        );
  
        setSpecializations((prev) =>
          prev.map((spec) =>
            spec.id === editingSpecialization.id ? updatedSpecialization : spec
          )
        );
      } else {
        const createdSpecialization = await createSalonSpecialization(
          salon?.id,
          newSpecializationData.specialization,
          newSpecializationData.services
        );
  
        setSpecializations((prev) => [...prev, createdSpecialization]);
      }
  
      setEditingSpecialization(null);
      setSelectedServices(new Set());
      toast.success(t('toast.specializationSave'));
    } catch (error) {
      console.error("Failed to save specialization:", error);
      toast.error(t('toast.error.specializationSave'));
    }
  };

  const handleServiceSelection = (serviceId: number) => {
    setSelectedServices(prev => {
      const updatedSelectedServices = new Set(prev);
      if (updatedSelectedServices.has(serviceId)) {
        updatedSelectedServices.delete(serviceId);
      } else {
        updatedSelectedServices.add(serviceId);
      }
      console.log(updatedSelectedServices);
      return updatedSelectedServices;
    });
  }


  const handleSave = async (section: 'salonInfo' | 'schedule' | 'services') => {
    switch(section) {
      case 'salonInfo': {
        try {
          const updatedSalonInfo = { ...salon, name: salonName, description: salonDescription };
          await updateSalonInfo(salon.id, updatedSalonInfo);
          setSalon(updatedSalonInfo);
          setIsEditingSalonInfo(false);
          toast.success(t('toast.salonUpdated')); 
        } catch (error) {
          toast.error(t('toast.error.salonUpdate')); 
        }
        break;
      }
      case 'schedule': {
        setIsEditingSchedule(false);
        break;
      }
      case 'services': {

        setIsEditingServices(false);
        break;
      }
    }
  };
  function capitalizeFirstLetter(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  const renderEditButtons = (section: 'salonInfo' | 'schedule' | 'services') => {
    const isEditing = 
      section === 'salonInfo' ? isEditingSalonInfo :
      section === 'schedule' ? isEditingSchedule :
      isEditingServices;

    const setEditing = 
      section === 'salonInfo' ? setIsEditingSalonInfo :
      section === 'schedule' ? setIsEditingSchedule :
      setIsEditingServices;

    return isEditing ? (
      <div className="flex gap-2">
        <Button className="border-non bg-white rounded-xl" onClick={() => handleSave(section)} variant="outline" size="sm">
          <Save className="w-4 h-4 mr-2" /> {t('button.save')}
        </Button>
        <Button className="border-non bg-white rounded-xl" onClick={() => setEditing(false)} variant="ghost" size="sm">
          <X className="w-4 h-4 mr-2" /> {t('button.cancel')}
        </Button>
      </div>
    ) : (
      <Button className="border-non bg-white rounded-xl" onClick={() => setEditing(true)} variant="outline" size="sm">
        <Edit className="w-4 h-4 mr-2" /> {t('button.edit')}
      </Button>
    );
  };

  const handleUpdatePhotos = (updatedPhotos: SalonPhoto[]) => {
    setSalonPhotos(updatedPhotos);
  };

  const handleSaveServices = async (updatedServices: Service[]) => {
    try {
      setServices(updatedServices);
      setIsEditingServices(false);
      toast.success(t('toast.service.updatedSuccess'));
    } catch (error) {
      toast.error(t('toast.service.saveFailed'));
    }
  };
  

  const handleSaveSchedule = async (updatedSchedule: Schedule[]) => { 
    try {
      setSchedule(updatedSchedule);
      setIsEditingSchedule(false);
      toast.success(t('toast.scheduleUpdated'));
    } catch (error) {
      toast.error(t('toast.error.scheduleUpdate'));
    }
  }
  

  return (
    <section className="bg-rose-50 min-h-screen p-4 md:p-8 lg:p-12">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-6 md:p-8 dark:bg-rose-200 dark:border-rose-700">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-rose-900 dark:text-black">
          {t('salonCardTitle')}
          </h1>
        </div>
        {/* {!isSalonRegistered && (
          <div className="mb-6 text-center">
            <p className="text-lg text-gray-700">
              You need to register your salon by providing basic information such as the name and description.
            </p>
            <p className="text-lg text-gray-700">
              After that, you can add more details.
            </p>
          </div>
        )}
         {!isSalonRegistered && (
          <Card>
            <CardHeader className="bg-gray-100 mb-4">
              <CardTitle>Register Your Salon</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex flex-col">
                  <Label 
                    className="mb-1"
                    htmlFor="salon-name">Salon Name</Label>
                  <Input
                    className="text-gray-600 rounded-xl border-gray-300"
                    id="salon-name"
                    placeholder="Enter your salon name"
                    value={salonName}
                    onChange={(e) => setSalonName(e.target.value)}
                  />
                </div>

                <div className="flex flex-col">
                  <Label 
                    className="mb-1"
                    htmlFor="salon-description">{t('regirsterSalon.salonDescriptionLabel)}</Label>
                  <Input
                    className="text-gray-600 rounded-xl border-gray-300"
                    id="salon-description"
                    placeholder={t('regirsterSalon.salonDescriptionLabel)}
                    value={salonDescription}
                    onChange={(e) => setSalonDescription(e.target.value)}
                  />
                </div>

                <div className="mt-4">
                  <Button 
                    className="rounded-xl shadow bg-rose-700 text-white hover:bg-rose-800"
                    onClick={handleRegisterSalon}>Register Salon</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
 */}

          <div className="grid gap-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 pt-4 bg-gray-100 rounded-xl mb-4">
              <CardTitle className="">{t('salonInfo.title')}</CardTitle>
              {renderEditButtons('salonInfo')}
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <p className="font-semibold">{t('salonInfo.salonName')}</p>
                {isEditingSalonInfo ? (
                  <input 
                  className="w-full p-2 border rounded text-gray-700" 
                  value={salonName}
                  placeholder={t('salonInfo.salonName')}
                  onChange={(e) => setSalonName(e.target.value)} />
                ) : (
                  <p className=" text-gray-700">{salon?.name || "no salon name yet" }</p>
                )}
                <p className="font-semibold">{t('salonInfo.description')}</p>
                {isEditingSalonInfo ? (
                  <textarea 
                  className="w-full p-2 border rounded text-gray-700" 
                  value={salonDescription}
                  placeholder={t('salonInfo.description')}
                  onChange={(e) => setSalonDescription(e.target.value)}
                  rows={4} />
                ) : (
                  <p className="text-gray-700">{salon?.description || "no salon description yet"}</p>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-8">
          <LocationCard salonId={salon?.id || 0} isOwner={true} />
           
          <Card>
            <CardHeader className="flex flex-col items-start justify-between space-y-0 pb-6 pt-6 bg-gray-100 rounded-xl mb-4">
              <CardTitle>{t('specializations.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              {editingSpecialization ? (
                <div className="space-y-4">
                  <div className="space-y-2 flex flex-col">
                    <Label className="font-bold" htmlFor="specialization-name">{t('specializations.title')}</Label>
                    <select
                      id="specialization-name"
                      value={selectedSpecialization || editingSpecialization.specialization} 
                      onChange={(e) => setSelectedSpecialization(e.target.value as SpecializationEnum)}
                      className="border border-gray-300 rounded-xl p-2 focus:border-rose-500"
                    >
                      {Object.values(SpecializationEnum).map((specialization) => (
                        <option key={specialization} value={specialization}>
                          {specialization}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label className="font-bold">{t('service.optional')}</Label>
                    {services.map((service) => (
                      <div key={service.id} className="flex items-center space-x-2">
                        <input
                          id={`service-${service.id}`}
                          type="checkbox"
                          className="h-4 w-4 rounded border border-gray-700"
                          checked={selectedServices.has(service.id)}
                          onChange={() => handleServiceSelection(service.id)}
                        />
                        <span className="text-sm">
                          {service.name} - {service.description}
                        </span>
                      </div>
                    ))}
                    {!services.length && (
                      <p className="text-gray-500 text-sm">{t('service.noServices')}</p>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      className="rounded-xl shadow hover:bg-gray-50"
                      onClick={handleSaveSpecialization}
                    >
                      <Save className="h-4 w-4"></Save>
                      {t('button.save')}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="rounded-xl shadow bg-gray-200 border-non hover:bg-gray-300"
                      onClick={() => setEditingSpecialization(null)}
                    >
                      {t('button.cancel')}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {specializations.map((specialization) => (
                    <div
                      key={specialization.id}
                      className="flex items-center justify-between border p-4 rounded-xl shadow pb-4"
                    >
                      <div>
                        <span className="font-semibold p-2 mb-2">{specialization.specialization}</span>
                        {specialization.services?.length > 0 && (
                          <ul className="ml-4 text-sm text-gray-600">
                            {specialization.services.map((service) => (
                              <li className="p-1 m-1"key={service.id}>
                                {service.name}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          className="rounded-xl shadow border-non hover:bg-gray-50"
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditSpecialization(specialization)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          className="rounded-xl shadow border-non text-white bg-rose-700 hover:bg-rose-800 hover:text-white"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteSpecialization(specialization.id)}
                        >
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  <Button
                    className="rounded-xl shadow mt-4 border-non"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setEditingSpecialization({specialization: "", services: [] })
                    }
                  >
                    <Plus className="h-4 w-4" /> {t('button.add')}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
          <ServicesCard salonId={salon?.id} services={salon?.services} onSave={handleSaveServices} />

          <SalonScheduleCard salonId={salon?.id} schedule={schedule} isEditingSchedule={isEditingSchedule} onSave={handleSaveSchedule}/>

          <EmployeesCard salonId={salon?.id || 0}  isOwnerDashboard={true} specializations ={specializations} />

          <SalonPhotoManager salonId={salon?.id}/>
        </div>
        </div>
      </div>
    </section>
  );
}

export default SalonOwnerDashboard;