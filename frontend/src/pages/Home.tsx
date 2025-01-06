import React from "react";
import { useAuth } from "../context/AuthContext";

const Home: React.FC = () => {
  const { user } = useAuth();

  return <div>Hello {user?.name || "Guest"}!</div>;
};

export default Home;
