import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegistrationPage from './pages/RegistrationPage';
import AccountPage from './pages/AccountPage';
import AppointmentPage from './pages/AppointmentPage';


const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/appointments" element={<AppointmentPage />} />;
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/register" element={<RegistrationPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/account" element={<AccountPage />} />
    </Routes>
  );
};

export default App;
