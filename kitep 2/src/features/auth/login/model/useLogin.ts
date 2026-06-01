import { useState } from "react";
import { loginUser } from "@/shared/api/auth";
import { useAuth } from "@/entities/user/model/useAuth";

export const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async (identifier: string, password: string) => {
    try {
      setLoading(true);

      const res = await loginUser({
        identifier,
        password,
      });

      console.log("LOGIN RESPONSE:", res.data);

      const accessToken = res.data.access;
      const user = res.data.user;

      if (!accessToken || !user) {
        alert("Ошибка входа: backend не вернул токен или пользователя");
        return false;
      }

      login(user, accessToken);

      return true;
    } catch (error: any) {
      console.log("LOGIN ERROR:", error?.response?.data || error);

      const message =
        error?.response?.data?.error ||
        "Ошибка входа. Проверьте логин/email и пароль.";

      alert(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    handleLogin,
    loading,
  };
};