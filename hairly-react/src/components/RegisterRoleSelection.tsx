import { useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Scissors, User, Briefcase } from 'lucide-react'
import { NavLink } from 'react-router-dom' // Import NavLink from React Router

export function RegisterRoleSelectionComponent() {
  const [selectedRole, setSelectedRole] = useState<string | null>(null)

  // Function to dynamically generate the registration URL based on the selected role
  const getRegistrationPath = () => {
    switch (selectedRole) {
      case 'client':
        return '/register/client';
      case 'employee':
        return '/register/employee';
      case 'owner':
        return '/register/owner';
      default:
        return '#'; // Default if no role is selected (or handle this case with disabled button)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Join Hairly</CardTitle>
          <CardDescription className="text-center">Choose how you'd like to use Hairly</CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup onValueChange={setSelectedRole} className="space-y-4">
            <div>
              <RadioGroupItem value="client" id="client" className="peer sr-only" />
              <Label
                htmlFor="client"
                className="flex items-center justify-between w-full p-4 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer peer-checked:border-rose-600 peer-checked:text-rose-600 hover:text-gray-600 hover:bg-gray-100"
              >
                <div className="flex items-center">
                  <User className="w-6 h-6 mr-3" />
                  <div>
                    <div className="w-full text-lg font-semibold">Client</div>
                    <div className="w-full text-sm">Book appointments and discover salons</div>
                  </div>
                </div>
              </Label>
            </div>
            <div>
              <RadioGroupItem value="employee" id="employee" className="peer sr-only" />
              <Label
                htmlFor="employee"
                className="flex items-center justify-between w-full p-4 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer peer-checked:border-rose-600 peer-checked:text-rose-600 hover:text-gray-600 hover:bg-gray-100"
              >
                <div className="flex items-center">
                  <Scissors className="w-6 h-6 mr-3" />
                  <div>
                    <div className="w-full text-lg font-semibold">Salon Employee</div>
                    <div className="w-full text-sm">Manage your appointments and clients</div>
                  </div>
                </div>
              </Label>
            </div>
            <div>
              <RadioGroupItem value="owner" id="owner" className="peer sr-only" />
              <Label
                htmlFor="owner"
                className="flex items-center justify-between w-full p-4 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer peer-checked:border-rose-600 peer-checked:text-rose-600 hover:text-gray-600 hover:bg-gray-100"
              >
                <div className="flex items-center">
                  <Briefcase className="w-6 h-6 mr-3" />
                  <div>
                    <div className="w-full text-lg font-semibold">Salon Owner</div>
                    <div className="w-full text-sm">Add your salon and grow your business</div>
                  </div>
                </div>
              </Label>
            </div>
          </RadioGroup>
        </CardContent>
        <CardFooter>
          {/* Only enable the NavLink if a role is selected */}
          {selectedRole ? (
            <NavLink
              to={getRegistrationPath()}
              className="w-full bg-rose-500 hover:bg-rose-600 text-white py-2 px-4 text-center rounded-lg"
            >
              Continue
            </NavLink>
          ) : (
            <button
              disabled
              className="w-full bg-gray-300 text-white py-2 px-4 text-center rounded-lg cursor-not-allowed"
            >
              Continue
            </button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}

export default RegisterRoleSelectionComponent;
