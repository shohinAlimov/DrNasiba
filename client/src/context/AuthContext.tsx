import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { getAccountDetails } from "../../../backend/services/api";

interface User {
  name: string;
  logo: string | null;
}

interface AuthContextProps {
  isLoggedIn: boolean;
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("authToken"));
  const [user, setUser] = useState<User | null>(null);

  const fetchUserDetails = async () => {
    try {
      const response = await getAccountDetails();
      if (response.data) {
        setUser({
          name: response.data.name || "Account",
          logo: response.data.logo || null,
        });
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchUserDetails(); // Fetch user details on app load
    }
  }, [isLoggedIn]);

  const login = (userData: Partial<User>) => {
    setIsLoggedIn(true);
    setUser((prev) => ({ ...prev, ...userData } as User));
  };


  const logout = () => {
    localStorage.removeItem("authToken"); // Remove token
    setIsLoggedIn(false); // Update logged-in state
    setUser(null); // Clear user data
  };

  const updateUser = (userData: Partial<User>) => {
    setUser((prev) => ({ ...prev, ...userData } as User));
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
