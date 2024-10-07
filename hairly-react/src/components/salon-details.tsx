'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Star, Scissors } from 'lucide-react'

// Mock data
const salonData = {
  name: "Chic Cuts & Styles",
  description: "Where style meets confidence. Our team of skilled professionals is dedicated to providing you with the best hair care experience.",
  employees: [
    { id: 1, name: "Alice Johnson", role: "Senior Stylist", image: "https://i.pravatar.cc/150?img=1" },
    { id: 2, name: "Bob Smith", role: "Barber", image: "https://i.pravatar.cc/150?img=3" },
    { id: 3, name: "Carol Davis", role: "Colorist", image: "https://i.pravatar.cc/150?img=5" },
  ],
  services: [
    { id: 1, name: "Women's Haircut", price: 60, availableDates: [new Date(2023, 5, 15), new Date(2023, 5, 16), new Date(2023, 5, 17)] },
    { id: 2, name: "Men's Haircut", price: 40, availableDates: [new Date(2023, 5, 18), new Date(2023, 5, 19), new Date(2023, 5, 20)] },
    { id: 3, name: "Hair Coloring", price: 100, availableDates: [new Date(2023, 5, 21), new Date(2023, 5, 22), new Date(2023, 5, 23)] },
  ],
  portfolio: [
    "/placeholder.svg?height=400&width=600",
    "/placeholder.svg?height=400&width=600",
    "/placeholder.svg?height=400&width=600",
  ],
  ratings: [
    { id: 1, author: "John D.", rating: 5, comment: "Great service and amazing results!" },
    { id: 2, author: "Sarah M.", rating: 4, comment: "Very professional and friendly staff." },
    { id: 3, author: "Mike R.", rating: 5, comment: "Best haircut I've had in years!" },
  ],
}

export function SalonDetails() {
  const [selectedService, setSelectedService] = useState(null)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-[300px_1fr] gap-8">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scissors className="w-6 h-6" />
                {salonData.name}
              </CardTitle>
              <CardDescription>{salonData.description}</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Our Team</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {salonData.employees.map((employee) => (
                  <div key={employee.id} className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage src={employee.image} alt={employee.name} />
                      <AvatarFallback>{employee.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{employee.name}</p>
                      <p className="text-sm text-gray-500">{employee.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="space-y-8">
          <Carousel>
            <CarouselContent>
              {salonData.portfolio.map((image, index) => (
                <CarouselItem key={index}>
                  <Image src={image} alt={`Portfolio ${index + 1}`} width={600} height={400} className="rounded-lg" />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
          <Card>
            <CardHeader>
              <CardTitle>Our Services</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue={salonData.services[0].id.toString()}>
                <TabsList>
                  {salonData.services.map((service) => (
                    <TabsTrigger key={service.id} value={service.id.toString()}>{service.name}</TabsTrigger>
                  ))}
                </TabsList>
                {salonData.services.map((service) => (
                  <TabsContent key={service.id} value={service.id.toString()}>
                    <Card>
                      <CardHeader>
                        <CardTitle>{service.name}</CardTitle>
                        <CardDescription>${service.price}</CardDescription>
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
                              <Calendar
                                mode="multiple"
                                selected={service.availableDates}
                                className="rounded-md border"
                              />
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
          <Card>
            <CardHeader>
              <CardTitle>Recent Ratings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {salonData.ratings.map((rating) => (
                  <div key={rating.id} className="border-b pb-4 last:border-b-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">{rating.author}</p>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-4 h-4 ${i < rating.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{rating.comment}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}