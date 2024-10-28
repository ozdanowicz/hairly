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
      <CardHeader>
        <CardTitle>Our Services</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={services[0]?.id.toString()}>
          <TabsList>
            {services.map((service) => (
              <TabsTrigger key={service.id} value={service.id.toString()}>
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
                <CardContent>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button onClick={() => setSelectedService(service)}>View Available Dates</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Available Dates for {service.name}</DialogTitle>
                        <DialogDescription>Select a date to book your appointment.</DialogDescription>
                      </DialogHeader>
                      <ScrollArea className="h-[300px] w-full p-4">
                        {/* Here you can add your calendar or any additional details */}
                      </ScrollArea>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default SalonServices;
