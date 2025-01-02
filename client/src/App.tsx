import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Account from "./pages/Account/Account";
import { Header } from "./ui/Header";
import Appointments from "./pages/Appointments";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/account" element={<Account />} />
        <Route path="/appointments" element={<Appointments />} />
        <Route path="/" element={<h1>Welcome to the Home Page</h1>} />
      </Routes>
    </>
  );
}

export default App;
