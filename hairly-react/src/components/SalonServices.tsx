import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Service } from '@/apiService'; 

interface ServicesProps {
  services: Service[]; 
  setSelectedService: (service: Service) => void; 
}

const SalonServices: React.FC<ServicesProps> = ({ services, setSelectedService }) => {
  return (
    <Card>
      <CardHeader  className="flex flex-row items-center justify-between space-y-0 pt-4 pb-4 mb-3 bg-gray-100 mb-4 rounded-xl">
        <CardTitle>Our Services</CardTitle>
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
                  <CardDescription>Description: {service.description}</CardDescription>
                  <CardDescription>Time: {service.durationMinutes} minutes</CardDescription>
                  <CardDescription>Price: {service.price.toFixed(2)}zl</CardDescription>
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
