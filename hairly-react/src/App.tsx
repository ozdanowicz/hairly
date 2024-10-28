// import { useState } from 'react'
import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import OffertsPage from './pages/SalonsPage.tsx';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegistrationPage';
import './index.css';
import NewBusinessPage from './pages/NewBusinessPage';
import SalonOwnerProfilePage from './pages/SalonOwnerProfilePage';
import SalonRegistrationPage from './pages/SalonRegistrationPage';
import SalonDetails from './components/SalonDetails';
import AfterLoginRedirect from '././components/AfterLoginRedirection.tsx';
import ProfilePage from './pages/ProfilePage.tsx';
import { ClientDashboardComponent } from './components/ClientDashboard.tsx';
import EmployeeProfile from './components/EmployeeProfile.tsx';
import OAuthCallback from './components/OAuthCallback.tsx';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<MainLayout />}>
      <Route path="/" element={<HomePage />} />
      <Route path='/offerts' element={<OffertsPage />} />
      <Route path='/new-business' element={<NewBusinessPage />} />
      <Route path='/login' element={<LoginPage />} />
      <Route path="/after-login-redirect" element={<AfterLoginRedirect />} />
      <Route path='/salon-registration' element={<SalonRegistrationPage />} />
      <Route path='/role-selection' element={<RegisterPage/>} />
      <Route path='/profile' element={<ProfilePage />} />
      <Route path="/salon/:id" element={<SalonDetails />} />
      <Route path="/oauth/callback" element={<OAuthCallback />} />
      <Route path='/salon-owner-profile' element={<SalonOwnerProfilePage />} />
      <Route path='/client-profile' element={<ClientDashboardComponent/>} />
      <Route path='/employee-profile' element={<EmployeeProfile />} />
    </Route>
  )
);

const App: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default App;