import { Link as NavLink, useLocation } from "react-router-dom";
import React from "react";
import "/src/index.css";

const Navbar: React.FC = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

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
                Home
              </NavLink>
              <NavLink
                to="/offerts"
                className="text-rose-700 font-bold bg-white bg-opacity-80 rounded-xl px-4 py-2 transition-all duration-300 ease-in-out transform hover:bg-rose-900 hover:text-white hover:scale-105 focus:ring-2 focus:ring-rose-700 focus:ring-opacity-50"
              >
                Find Salon
              </NavLink>
              <NavLink
                to="/new-business"
                className="text-rose-700 font-bold bg-white bg-opacity-80 rounded-xl px-4 py-2 transition-all duration-300 ease-in-out transform hover:bg-rose-900 hover:text-white hover:scale-105 focus:ring-2 focus:ring-rose-700 focus:ring-opacity-50"
              >
                For Business
              </NavLink>
              <NavLink
                to="/login"
                className="text-rose-700 font-bold bg-white bg-opacity-80 rounded-xl px-4 py-2 transition-all duration-300 ease-in-out transform hover:bg-rose-900 hover:text-white hover:scale-105 focus:ring-2 focus:ring-rose-700 focus:ring-opacity-50"
              >
                Login
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
