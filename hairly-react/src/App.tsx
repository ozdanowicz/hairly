// import { useState } from 'react'
import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import OffertsPage from './pages/OffertsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegistrationPage';
import './index.css';
import NewBusinessPage from './pages/NewBusinessPage';
import SalonOwnerProfilePage from './pages/SalonOwnerProfilePage';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<MainLayout />}>
      <Route path="/" element={<HomePage />} />
      <Route path='/offerts' element={<OffertsPage />} />
      <Route path='/new-business' element={<NewBusinessPage />} />
      <Route path='/login' element={<LoginPage />} />
      <Route path='/register' element={<RegisterPage />} />
      <Route path='/salon-owner-profile' element={<SalonOwnerProfilePage/>} />
    </Route>
  )
);

const App: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default App;