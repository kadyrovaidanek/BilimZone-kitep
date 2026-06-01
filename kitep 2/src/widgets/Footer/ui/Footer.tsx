import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import logo from "@/assets/images/logo.svg";

export const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="w-full border-t border-slate-200 bg-[#E9EEF5]">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-8 sm:px-6 md:grid-cols-3 lg:px-8 lg:py-10">
        <div className="min-w-0">
          <Link to="/" className="inline-flex items-center gap-3">
            <img
              src={logo}
              alt="Bilimzone"
              className="h-10 w-10 shrink-0 object-contain"
            />

            <span className="text-lg font-black text-slate-800">
              Bilimzone
            </span>
          </Link>

          <p className="mt-3 max-w-sm text-sm leading-6 text-slate-500">
            {t("footer.text")}
          </p>
        </div>

        <div className="min-w-0">
          <h4 className="text-base font-black text-slate-800">
            {t("footer.about")}
          </h4>

          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            <li>
              <Link to="/about" className="transition hover:text-blue-600">
                {t("footer.history")}
              </Link>
            </li>

            <li>
              <Link to="/support" className="transition hover:text-blue-600">
                {t("footer.docs")}
              </Link>
            </li>
          </ul>
        </div>

        <div className="min-w-0">
          <h4 className="text-base font-black text-slate-800">
            {t("footer.support")}
          </h4>

          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            <li>
              <Link to="/support" className="transition hover:text-blue-600">
                {t("footer.contacts")}
              </Link>
            </li>

            <li>
              <Link to="/support" className="transition hover:text-blue-600">
                {t("footer.faq")}
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-200 px-4 py-4 text-center text-sm text-slate-500">
        © 2026 Bilimzone
      </div>
    </footer>
  );
};