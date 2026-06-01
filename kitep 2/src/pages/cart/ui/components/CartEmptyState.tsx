import { ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export const CartEmptyState = () => {
    const { t } = useTranslation();

    return (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center sm:p-10">
            <ShoppingCart className="mx-auto mb-4 h-16 w-16 text-slate-300" />

            <h2 className="text-xl font-black text-slate-900">
                {t("cart.empty.title")}
            </h2>

            <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
                {t("cart.empty.text")}
            </p>

            <Link
                to="/catalog"
                className="mt-5 inline-flex items-center justify-center rounded-2xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700 sm:text-base"
            >
                {t("cart.empty.goCatalog")}
            </Link>
        </div>
    );
};