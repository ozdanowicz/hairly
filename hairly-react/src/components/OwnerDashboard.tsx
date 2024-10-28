import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Pen, Save, Plus, X, Trash2, GripVertical } from "lucide-react"
import { Employee, Service, Schedule, Salon } from "@/apiService"
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { fetchOwnerSalon, fetchSalonSchedule, fetchEmployeesBySalon, fetchServices } from "@/apiService"

interface OwnerInfo {
  id: number;
  name: string
  surname: string
  email: string
  phone: string
}

interface SalonPhoto {
  id: number
  url: string
}
interface OwnerDashboardProps{
  user: OwnerInfo
}
export function SalonOwnerDashboard({ user }: OwnerDashboardProps) {
  const [ownerInfo, setOwnerInfo] = useState<OwnerInfo>({
    id: user.id,
    name: user.name,
    surname: user.surname,
    phone: user.phone,
    email: user.email,
  });
  const [salon, setSalonInfo] = useState<Salon | null>(null)
  const [employees, setEmployees] = useState<Employee[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [schedule, setSchedule] = useState<Schedule[]>([])
  const [newEmployee, setNewEmployee] = useState({ name: "", role: "" })
  const [newService, setNewService] = useState<Service>({ id: 0, name: "", description: "", price: 0, durationMinutes: 0 })
  const [newPhotoUrl, setNewPhotoUrl] = useState("")
  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false)
  const [isAddServiceOpen, setIsAddServiceOpen] = useState(false)
  const [isAddPhotoOpen, setIsAddPhotoOpen] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [editedSalonInfo, setEditedSalonInfo] = useState<Salon | null>(null)
  const [editedSchedule, setEditedSchedule] = useState<Schedule[]>([])
  const [salonPhotos, setSalonPhotos] = useState<SalonPhoto[]>([
    { id: 1, url: "/placeholder.svg" },
    { id: 2, url: "/placeholder.svg" },
    { id: 3, url: "/placeholder.svg" },
  ])
  const [newPhoto, setNewPhoto] = useState<string>("")

  useEffect(() => {
    const loadData = async () => {
      try {
        const fetchSalon = await fetchOwnerSalon(user.id)
        setSalonInfo(fetchSalon)
        
        const scheduleData = await fetchSalonSchedule(salon.id)
        setSchedule(scheduleData)

        const employeesData = await fetchEmployeesBySalon(salon.id)
        setEmployees(employeesData)
        
        const servicesData = await fetchServices(salon.id)
        setServices(servicesData)

      } catch (error) {
        console.error("Failed to fetch salon data:", error)
      }
    }

    loadData()
  }, [user.id])

  const handleAddEmployee = () => {
    if (newEmployee.name && newEmployee.role) {
      setEmployees([...employees, { ...newEmployee, id: Date.now(), photo: "/placeholder.svg" }])
      setNewEmployee({ name: "", role: "" })
      setIsAddEmployeeOpen(false)
    }
  }
  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setNewPhotoFile(file)
    }
  }

  const handleAddPhoto = () => {
    if (newPhotoFile) {
      const photoUrl = URL.createObjectURL(newPhotoFile)
      setSalonPhotos([...salonPhotos, { id: Date.now(), url: photoUrl }])
      setNewPhotoFile(null)
      setIsAddPhotoOpen(false)
    }
  }

  const handleRemovePhoto = (id: number) => {
    setSalonPhotos(salonPhotos.filter((photo) => photo.id !== id))
  }

  const onDragEnd = (result: any) => {
    if (!result.destination) return

    const items = Array.from(salonPhotos)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)
    setSalonPhotos(items)
  }

  const handleRemoveEmployee = (id: number) => {
    setEmployees(employees.filter((emp) => emp.id !== id))
  }

  const handleAddService = () => {
    if (newService.name && newService.price > 0 && newService.durationMinutes > 0) {
      setServices([...services, { ...newService, id: Date.now() }])
      setNewService({ id: 0, name: "", description: "", price: 0, durationMinutes: 0 })
      setIsAddServiceOpen(false)
    }
  }

  const handleRemoveService = (id: number) => {
    setServices(services.filter((service) => service.id !== id))
  }

  const handleDeleteSalon = () => {
    alert("Salon deleted successfully")
  }

  const handleEdit = () => setEditMode(true)
  
  const handleSave = () => {
    setSalonInfo(editedSalonInfo)
    setSchedule(editedSchedule)
    setEditMode(false)
  }

  const handleCancel = () => {
    setEditedSalonInfo(salon)
    setEditedSchedule(schedule)
    setEditMode(false)
  }

  const handleScheduleChange = (day: string, field: 'openingTime' | 'closingTime', value: string) => {
    setEditedSchedule(prev => prev.map(s => s.dayOfWeek === day ? { ...s, [field]: value } : s))
  }

  const ViewMode = () => (
    <>
      <Card className="mb-8">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xl font-bold">Salon Information</CardTitle>
          <Button variant="outline" className="border-non rounded-xl shadow"onClick={handleEdit}>
            <Pen className="mr-2 h-4 w-4" /> Edit
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p><strong>Name:</strong> {salon?.name}</p>
            <p><strong>Location:</strong> {salon?.location}</p>
            <p><strong>Description:</strong> {salon?.description}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader className="flex flex-row items-center justify-between pb-2" >
          <CardTitle className="text-xl font-bold">Schedule</CardTitle>
          <Button variant="outline" className="border-non rounded-xl shadow"onClick={handleEdit}>
            <Pen className="mr-2 h-4 w-4" /> Edit
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            {schedule.map((day) => (
              <div key={day.dayOfWeek} className="space-y-1">
                <p className="font-semibold">{day.dayOfWeek}</p>
                <p className="text-gray-500">{day.openingTime} - {day.closingTime}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  )

  const EditMode = () => (
    <>
      <Card className="mb-8">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xl font-bold">Edit Salon Information</CardTitle>
          <div>
            <Button variant="outline" onClick={handleCancel} className="mr-2 rounded-xl border-non bg-gray-300">
              Cancel
            </Button>
            <Button variant="outline" className="rounded-xl border-non shadow" onClick={handleSave}>
              <Save className="mr-2 h-4 w-4" /> Save
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="salonName">Salon Name</Label>
              <Input
                className="rounded-xl border-gray-200"
                id="salonName"
                value={editedSalonInfo.name}
                onChange={(e) => setEditedSalonInfo({ ...editedSalonInfo, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                className="rounded-xl border-gray-200"
                id="location"
                value={editedSalonInfo.location}
                onChange={(e) => setEditedSalonInfo({ ...editedSalonInfo, location: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                className="rounded-xl border-gray-200"
                id="description"
                value={editedSalonInfo.description}
                onChange={(e) => setEditedSalonInfo({ ...editedSalonInfo, description: e.target.value })}
                rows={4}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xl font-bold">Edit Schedule</CardTitle>
          <div>
            <Button variant="outline" onClick={handleCancel} className="mr-2 rounded-xl border-non bg-gray-300">
              Cancel
            </Button>
            <Button variant="outline" className="rounded-xl border-non shadow" onClick={handleSave}>
              <Save className="mr-2 h-4 w-4" /> Save
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {editedSchedule.map((day) => (
              <div key={day.dayOfWeek} className="grid grid-cols-3 gap-4 items-center">
                <p className="font-semibold">{day.dayOfWeek}</p>
                <Input
                  className="rounded-xl border-gray-200"
                  type="time"
                  value={day.openingTime}
                  onChange={(e) => handleScheduleChange(day.dayOfWeek, 'openingTime', e.target.value)}
                />
                <Input
                  className="rounded-xl border-gray-200"
                  type="time"
                  value={day.closingTime}
                  onChange={(e) => handleScheduleChange(day.dayOfWeek, 'closingTime', e.target.value)}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  )

  return (
    <section className="bg-rose-50 min-h-screen p-4 md:p-8 lg:p-12">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-6 md:p-8 dark:bg-rose-200 dark:border-rose-700">
        <h1 className="text-3xl font-bold text-rose-900 mb-8 dark:text-black">
          Salon Owner Dashboard
        </h1>

        {editMode ? <EditMode /> : <ViewMode />}
        <Card className="mb-8">
            <CardHeader>
              <CardTitle>Owner Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">Name:</span>
                  <span>{ownerInfo.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Address:</span>
                  <span>{ownerInfo.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Id:</span>
                  <span>{ownerInfo.id}</span>
                </div>
              </div>
            </CardContent>
          </Card> 
        <Card className="mb-8">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl font-bold">Salon Photos</CardTitle>
            <Dialog open={isAddPhotoOpen} onOpenChange={setIsAddPhotoOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" /> Add Photo
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Photo</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="photoFile">Upload Photo</Label>
                    <Input
                      type="file"
                      id="photoFile"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                    />
                  </div>
                </div>
                <Button onClick={handleAddPhoto}>Add Photo</Button>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="photos">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef} className="grid gap-4">
                    {salonPhotos.map((photo, index) => (
                      <Draggable key={photo.id} draggableId={photo.id.toString()} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow"
                          >
                            <div {...provided.dragHandleProps}>
                              <GripVertical className="h-5 w-5 text-gray-500" />
                            </div>
                            <img src={photo.url} alt={`Salon photo ${index + 1}`} className="w-20 h-20 object-cover rounded" />
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemovePhoto(photo.id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </CardContent>
        </Card>
        <Card className="mb-8">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl font-bold">Employees</CardTitle>
            <Dialog open={isAddEmployeeOpen} onOpenChange={setIsAddEmployeeOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="rounded-xl border-non shadow">
                  <Plus className="mr-2 h-4 w-4" /> Add Employee
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Employee</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={newEmployee.name}
                      onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="role">Role</Label>
                    <Input
                      id="role"
                      value={newEmployee.role}
                      onChange={(e) => setNewEmployee({ ...newEmployee, role: e.target.value })}
                    />
                  </div>
                </div>
                <Button onClick={handleAddEmployee}>Add Employee</Button>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {employees.map((employee) => (
                <Card key={employee.id}>
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarImage src={employee.photo} alt={employee.name} />
                        <AvatarFallback>
                          {employee.name.split(" ").map((n) => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">{employee.name}</p>
                        <p className="text-sm text-gray-500">{employee.role}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => handleRemoveEmployee(employee.id)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl font-bold">Services</CardTitle>
            <Dialog open={isAddServiceOpen} onOpenChange={setIsAddServiceOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="rounded-xl border-non shadow">
                  <Plus className="mr-2 h-4 w-4" /> Add Service
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Service</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="serviceName">Name</Label>
                    <Input
                      id="serviceName"
                      value={newService.name}
                      onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="serviceDescription">Description</Label>
                    <Textarea
                      id="serviceDescription"
                      value={newService.description}
                      onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="servicePrice">Price</Label>
                    <Input
                      id="servicePrice"
                      type="number"
                      value={newService.price}
                      onChange={(e) => setNewService({ ...newService, price: parseFloat(e.target.value) })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="serviceDuration">Duration (minutes)</Label>
                    <Input
                      id="serviceDuration"
                      type="number"
                      value={newService.durationMinutes}
                      onChange={(e) => setNewService({ ...newService, durationMinutes: parseInt(e.target.value) })}
                    />
                  </div>
                </div>
                <Button  onClick={handleAddService}>Add Service</Button>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {services.map((service) => (
                <Card key={service.id}>
                  <CardContent className="flex items-center justify-between p-4">
                    <div>
                      <p className="font-semibold">{service.name}</p>
                      <p className="text-sm text-gray-500">{service.description}</p>
                      <p className="text-sm">Price: ${service.price} | Duration: {service.durationMinutes} minutes</p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => handleRemoveService(service.id)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-destructive text-destructive-foreground">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Danger Zone</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Deleting your salon will permanently remove all associated data. This action cannot be undone.
            </p>
            <Button variant="outline" onClick={handleDeleteSalon}>
              <Trash2 className="mr-2 h-4 w-4" /> Delete Salon
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

export default SalonOwnerDashboard