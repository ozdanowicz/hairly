import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2, Plus, X } from "lucide-react";

interface Employee {
  id: number;
  name: string;
  role: string;
  photo: string;
}

interface Service {
  id: string;
  name: string;
}

export function SalonOwnerProfileComponent() {
  const [salonName, setSalonName] = useState("Chic Cuts");
  const [location, setLocation] = useState("123 Style Street, Fashion City");
  const [description, setDescription] = useState("We are a premium hair salon offering a wide range of services to make you look and feel your best.");
  const [employees, setEmployees] = useState<Employee[]>([
    { id: 1, name: "Alice Smith", role: "Senior Stylist", photo: "/placeholder.svg" },
    { id: 2, name: "Bob Johnson", role: "Colorist", photo: "/placeholder.svg" },
  ]);
  const [newEmployee, setNewEmployee] = useState({ name: "", role: "" });
  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false);
  const [services] = useState<Service[]>([
    { id: "haircut", name: "Haircut" },
    { id: "coloring", name: "Coloring" },
    { id: "styling", name: "Styling" },
    { id: "treatments", name: "Treatments" },
    { id: "extensions", name: "Extensions" },
    { id: "makeup", name: "Makeup" },
  ]);
  const [selectedServices, setSelectedServices] = useState<string[]>(["haircut", "coloring", "styling", "treatments"]);

  const handleAddEmployee = () => {
    if (newEmployee.name && newEmployee.role) {
      setEmployees([...employees, { ...newEmployee, id: Date.now(), photo: "/placeholder.svg" }]);
      setNewEmployee({ name: "", role: "" });
      setIsAddEmployeeOpen(false);
    }
  };

  const handleRemoveEmployee = (id: number) => {
    setEmployees(employees.filter((emp) => emp.id !== id));
  };

  const handleServiceChange = (serviceId: string) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId) ? prev.filter((id) => id !== serviceId) : [...prev, serviceId]
    );
  };

  const handleDeleteSalon = () => {
    alert("Salon deleted successfully");
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Card className="mb-8 border-gray-200 shadow-lg rounded-xl">
        <CardHeader>
          <CardTitle className="text-2xl">Salon Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4">
            <div className="grid gap-2 border-gray-200 shadow-lg rounded-xl">
              <Label htmlFor="salonName">Salon Name</Label>
              <Input id="salonName" className="border-gray-200 rounded-xl shadow-lg" value={salonName} onChange={(e) => setSalonName(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="location">Location</Label>
              <Input id="location" className="border-gray-200 rounded-xl shadow-lg" value={location} onChange={(e) => setLocation(e.target.value)} />
            </div>

            <div className="grid gap-2">
              <Label>Services</Label>
              <div className="grid grid-cols-2 gap-2">
                {services.map((service) => (
                  <div key={service.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={service.id}
                      className="border-gray-500 rounded-xl"
                      checked={selectedServices.includes(service.id)}
                      onCheckedChange={() => handleServiceChange(service.id)}
                    />
                    <Label htmlFor={service.id}>{service.name}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-2 border-gray-200 shadow-lg rounded-xl">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                className="border-gray-200 shadow-lg"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button>Save Changes</Button>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-8 border-none shadow-lg rounded-xl">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl">Employees</CardTitle>
          <Dialog open={isAddEmployeeOpen} onOpenChange={setIsAddEmployeeOpen}>
            <DialogTrigger asChild>
              <Button>
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
          <div className="grid gap-4 border-none shadow-lg rounded-xl">
            {employees.map((employee) => (
              <Card key={employee.id} className="shadow-md rounded-md">
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

      <Card className="bg-destructive text-destructive-foreground shadow-lg rounded-xl">
        <CardHeader>
          <CardTitle className="text-2xl">Danger Zone</CardTitle>
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
  );
}

export default SalonOwnerProfileComponent;
