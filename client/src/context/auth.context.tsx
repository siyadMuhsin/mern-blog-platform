import React, { createContext, useState, useContext, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import type { IUser } from "../interfaces/interface";


interface AuthContextType {
  isAuthenticated: boolean;
  user: Partial<IUser> | null;
  login: (userData: Partial<IUser>) => void;
  logout: () => void;
  setUser: (userData: Partial<IUser>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<Partial<IUser> | null>(null);
  const navigate = useNavigate();

  const login = (userData: Partial<IUser>) => {
    setIsAuthenticated(true);
    setUser(userData);
    navigate("/");
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    // navigate("/auth");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};