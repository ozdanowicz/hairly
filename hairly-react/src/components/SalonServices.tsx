
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Service } from '@/apiService'; 
import { useTranslation } from 'react-i18next';


interface ServicesProps {
  services: Service[]; 
  setSelectedService: (service: Service) => void; 
}

const SalonServices = ({ services, setSelectedService }: ServicesProps) => {
  const { t } = useTranslation();
  return (
    <Card>
      <CardHeader  className="flex flex-row items-center justify-between space-y-0 pt-4 pb-4 mb-3 bg-gray-100 mb-4 rounded-xl">
        <CardTitle>{t('service.ourServices')}</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={services[0]?.id.toString()}>
          <TabsList>
            {services.map((service) => (
              <TabsTrigger className="rounded-xl border border-gray-200" key={service.id} value={service.id.toString()}>
                {service.name}
              </TabsTrigger>
            ))}
          </TabsList>
          {services.map((service) => (
            <TabsContent key={service.id} value={service.id.toString()}>
              <Card>
                <CardHeader>
                  <CardTitle className="pb-2xl">{service.name}</CardTitle>
                  <CardDescription>{t('service.description')}: {service.description}</CardDescription>
                  <CardDescription>{t('service.duration')}: {service.durationMinutes} minutes</CardDescription>
                  <CardDescription>{t('service.price')}: {service.price.toFixed(2)}zl</CardDescription>
                </CardHeader>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default SalonServices;
