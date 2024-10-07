import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Calendar, LogOut, Trash2, Upload, Edit, Plus } from "lucide-react"

interface Appointment {
  id: number
  date: string
  clientName: string
  service: string
  status: "upcoming" | "finished"
  rating?: number
  review?: string
}

interface Service {
  id: string
  name: string
}

interface FreeDate {
  id: number
  date: string
  startTime: string
  endTime: string
}

export function EmployeeProfileComponent() {
  const [name, setName] = useState("Jane Doe")
  const [email, setEmail] = useState("jane.doe@example.com")
  const [phone, setPhone] = useState("+1 234 567 8901")
  const [bio, setBio] = useState("Experienced hairstylist with a passion for creating beautiful, personalized looks.")
  const [photo, setPhoto] = useState("/placeholder.svg")
  const [services, setServices] = useState<Service[]>([
    { id: "haircut", name: "Haircut" },
    { id: "coloring", name: "Coloring" },
    { id: "styling", name: "Styling" },
    { id: "treatments", name: "Treatments" },
  ])
  const [selectedServices, setSelectedServices] = useState<string[]>(["haircut", "coloring"])
  const [appointments, setAppointments] = useState<Appointment[]>([
    { id: 1, date: "2023-06-20 10:00", clientName: "Alice Johnson", service: "Haircut", status: "upcoming" },
    { id: 2, date: "2023-06-15 14:00", clientName: "Bob Smith", service: "Coloring", status: "finished", rating: 5, review: "Great service!" },
    { id: 3, date: "2023-06-10 11:00", clientName: "Carol White", service: "Styling", status: "finished", rating: 4, review: "Very satisfied" },
  ])
  const [isGoogleCalendarConnected, setIsGoogleCalendarConnected] = useState(true)
  const [freeDates, setFreeDates] = useState<FreeDate[]>([
    { id: 1, date: "2023-06-25", startTime: "09:00", endTime: "17:00" },
    { id: 2, date: "2023-06-26", startTime: "10:00", endTime: "18:00" },
    { id: 3, date: "2023-06-27", startTime: "09:00", endTime: "17:00" },
  ])

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhoto(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleServiceChange = (serviceId: string) => {
    setSelectedServices(prev =>
      prev.includes(serviceId)
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    )
  }

  const handleDeleteProfile = () => {
    // In a real application, this would send a request to your backend to delete the profile
    alert("Profile deleted successfully")
  }

  const handleEditGoogleCalendar = () => {
    // In a real application, this would open the Google Calendar editing interface
    window.open("https://calendar.google.com/calendar/r/settings", "_blank")
  }

  const handleDisconnectGoogleCalendar = () => {
    // In a real application, this would disconnect the Google Calendar integration
    setIsGoogleCalendarConnected(false)
  }

  const handleConnectGoogleCalendar = () => {
    // In a real application, this would initiate the Google Calendar connection process
    setIsGoogleCalendarConnected(true)
  }

  const handleAddFreeDate = () => {
    // In a real application, this would open a dialog to add a new free date
    const newDate: FreeDate = {
      id: Date.now(),
      date: "2023-06-28",
      startTime: "09:00",
      endTime: "17:00"
    }
    setFreeDates([...freeDates, newDate])
  }

  const handleRemoveFreeDate = (id: number) => {
    setFreeDates(freeDates.filter(date => date.id !== id))
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl">Employee Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Avatar className="w-24 h-24">
              <AvatarImage src={photo} alt={name} />
              <AvatarFallback>{name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div>
              <Label htmlFor="photo-upload" className="cursor-pointer">
                <div className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2">
                  <Upload className="mr-2 h-4 w-4" /> Change Photo
                </div>
              </Label>
              <Input
                id="photo-upload"
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
            </div>
          </div>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button>Save Changes</Button>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl">Services Provided</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2">
            {services.map((service) => (
              <div key={service.id} className="flex items-center space-x-2">
                <Checkbox
                  id={service.id}
                  checked={selectedServices.includes(service.id)}
                  onCheckedChange={() => handleServiceChange(service.id)}
                />
                <Label htmlFor={service.id}>{service.name}</Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl">Appointments</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="upcoming">
            <TabsList>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="finished">Finished</TabsTrigger>
            </TabsList>
            <TabsContent value="upcoming">
              {appointments.filter(apt => apt.status === "upcoming").map(apt => (
                <Card key={apt.id} className="mb-4">
                  <CardContent className="p-4">
                    <p className="font-semibold">{apt.clientName}</p>
                    <p className="text-sm text-gray-500">{apt.date}</p>
                    <p>{apt.service}</p>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
            <TabsContent value="finished">
              {appointments.filter(apt => apt.status === "finished").map(apt => (
                <Card key={apt.id} className="mb-4">
                  <CardContent className="p-4">
                    <p className="font-semibold">{apt.clientName}</p>
                    <p className="text-sm text-gray-500">{apt.date}</p>
                    <p>{apt.service}</p>
                    <p>Rating: {apt.rating}/5</p>
                    <p>Review: {apt.review}</p>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl">Google Calendar Integration</CardTitle>
        </CardHeader>
        <CardContent>
          {isGoogleCalendarConnected ? (
            <div className="space-y-4">
              <p className="text-sm text-gray-500">
                Your Google Calendar is connected. You can edit your calendar or disconnect it.
              </p>
              <div className="flex space-x-4">
                <Button onClick={handleEditGoogleCalendar}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Calendar
                </Button>
                <Button variant="outline" onClick={handleDisconnectGoogleCalendar}>
                  Disconnect Calendar
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-gray-500">
                Connect your Google Calendar to set and manage your free appointment dates.
              </p>
              <Button onClick={handleConnectGoogleCalendar}>
                <Calendar className="mr-2 h-4 w-4" />
                Connect Google Calendar
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl">Free Dates</CardTitle>
          <Button onClick={handleAddFreeDate}>
            <Plus className="mr-2 h-4 w-4" /> Add Free Date
          </Button>
        </CardHeader>
        <CardContent>
          {freeDates.length === 0 ? (
            <p className="text-sm text-gray-500">No free dates available.</p>
          ) : (
            <div className="space-y-4">
              {freeDates.map((freeDate) => (
                <Card key={freeDate.id}>
                  <CardContent className="p-4 flex justify-between items-center">
                    <div>
                      <p className="font-semibold">{freeDate.date}</p>
                      <p className="text-sm text-gray-500">{freeDate.startTime} - {freeDate.endTime}</p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => handleRemoveFreeDate(freeDate.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-between items-center mt-8">
        <Button variant="outline">
          <LogOut className="mr-2 h-4 w-4" /> Logout
        </Button>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="destructive">
              <Trash2 className="mr-2 h-4 w-4" /> Delete Profile
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you sure you want to delete your profile?</DialogTitle>
              <DialogDescription>
                This action cannot be undone. This will permanently delete your account and remove your data from our servers.
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end space-x-2">
              <Button variant="outline">Cancel</Button>
              <Button variant="destructive" onClick={handleDeleteProfile}>Delete</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}