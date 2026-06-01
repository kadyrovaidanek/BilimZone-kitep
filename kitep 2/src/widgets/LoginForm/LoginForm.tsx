import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { LoginFields } from "@/features/auth/login/ui/LoginFields";
import { useTranslation } from "react-i18next";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.45,
      ease: "easeOut",
    },
  },
};

export const LoginForm = () => {
  const { t } = useTranslation();

  return (
    <motion.div
      className="
        w-full 
        max-w-md 
        mx-auto 
        flex 
        flex-col 
        bg-white 
        p-8 md:p-10 
        rounded-2xl 
        shadow-xl 
        border border-slate-100
      "
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* 🔹 Заголовок */}
      <motion.div className="text-center mb-8" variants={itemVariants}>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          {t("auth.entrence")}
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          {t("auth.entrence_text")}
        </p>
      </motion.div>

      {/* 🔹 Поля */}
      <motion.div variants={itemVariants}>
        <LoginFields />
      </motion.div>

      {/* 🔹 Ссылки */}
      <motion.div
        className="flex justify-between items-center text-sm mt-5"
        variants={itemVariants}
      >
        <Link
          to="/register"
          className="
            font-semibold 
            text-blue-500 
            hover:text-blue-700 
            transition
          "
        >
          {t("auth.create_account")}
        </Link>

        <Link
          to="/forgot-password"
          className="
            font-semibold 
            text-blue-500 
            hover:text-blue-700 
            transition
          "
        >
          {t("auth.forgot_password")}
        </Link>
      </motion.div>
    </motion.div>
  );
};