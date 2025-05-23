import React, { type JSX } from "react";
import { Navigate, replace } from "react-router-dom";
import { useAuth } from "../context/auth.context";

interface RouteProps {
  children: JSX.Element;
}



// 🔐 Protected route
const ProtectedRoute: React.FC<RouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/auth" replace />;
};

// 🔓 Public-only route
export const PublicOnlyRoute: React.FC<RouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/" replace /> : <>{children}</>;
};

export const helperLogout=()=>{
  const {logout}=useAuth()
  return logout()
}
export default ProtectedRoute;
