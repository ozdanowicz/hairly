import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Scissors, User, Briefcase } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import {Role } from '../apiService'; // Adjust the path as needed

export function RegisterRoleSelectionComponent() {
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const navigate = useNavigate();
    const location = useLocation();

    // Extract access token from URL
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const token = params.get('access_token');
        if (token) {
            setAccessToken(token);
            localStorage.setItem('access_token', token);  // Use the same key for consistency
        }
    }, [location.search]);

    const handleContinue = () => {
        if (selectedRole && accessToken) {
            console.log('Selected role:', selectedRole);
            fetch("http://localhost:8080/api/v1/auth/add-role?role=EMPLOYEE", {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ role: selectedRole })
            })
            .then(response => {
                if (response.ok) {
                    console.log('Role updated successfully');
                    navigate('/profile');  // Redirect to profile after role assignment
                } else {
                    console.error('Failed to update role:', response.statusText);
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
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
