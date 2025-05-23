import { useEffect } from "react";

import { checkAuth } from "../services/auth.service";
import { useAuth } from "../context/auth.context";
import { toast } from "react-toastify";

const useAuthHook = () => {
  const { login, logout } = useAuth();

  const checkAuthenticated = async () => {
    try {
      const result = await checkAuth();
      if (result.ok && result.user) {
        login(result.user);
      } else {
        logout();
      }
    } catch (error: any) {
      console.error("Error in authentication check:", error.message);
      toast.error("Session expired. Please log in again.");
      logout();
    }
  };

  useEffect(() => {
    checkAuthenticated();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
};

export default useAuthHook;