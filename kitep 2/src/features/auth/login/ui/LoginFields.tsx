import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLogin } from "../model/useLogin";

export const LoginFields = () => {
  const { t } = useTranslation();
  const { handleLogin, loading } = useLogin();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await handleLogin(identifier, password);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          {t("auth.login_or_email", "Логин или email")}
        </label>

        <input
          type="text"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          placeholder={t("auth.login_or_email", "Логин или email")}
          className="
            w-full
            rounded-xl
            border border-slate-200
            px-4 py-3
            text-sm
            outline-none
            focus:border-blue-400
            focus:ring-2
            focus:ring-blue-100
          "
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          {t("auth.password", "Пароль")}
        </label>

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t("auth.password", "Пароль")}
            className="
              w-full
              rounded-xl
              border border-slate-200
              px-4 py-3 pr-12
              text-sm
              outline-none
              focus:border-blue-400
              focus:ring-2
              focus:ring-blue-100
            "
          />

          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="
     w-full
    rounded-xl
    bg-slate-900
    py-3
    text-white
    font-semibold
    hover:bg-slate-800
    transition
    disabled:bg-slate-400
    disabled:cursor-not-allowed
          "
      >
        {loading ? t("auth.loading", "Вход...") : t("auth.submit", "Войти")}
      </button>
    </form>
  );
};