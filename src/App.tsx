// src/App.tsx
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Appointments } from './pages/Appointments/Appointments';
import { About } from './pages/About/About';
import { Home } from './pages/Home/Home';
import { Login } from './pages/Login/Login';
import { Registration } from './pages/Registration/Registration';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Appointments" element={<Appointments />} />
        <Route path="/About" element={<About />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Registration" element={<Registration />} />
      </Routes>
    </Router>

  );
};

export default App;
