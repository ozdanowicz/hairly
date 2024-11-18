import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Scissors, Sparkles } from 'lucide-react'

interface Specialization {
  id: string
  name: string
  services: string[]
}

const specializations: Specialization[] = [
  {
    id: "haircut",
    name: "Haircuts & Styling",
    services: ["Women's Haircut", "Men's Haircut", "Children's Haircut", "Blow Dry", "Updo"]
  },
  {
    id: "color",
    name: "Hair Coloring",
    services: ["Full Color", "Highlights", "Balayage", "Ombre", "Root Touch-up"]
  },
  {
    id: "treatment",
    name: "Hair Treatments",
    services: ["Deep Conditioning", "Keratin Treatment", "Scalp Treatment", "Hair Mask", "Olaplex Treatment"]
  }
]

export function SpecializationServicesCardComponent() {
  const [selectedSpecialization, setSelectedSpecialization] = useState<Specialization | null>(null)

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-2xl font-bold">Salon Services</CardTitle>
        <Scissors className="h-6 w-6 text-gray-500" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Select onValueChange={(value) => setSelectedSpecialization(specializations.find(s => s.id === value) || null)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choose a specialization" />
            </SelectTrigger>
            <SelectContent>
              {specializations.map((spec) => (
                <SelectItem key={spec.id} value={spec.id}>{spec.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {selectedSpecialization && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">{selectedSpecialization.name} Services</h3>
              <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                <div className="flex flex-wrap gap-2">
                  {selectedSpecialization.services.map((service) => (
                    <Badge key={service} variant="secondary" className="flex items-center gap-1 px-3 py-1">
                      <Sparkles className="h-3 w-3" />
                      {service}
                    </Badge>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}