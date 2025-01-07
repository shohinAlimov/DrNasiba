import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegistrationPage from './pages/RegistrationPage';
import AccountPage from './pages/AccountPage';
import AppointmentPage from './pages/AppointmentPage';
import { Header } from './components/Header';
import './styles/css/style.css'
import Home from './pages/Home';
import About from './pages/About';

const App: React.FC = () => {
  return (
    <>
      <Header />
      <main>
        <Routes>
          <Route path="/appointments" element={<AppointmentPage />} />;
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<RegistrationPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>
    </>

  );
};

export default App;
