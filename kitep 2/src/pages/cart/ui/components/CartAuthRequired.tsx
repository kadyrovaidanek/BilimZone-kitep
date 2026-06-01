import { AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export const CartAuthRequired = () => {
    const { t } = useTranslation();

    return (
        <div className="min-h-screen bg-slate-50 px-4 py-10">
            <div className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-8 text-center">
                <AlertCircle className="mx-auto mb-4 h-12 w-12 text-orange-500" />

                <h1 className="text-2xl font-black text-slate-900">
                    {t("cart.authRequired")}
                </h1>

                <Link
                    to="/login"
                    className="mt-5 inline-flex rounded-2xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700 sm:text-base"
                >
                    {t("cart.login")}
                </Link>
            </div>
        </div>
    );
};