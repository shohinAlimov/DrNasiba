import React from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const token = localStorage.getItem("authToken");

  if (!token) {
    return <Navigate to="/login" />; // Redirect to login if no token
  }

  return <>{children}</>;
};

export default ProtectedRoute;
