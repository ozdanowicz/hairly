import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LogOut, Trash2 } from "lucide-react"

interface Appointment {
  id: number
  date: string
  service: string
  status: "upcoming" | "reviewed" | "canceled" | "not reviewed"
}

export function ClientProfileComponent() {
  const [name, setName] = useState("John Doe")
  const [email, setEmail] = useState("john.doe@example.com")
  const [phone, setPhone] = useState("+1 234 567 8900")
  const [photo, setPhoto] = useState("/placeholder.svg")

  const appointments: Appointment[] = [
    { id: 1, date: "2023-06-20", service: "Haircut", status: "upcoming" },
    { id: 2, date: "2023-06-15", service: "Manicure", status: "reviewed" },
    { id: 3, date: "2023-06-10", service: "Massage", status: "canceled" },
    { id: 4, date: "2023-06-05", service: "Facial", status: "not reviewed" },
  ]

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

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl">Client Profile</CardTitle>
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
                  Change Photo
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
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline">Cancel</Button>
            <Button>Save Changes</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Appointments</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="upcoming" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="reviewed">Reviewed</TabsTrigger>
              <TabsTrigger value="not-reviewed">Not Reviewed</TabsTrigger>
              <TabsTrigger value="canceled">Canceled</TabsTrigger>
            </TabsList>
            {["upcoming", "reviewed", "not-reviewed", "canceled"].map((status) => (
              <TabsContent key={status} value={status}>
                <div className="space-y-4">
                  {appointments
                    .filter((apt) => 
                      status === "not-reviewed" 
                        ? apt.status === "not reviewed"
                        : apt.status === status
                    )
                    .map((appointment) => (
                      <Card key={appointment.id}>
                        <CardContent className="flex justify-between items-center p-4">
                          <div>
                            <p className="font-semibold">{appointment.service}</p>
                            <p className="text-sm text-gray-500">{appointment.date}</p>
                          </div>
                          <Button variant="outline" size="sm">
                            {status === "upcoming" ? "Reschedule" : "View Details"}
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      <div className="mt-8 space-y-4">
        <Button variant="outline" className="w-full">
          <LogOut className="mr-2 h-4 w-4" /> Logout
        </Button>
        <Button variant="destructive" className="w-full">
          <Trash2 className="mr-2 h-4 w-4" /> Delete Profile
        </Button>
      </div>
    </div>
  )
}
export default ClientProfileComponent;