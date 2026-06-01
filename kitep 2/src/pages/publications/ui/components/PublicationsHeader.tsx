import { PlusCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export const PublicationsHeader = () => {
    const { t } = useTranslation();

    return (
        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 sm:text-3xl">
                        {t("publications.title")}
                    </h1>

                    <p className="mt-2 text-sm text-slate-500 sm:text-base">
                        {t("publications.subtitle")}
                    </p>
                </div>

                <Link
                    to="/publications/create"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800 sm:w-auto sm:text-base"
                >
                    <PlusCircle size={20} />
                    {t("publications.add")}
                </Link>
            </div>
        </section>
    );
};