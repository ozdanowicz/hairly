import{ useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Scissors, User, Briefcase } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Role, fetchUserData} from '@/apiService'; 
import {useAuth} from '@/tokenService';
import { useTranslation } from 'react-i18next';


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
  const { t } = useTranslation();
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const accessToken = urlParams.get('access_token');

    if (accessToken) {
      setToken(accessToken);
      localStorage.setItem('authToken', accessToken);
    }

    const effectiveToken = accessToken || token;

    if (effectiveToken) {
      fetchUserData(effectiveToken)
        .then((userData) => setUser(userData))
        .catch((error) => {
          console.error(t('error.fetch_user_data'), error);
          navigate('/login');
        });
    } else {
      navigate('/login');
    }
  }, [token, navigate, setToken, t]);

  const handleContinue = () => {
    if (selectedRole && token) {
      fetch(`${process.env.REACT_APP_API_BASE_URL}/auth/add-role?role=${selectedRole}`, {
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
            console.error(t('error.set_role'));
          }
        })
        .catch(error => {
          console.error(t('error.general'), error);
        });
    } else {
      console.error(t('error.no_role_selected'));
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center items-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">{t('register.title')}</CardTitle>
          <CardDescription className="text-center">{t('register.description')}</CardDescription>
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
                    <div className="w-full text-lg font-semibold">{t('roles.client.title')}</div>
                    <div className="w-full text-sm">{t('roles.client.description')}</div>
                  </div>
                </div>
              </Label>
            </div>
            <div>
              <RadioGroupItem value={Role.EMPLOYEE} id="employee" className="peer sr-only" />
              <Label
                htmlFor="employee"
                className="flex items-center justify-between w-full p-4 text-gray-500 bg-gray-50 border border-gray-200 rounded-xl cursor-pointer peer-checked:border-rose-600 peer-checked:text-rose-600 hover:text-gray-600 hover:bg-gray-100"
              >
                <div className="flex items-center">
                  <Scissors className="w-6 h-6 mr-3" />
                  <div>
                    <div className="w-full text-lg font-semibold">{t('roles.employee.title')}</div>
                    <div className="w-full text-sm">{t('roles.employee.description')}</div>
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
                    <div className="w-full text-lg font-semibold">{t('roles.owner.title')}</div>
                    <div className="w-full text-sm">{t('roles.owner.description')}</div>
                  </div>
                </div>
              </Label>
            </div>
          </RadioGroup>
        </CardContent>
        <CardFooter>
          <Button className="text-rose-800 rounded-xl bg-rose-300" onClick={handleContinue} disabled={!selectedRole}>
            {t('register.continue')}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default RegisterRoleSelectionComponent;
