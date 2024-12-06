// ProfilePage.tsx
import React, { useState, useEffect } from 'react';
import EmployeeDashboard from "../components/EmployeeDashboard";
import { fetchUserData, User, Role } from '../apiService';
import ClientDashboard from '../components/ClientDashboard';
import OwnerDashboard from '../components/OwnerDashboard';
import { useAuth, saveTokens } from '../tokenService';

const ProfilePage: React.FC = () => {
  const { token, setToken } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const accessToken = urlParams.get('access_token');
      const refreshToken = urlParams.get('refresh_token');
      const expiresIn = urlParams.get('expires_in');

      if (accessToken && refreshToken && expiresIn) {
        saveTokens(accessToken, refreshToken, parseInt(expiresIn, 10));
        setToken(accessToken);
      }

      const tokenToUse = accessToken || token;

      if (!tokenToUse) {
        setError("User is not authenticated.");
        setLoading(false);
        return;
      }

      try {
        const userData = await fetchUserData(tokenToUse);
        setUser(userData);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token, setToken]);


  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading profile: {error}</div>;

  if (!user || !user.role) {
      return <div>No user data available.</div>; 
  }

  switch (user.role) {
      case Role.OWNER:
          return <OwnerDashboard user={user} />;
      case Role.CLIENT:
          return <ClientDashboard user={user} />;
      case Role.EMPLOYEE:
          return <EmployeeDashboard user={user} />;
      default:
          return <div>Unknown role</div>;
  }
};

export default ProfilePage;