import { Link as NavLink, useLocation } from "react-router-dom";
import React from "react";
import "/src/index.css";
import { useAuth, isTokenExpired, removeTokens,  } from "../tokenService";
import { useTranslation } from 'react-i18next';
import polandFlag from '../assets/poland.png';
import ukFlag from '../assets/united-kingdom.png';

const Navbar: React.FC = () => {
  const { i18n, t } = useTranslation();
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const { token } = useAuth();
  const isAuthenticated = token && !isTokenExpired(); 
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/v1/auth/oauth2/logout', {
        method: 'POST',
        credentials: 'include', 
      });

      if (response.ok) {
        removeTokens();
        window.location.href = '/';
      } else {
        console.error('Failed to log out');
      }
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <nav
      className={`${
        isHomePage ? "absolute top-0 left-0 w-full bg-transparent" : "relative bg-white"
      } border-non transition-all duration-300`}
      style={isHomePage ? { zIndex: 10 } : {}}
    >
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <div className="flex flex-1 items-center justify-between md:justify-start">
            {/* Logo */}
            <NavLink className="flex items-center mr-4" to="/">
              <img src="src/assets/hair-cut.png" alt="Logo" className="h-10 w-10" />
              <span className="hidden md:block text-rose-700 text-4xl font-bold ml-2 app-name">Hairly</span>
            </NavLink>

            <div className="ml-auto flex space-x-4">
              <NavLink
                to="/"
                className="text-rose-700 font-bold bg-white bg-opacity-80 rounded-xl px-4 py-2 transition-all duration-300 ease-in-out transform hover:bg-rose-900 hover:text-white hover:scale-105 focus:ring-2 focus:ring-rose-700 focus:ring-opacity-50"
              >
                {t('home')}
              </NavLink>
              <NavLink
                to="/offerts"
                className="text-rose-700 font-bold bg-white bg-opacity-80 rounded-xl px-4 py-2 transition-all duration-300 ease-in-out transform hover:bg-rose-900 hover:text-white hover:scale-105 focus:ring-2 focus:ring-rose-700 focus:ring-opacity-50"
              >
                {t('searchSalon')}
              </NavLink>
              <NavLink
                to="/new-business"
                className="text-rose-700 font-bold bg-white bg-opacity-80 rounded-xl px-4 py-2 transition-all duration-300 ease-in-out transform hover:bg-rose-900 hover:text-white hover:scale-105 focus:ring-2 focus:ring-rose-700 focus:ring-opacity-50"
              >
               {t('forBusiness')}
              </NavLink>
              {isAuthenticated ? (
                <>
                  <NavLink
                    to="/profile"
                    className="text-rose-700 font-bold bg-white bg-opacity-80 rounded-xl px-4 py-2 transition-all duration-300 ease-in-out transform hover:bg-rose-900 hover:text-white hover:scale-105 focus:ring-2 focus:ring-rose-700 focus:ring-opacity-50"
                  >
                    {t('profileNavbar')}
                  </NavLink>
                  <button
                    onClick={handleLogout}
                    className="text-rose-700 font-bold bg-white bg-opacity-80 rounded-xl px-4 py-2 transition-all duration-300 ease-in-out transform hover:bg-rose-900 hover:text-white hover:scale-105 focus:ring-2 focus:ring-rose-700 focus:ring-opacity-50"
                  >
                    {t('logout')}
                  </button>
                </>
              ) : (
                <NavLink
                  to="/login"
                  className="text-rose-700 font-bold bg-white bg-opacity-80 rounded-xl px-4 py-2 transition-all duration-300 ease-in-out transform hover:bg-rose-900 hover:text-white hover:scale-105 focus:ring-2 focus:ring-rose-700 focus:ring-opacity-50"
                >
                  {t('login')}
                </NavLink>
              )}
              <div className="flex space-x-2">
                <button
                  onClick={() => changeLanguage('en')}
                  className="text-rose-700 font-bold bg-white bg-opacity-80 rounded-xl px-4 py-2 transition-all duration-300 ease-in-out transform hover:bg-rose-900 hover:text-white hover:scale-105 focus:ring-2 focus:ring-rose-700 focus:ring-opacity-50"
                >
                  <img src={ukFlag} alt="English" className="w-6 h-6" />
                </button>
                <button
                  onClick={() => changeLanguage('pl')}
                  className="text-rose-700 font-bold bg-white bg-opacity-80 rounded-xl px-4 py-2 transition-all duration-300 ease-in-out transform hover:bg-rose-900 hover:text-white hover:scale-105 focus:ring-2 focus:ring-rose-700 focus:ring-opacity-50"
                >
                  <img src={polandFlag} alt="Polish" className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;