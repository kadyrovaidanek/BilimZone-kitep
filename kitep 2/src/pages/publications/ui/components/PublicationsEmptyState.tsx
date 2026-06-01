import { FileText, PlusCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export const PublicationsEmptyState = () => {
    const { t } = useTranslation();

    return (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center sm:p-10">
            <FileText className="mx-auto mb-4 h-14 w-14 text-slate-300" />

            <h2 className="text-xl font-black text-slate-900">
                {t("publications.empty.title")}
            </h2>

            <p className="mt-2 text-sm text-slate-500 sm:text-base">
                {t("publications.empty.text")}
            </p>

            <Link
                to="/publications/create"
                className="mt-5 inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800 sm:text-base"
            >
                <PlusCircle size={20} />
                {t("publications.add")}
            </Link>
        </div>
    );
};