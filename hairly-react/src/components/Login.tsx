import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import collageBackground from '@/assets/collage_background.png';

const Login: React.FC = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    // Perform any login logic here if needed
    navigate('/salon-owner-profile'); // Navigate to the Salon Owner Profile page
  };

  return (
    <>
      <section
        className="bg-cover bg-center"
        style={{ backgroundImage: `url(${collageBackground})` }}
      >
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0 opacity-90 rounded-xl">
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-200 dark:border-gray-700 rounded-xl">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-rose-900 md:text-2xl dark:text-black">
                Login
              </h1>
              <br />
              <form className="space-y-4 md:space-y-6" action="#">
                <div>
                  <label htmlFor="email" className="block rounded-xl mb-2 text-sm font-medium text-rose-900 dark:text-black">
                    Your email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    className="bg-rose-50 rounded-xl border border-rose-300 text-rose-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-rose-300 dark:border-rose-300 dark:placeholder-rose-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-rose-500"
                    placeholder="name@email.com"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block mb-2 text-sm font-medium text-rose-900 dark:text-black">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    placeholder="••••••••"
                    className="bg-rose-50 border border-rose-300 rounded-xl text-rose-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-rose-300 dark:border-rose-300 dark:placeholder-rose-400 dark:text-white dark:focus:ring-rose-500 dark:focus:border-rose-500"
                    required
                  />
                </div>
                <div>
                  <button
                    type="button"
                    className="flex w-full justify-center items-center border border-rose-200 rounded-md bg-white px-3  py-1.5 rounded-xl text-sm leading-6 text-rose-700 shadow-sm hover:bg-rose-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-200"
                  >
                    <FontAwesomeIcon icon={faGoogle} style={{ color: '#e81a4a' }} />
                    <span className="ml-2">Login with Google</span>
                  </button>
                </div>
                <div>
                  <button
                    type="button"
                    onClick={handleLoginClick}
                    className="flex w-full justify-center rounded-xl bg-rose-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-rose-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600"
                  >
                    Login
                  </button>
                </div>
                <p className="text-sm font-medium text-rose-800 dark:text-rose-800">
                  You do not have an account?{' '}
                  <Link to="/register" className="font-bold text-primary-600 hover:underline dark:text-primary-500">
                    Register here
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Login;