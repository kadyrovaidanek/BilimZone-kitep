import { Link, NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/entities/user/model/useAuth";
import logo from "@/assets/images/logo.svg";
import { useState } from "react";
import { AdvancedCatalog } from "../catalog/AdvancedCatalog";
import { Menu, X, ChevronDown } from "lucide-react";

export const Header = () => {
  const { user, logout } = useAuth();
  const { t, i18n } = useTranslation();

  const [openCatalog, setOpenCatalog] = useState(false);
  const [openMobileMenu, setOpenMobileMenu] = useState(false);
  const [openMobileCatalog, setOpenMobileCatalog] = useState(false);

  const changeLanguage = (lang: "ru" | "kg") => {
    i18n.changeLanguage(lang);
  };

  const closeMobileMenu = () => {
    setOpenMobileMenu(false);
    setOpenMobileCatalog(false);
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? "text-blue-900 font-semibold" : "hover:text-blue-900";

  return (
    <header className="w-full border-b border-slate-200 bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
        {/* ЛОГО */}
        <Link to="/" className="flex items-center gap-3" onClick={closeMobileMenu}>
          <img src={logo} alt="Bilimzone" className="w-10 h-10 sm:w-12 sm:h-12" />
        </Link>

        {/* DESKTOP MENU */}
        <nav className="hidden lg:flex items-center gap-10 text-slate-700 font-medium">
          <NavLink to="/" className={navLinkClass}>
            {t("home")}
          </NavLink>

          <div
            className="relative"
            onMouseEnter={() => setOpenCatalog(true)}
            onMouseLeave={() => setOpenCatalog(false)}
          >
            <Link to="/catalog" className="cursor-pointer hover:text-blue-900">
              {t("header.catalog")}
            </Link>

            {openCatalog && (
              <div className="absolute top-full left-0 mt-2 z-50">
                <AdvancedCatalog />
              </div>
            )}
          </div>

          <NavLink to="/about" className={navLinkClass}>
            {t("about")}
          </NavLink>
        </nav>

        {/* DESKTOP RIGHT */}
        <div className="hidden lg:flex items-center gap-6">
          <div className="flex gap-2 text-sm border rounded-lg px-2 py-1">
            <button
              type="button"
              onClick={() => changeLanguage("ru")}
              className={`px-2 py-1 rounded ${i18n.language === "ru" ? "bg-slate-200 font-semibold" : "hover:bg-slate-100"
                }`}
            >
              RU
            </button>

            <button
              type="button"
              onClick={() => changeLanguage("kg")}
              className={`px-2 py-1 rounded ${i18n.language === "kg" ? "bg-slate-200 font-semibold" : "hover:bg-slate-100"
                }`}
            >
              KG
            </button>
          </div>

          {user ? (
            <button
              type="button"
              onClick={logout}
              className="text-red-500 font-medium hover:underline"
            >
              {t("auth.logout")}
            </button>
          ) : (
            <Link to="/login" className="text-orange-500 font-medium hover:underline">
              {t("login")}
            </Link>
          )}
        </div>

        {/* MOBILE RIGHT */}
        <div className="flex lg:hidden items-center gap-3">
          <div className="flex gap-1 text-xs border rounded-lg px-1 py-1">
            <button
              type="button"
              onClick={() => changeLanguage("ru")}
              className={`px-2 py-1 rounded ${i18n.language === "ru" ? "bg-slate-200 font-semibold" : "hover:bg-slate-100"
                }`}
            >
              RU
            </button>

            <button
              type="button"
              onClick={() => changeLanguage("kg")}
              className={`px-2 py-1 rounded ${i18n.language === "kg" ? "bg-slate-200 font-semibold" : "hover:bg-slate-100"
                }`}
            >
              KG
            </button>
          </div>

          <button
            type="button"
            onClick={() => setOpenMobileMenu((prev) => !prev)}
            className="p-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50"
            aria-label="Open menu"
          >
            {openMobileMenu ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {openMobileMenu && (
        <div className="lg:hidden border-t border-slate-200 bg-white shadow-sm">
          <div className="px-4 py-4 space-y-2 text-slate-700 font-medium">
            <NavLink
              to="/"
              onClick={closeMobileMenu}
              className={({ isActive }) =>
                `block px-4 py-3 rounded-xl ${isActive ? "bg-blue-50 text-blue-900 font-semibold" : "hover:bg-slate-50"
                }`
              }
            >
              {t("home")}
            </NavLink>

            <div>
              <button
                type="button"
                onClick={() => setOpenMobileCatalog((prev) => !prev)}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl hover:bg-slate-50"
              >
                <span>{t("header.catalog")}</span>
                <ChevronDown
                  size={18}
                  className={`transition-transform ${openMobileCatalog ? "rotate-180" : ""}`}
                />
              </button>

              {openMobileCatalog && (
                <div className="mt-2 rounded-xl border border-slate-100 bg-slate-50 p-3 overflow-x-auto">
                  <div className="min-w-[280px]">
                    <AdvancedCatalog />
                  </div>
                </div>
              )}
            </div>

            <NavLink
              to="/about"
              onClick={closeMobileMenu}
              className={({ isActive }) =>
                `block px-4 py-3 rounded-xl ${isActive ? "bg-blue-50 text-blue-900 font-semibold" : "hover:bg-slate-50"
                }`
              }
            >
              {t("about")}
            </NavLink>

            <div className="pt-3 border-t border-slate-100">
              {user ? (
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    closeMobileMenu();
                  }}
                  className="w-full text-left px-4 py-3 rounded-xl text-red-500 font-medium hover:bg-red-50"
                >
                  {t("auth.logout")}
                </button>
              ) : (
                <Link
                  to="/login"
                  onClick={closeMobileMenu}
                  className="block px-4 py-3 rounded-xl text-orange-500 font-medium hover:bg-orange-50"
                >
                  {t("login")}
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};