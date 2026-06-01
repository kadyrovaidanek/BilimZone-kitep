import { BookOpen, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export const CollectionHeader = () => {
    const { t } = useTranslation();

    return (
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <h1 className="flex items-center gap-3 text-2xl font-black text-slate-900 sm:text-3xl">
                        <BookOpen className="text-blue-600" size={30} />
                        {t("collection.title")}
                    </h1>

                    <p className="mt-2 text-sm leading-6 text-slate-500 sm:text-base">
                        {t("collection.subtitle")}
                    </p>
                </div>

                <Link
                    to="/catalog"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700 sm:w-auto sm:text-base"
                >
                    <ShoppingBag size={20} />
                    {t("collection.goToCatalog")}
                </Link>
            </div>
        </div>
    );
};