import React, { useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import collageBackground from '@/assets/back1.png';
import { useNavigate } from 'react-router-dom';
import { useAuth, isTokenExpired, saveTokens } from '../tokenService';
import { useTranslation } from 'react-i18next';

const Login: React.FC = () => {
  const { token, setToken } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    const checkTokenInLocalStorage = () => {
      const accessToken = localStorage.getItem('accessToken');
      if (accessToken && !isTokenExpired()) {
        setToken(accessToken);
        navigate('/profile');
      } else {
        fetch('http://localhost:8080/api/v1/auth/check-token', {
          method: 'GET',
          credentials: 'include', 
        })
          .then(response => response.json())
          .then(data => {
            if (data.accessToken) {
              saveTokens(data.accessToken, data.refreshToken, data.expiresIn);
              setToken(data.accessToken);
              localStorage.setItem('accessToken', data.accessToken);
              navigate('/profile');
            }
          })
          .catch(error => {
            console.error('Failed to check token with backend:', error);
          });
      }
    };

    checkTokenInLocalStorage();
  }, [navigate, setToken]);

  const handleGoogleLogin = () => {
    window.location.href = `http://localhost:8080/login/oauth2/code/google`; 
  };

  return (
    <section
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${collageBackground})` }}
    >
      <Card className="w-full max-w-md mx-auto">
      <CardContent className="flex flex-col items-center space-y-14 p-12">
      <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 48 48"
    width="164"
    height="164" 
  >
    <path
      fill="#FFC107"
      d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
    />
    <path
      fill="#FF3D00"
      d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
    />
    <path
      fill="#4CAF50"
      d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
    />
    <path
      fill="#1976D2"
      d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
    />
  </svg>
        <h2 className="text-3xl font-semibold text-center">{t('signInGoogle')}</h2>
        <Button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full max-w-xs bg-white hover:bg-gray-50 text-1xl text-gray-900 font-semibold border border-gray-300 rounded-xl shadow-sm transition duration-150 ease-in-out"
          >
          <svg
            className="w-5 h-5 mr-2 inline-block"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
              <path
                fill="#4285F4"
                d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"
              />
              <path
                fill="#34A853"
                d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"
              />
              <path
                fill="#FBBC05"
                d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"
              />
              <path
                fill="#EA4335"
                d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"
              />
            </g>
          </svg>
          {t('signIn')} 
        </Button>
      </CardContent>
    </Card>
    </section>
  );
};

export default Login;
