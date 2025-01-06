import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Account from "./pages/Account/Account";
import { Header } from "./ui/Header";
import About from "./pages/About";
import Home from "./pages/Home";
import Appointments from "./pages/Appointments";

function App() {
  return (
    <>
      <Header />
      <main>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/account" element={<Account />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/about" element={<About />} />
          <Route path="/" element={<Home />} />
        </Routes>

      </main>
    </>
  );
}

export default App;
