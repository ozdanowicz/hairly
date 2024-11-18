import{ useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Scissors, User, Briefcase } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Role, fetchUserData} from '@/apiService'; 
import {useAuth} from '@/tokenService';


export interface User {
  id: number;
  name: string;
  surname: string;
  email: string;
  role: Role;
}


export function RegisterRoleSelectionComponent() {
  const [selectedRole, setSelectedRole] = useState(null);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const { token, setToken } = useAuth();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const accessToken = urlParams.get('access_token');

    if (accessToken) {
      setToken(accessToken);
      localStorage.setItem('authToken', accessToken);
    }

    const effectiveToken = accessToken || token; // Use URL token or stored token

    if (effectiveToken) {
      fetchUserData(effectiveToken)
        .then((userData) => setUser(userData))
        .catch((error) => {
          console.error('Error fetching user data:', error);
          navigate('/login'); // Redirect to login on failure
        });
    } else {
      navigate('/login');
    }
  }, [token, navigate, setToken]);
  const handleContinue = () => {
    if (selectedRole && token) {
      fetch(`http://localhost:8080/api/v1/auth/add-role?role=${selectedRole}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      })
        .then(response => {
          if (response.ok) {
            navigate('/profile');
          } else {
            console.error('Failed to set role');
          }
        })
        .catch(error => {
          console.error('Error:', error);
        });
    } else {
      console.error('No role selected or user not fetched');
    }
  };
  return (
    <div className="min-h-screen bg-white flex flex-col justify-center items-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Join Hairly</CardTitle>
          <CardDescription className="text-center">Choose how you'd like to use Hairly</CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup onValueChange={setSelectedRole} className="space-y-4">
            <div>
            <RadioGroupItem value={Role.CLIENT} id="client" className="peer sr-only" />
              <Label
                htmlFor="client"
                className="flex items-center justify-between w-full p-4 text-gray-500 bg-gray-50 border border-gray-200 rounded-xl cursor-pointer peer-checked:border-rose-600 peer-checked:text-rose-600 hover:text-gray-600 hover:bg-gray-100"
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
            <RadioGroupItem value={Role.EMPLOYEE} id="employee" className="peer sr-only"/>
              <Label
                htmlFor="employee"
                className="flex items-center justify-between w-full p-4 text-gray-500 bg-gray-50 border border-gray-200 rounded-xl cursor-pointer peer-checked:border-rose-600 peer-checked:text-rose-600 hover:text-gray-600 hover:bg-gray-100"
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
              <RadioGroupItem value={Role.OWNER} id="owner" className="peer sr-only" />
              <Label
                htmlFor="owner"
                className="flex items-center justify-between w-full p-4 text-gray-500 bg-gray-50 border border-gray-200 rounded-xl cursor-pointer peer-checked:border-rose-600 peer-checked:text-rose-600 hover:text-gray-600 hover:bg-gray-100"
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
          <Button className = " text-rose-800 rounded-xl bg-rose-300"onClick={handleContinue} disabled={!selectedRole}>
             Continue
            </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default RegisterRoleSelectionComponent;
