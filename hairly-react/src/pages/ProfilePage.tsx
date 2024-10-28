// ProfilePage.tsx
import React, { useState, useEffect } from 'react';
import EmployeeDashboard from "../components/EmployeeDashboard";
import { fetchUserData, User, Role } from '../apiService';
import { ClientDashboardComponent } from '@/components/ClientDashboard';
import OwnerDashboard from '@/components/OwnerDashboard';

const ProfilePage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  

  useEffect(() => {
    const fetchUser = async () => {
        const token = localStorage.getItem('access_token'); 
        console.log("Fetching user with token:", token);

        if (!token) {
            setError("No authentication token found");
            setLoading(false);
            return;
        }

        try {
            const userData = await fetchUserData(token); 
            setUser(userData);
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Unknown error occurred');
        } finally {
            setLoading(false);
        }
    };

    fetchUser();
}, []);


  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading profile: {error}</div>;

  if (!user || !user.role) {
      return <div>No user data available.</div>; 
  }

  switch (user.role) {
      case Role.OWNER:
          return <OwnerDashboard user={user} />;
      case Role.CLIENT:
          return <ClientDashboardComponent user={user} />;
      case Role.EMPLOYEE:
          return <EmployeeDashboard user={user} />;
      default:
          return <div>Access Denied</div>;
  }
};

export default ProfilePage;