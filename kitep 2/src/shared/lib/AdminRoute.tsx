import { Navigate } from "react-router-dom";
import { useAuth } from "@/entities/user/model/useAuth";
import { ReactNode } from "react";

export const AdminRoute = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (user.role !== "manager_admin") {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};