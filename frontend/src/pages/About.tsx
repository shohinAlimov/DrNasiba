import React from "react";
import { useAuth } from "../context/AuthContext";

const Home: React.FC = () => {
  const { user } = useAuth();

  return <div>Привет {user?.name || "Гость"}!</div>;
};

export default Home;
