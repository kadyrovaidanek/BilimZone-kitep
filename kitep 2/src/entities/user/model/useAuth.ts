import { useNavigate } from "react-router-dom";
import { useUserStore } from "./user-store";
import type { User } from "./types";

export const useAuth = () => {
  const navigate = useNavigate();

  const {
    user,
    isAuthenticated,
    setUser,
    logout: storeLogout,
  } = useUserStore();

  const login = (userData: User, accessToken?: string) => {
    if (accessToken) {
      localStorage.setItem("authToken", accessToken);
    }

    setUser(userData);

    if (userData.role === "manager_admin") {
      navigate("/admin");
    } else {
      navigate("/");
    }
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    localStorage.removeItem("registrationProgress");

    storeLogout();

    navigate("/");
  };

  return {
    user,
    isAuthenticated,
    login,
    logout,
  };
};