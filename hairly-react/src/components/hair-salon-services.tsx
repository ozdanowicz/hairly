import { useState } from 'react'
import { Check, ChevronDown } from 'lucide-react'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

const specializations = [
  { value: "haircut", label: "Haircut & Styling" },
  { value: "color", label: "Hair Coloring" },
  { value: "treatment", label: "Hair Treatment" },
]

const services = {
  haircut: [
    { id: "haircut-1", name: "Women's Haircut", price: 50 },
    { id: "haircut-2", name: "Men's Haircut", price: 30 },
    { id: "haircut-3", name: "Children's Haircut", price: 25 },
    { id: "haircut-4", name: "Blow Dry & Style", price: 35 },
  ],
  color: [
    { id: "color-1", name: "Full Color", price: 80 },
    { id: "color-2", name: "Highlights", price: 100 },
    { id: "color-3", name: "Balayage", price: 150 },
    { id: "color-4", name: "Root Touch-up", price: 60 },
  ],
  treatment: [
    { id: "treatment-1", name: "Deep Conditioning", price: 40 },
    { id: "treatment-2", name: "Keratin Treatment", price: 200 },
    { id: "treatment-3", name: "Scalp Treatment", price: 50 },
    { id: "treatment-4", name: "Hair Mask", price: 30 },
  ],
}

export function HairSalonServices() {
  const [open, setOpen] = useState(false)
  const [selectedSpecialization, setSelectedSpecialization] = useState(specializations[0])
  const [selectedServices, setSelectedServices] = useState<string[]>([])

  const handleSpecializationSelect = (currentValue: string) => {
    const specialization = specializations.find(spec => spec.value === currentValue)
    if (specialization) {
      setSelectedSpecialization(specialization)
      setSelectedServices([])
    }
    setOpen(false)
  }

  const handleServiceToggle = (serviceId: string) => {
    setSelectedServices(current =>
      current.includes(serviceId)
        ? current.filter(id => id !== serviceId)
        : [...current, serviceId]
    )
  }

  const totalPrice = selectedServices.reduce((sum, serviceId) => {
    const service = services[selectedSpecialization.value as keyof typeof services].find(s => s.id === serviceId)
    return sum + (service?.price || 0)
  }, 0)

  return (
    <Card className="w-[380px]">
      <CardHeader>
        <CardTitle>Hair Salon Services</CardTitle>
        <CardDescription>Choose your specialization and services</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full justify-between"
              >
                {selectedSpecialization.label}
                <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[380px] p-0">
              <Command>
                <CommandInput placeholder="Search specialization..." />
                <CommandEmpty>No specialization found.</CommandEmpty>
                <CommandGroup>
                  {specializations.map((specialization) => (
                    <CommandItem
                      key={specialization.value}
                      onSelect={handleSpecializationSelect}
                      className="cursor-pointer"
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedSpecialization.value === specialization.value ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {specialization.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>

          <div className="space-y-2">
            {services[selectedSpecialization.value as keyof typeof services].map((service) => (
              <div key={service.id} className="flex items-center space-x-2">
                <Checkbox
                  id={service.id}
                  checked={selectedServices.includes(service.id)}
                  onCheckedChange={() => handleServiceToggle(service.id)}
                />
                <Label htmlFor={service.id} className="flex-1">
                  {service.name}
                </Label>
                <span className="text-sm text-muted-foreground">${service.price}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex-col items-start space-y-2">
        <div className="text-sm text-muted-foreground">
          Selected services: {selectedServices.length}
        </div>
        <div className="text-lg font-semibold">
          Total: ${totalPrice}
        </div>
      </CardFooter>
    </Card>
  )
}