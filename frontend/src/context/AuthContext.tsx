import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

// Define the type for AuthContext
type AuthContextType = {
  token: string | null;
  setToken: (token: string | null) => void;
  logout: () => void;
};

// Create the AuthContext
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [token, setTokenState] = useState<string | null>(null);

  // Load the token from sessionStorage on initialization
  useEffect(() => {
    const storedToken = sessionStorage.getItem('authToken');
    if (storedToken) {
      setTokenState(storedToken);
    }
  }, []);

  const setToken = (token: string | null) => {
    if (token) {
      sessionStorage.setItem('authToken', token);
    } else {
      sessionStorage.removeItem('authToken');
    }
    setTokenState(token);
  };

  const logout = () => {
    setToken(null); // Clear the token from memory and sessionStorage
  };

  return (
    <AuthContext.Provider value={{ token, setToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
