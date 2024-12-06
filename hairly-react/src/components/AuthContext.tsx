import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
const EXPIRY_KEY = 'tokenExpiry';

const getCurrentTime = () => Math.floor(Date.now() / 1000);

export function saveTokens(accessToken: string, refreshToken: string, expiresIn: number) {
  const expiryTime = getCurrentTime() + expiresIn;
  localStorage.setItem(TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  localStorage.setItem(EXPIRY_KEY, expiryTime.toString());
}

export function removeTokens() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(EXPIRY_KEY);
}

export function isTokenExpired(): boolean {
  const expiryTime = parseInt(localStorage.getItem(EXPIRY_KEY) || '0', 10);
  return getCurrentTime() >= expiryTime;
}

interface AuthContextType {
  token: string | null;
  setToken: (token: string | null) => void;
  removeTokens: () => void;
  logout: () => void; // Signal for navigation after logout
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem(TOKEN_KEY));

  const refreshTokens = useCallback(async () => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    if (!refreshToken) {
      removeTokens();
      setToken(null);
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/auth/refresh', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${refreshToken}` },
      });

      if (!response.ok) throw new Error('Token refresh failed');

      const { accessToken, expiresIn } = await response.json();
      saveTokens(accessToken, refreshToken, expiresIn);
      setToken(accessToken);
    } catch (error) {
      console.error('Failed to refresh tokens:', error);
      removeTokens();
      setToken(null);
    }
  }, []);

  useEffect(() => {
    if (isTokenExpired()) {
      refreshTokens();
    }

    const interval = setInterval(() => {
      if (isTokenExpired()) {
        refreshTokens();
      }
    }, 5 * 60 * 1000); // Refresh every 5 minutes if the token is expired

    return () => clearInterval(interval);
  }, [refreshTokens]);

  const logout = useCallback(() => {
    removeTokens();
    setToken(null);
  }, []);

  return (
    <AuthContext.Provider value={{ token, setToken, removeTokens, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
