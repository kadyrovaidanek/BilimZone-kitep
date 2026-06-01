import { RotateCcw, Search } from "lucide-react";
import { useTranslation } from "react-i18next";

import type { ReportFilters as ReportFiltersType, ReportRole } from "../../model/types";

type Props = {
    role: ReportRole;
    filters: ReportFiltersType;
    isLoading: boolean;
    onChange: (field: keyof ReportFiltersType, value: string) => void;
    onApply: () => void;
    onReset: () => void;
};

export const ReportFilters = ({
    role,
    filters,
    isLoading,
    onChange,
    onApply,
    onReset,
}: Props) => {
    const { t } = useTranslation();

    return (
        <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <div className="mb-4">
                <h2 className="text-base font-black text-slate-900 sm:text-lg">
                    {t("reports.filters.title")}
                </h2>
                <p className="mt-1 text-sm font-medium text-slate-500">
                    {t("reports.filters.subtitle")}
                </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                <label className="block">
                    <span className="mb-1 block text-xs font-bold text-slate-600">
                        {t("reports.filters.dateFrom")}
                    </span>
                    <input
                        type="date"
                        value={filters.date_from}
                        onChange={(event) => onChange("date_from", event.target.value)}
                        className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold outline-none focus:border-blue-500"
                    />
                </label>

                <label className="block">
                    <span className="mb-1 block text-xs font-bold text-slate-600">
                        {t("reports.filters.dateTo")}
                    </span>
                    <input
                        type="date"
                        value={filters.date_to}
                        onChange={(event) => onChange("date_to", event.target.value)}
                        className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold outline-none focus:border-blue-500"
                    />
                </label>

                <label className="block">
                    <span className="mb-1 block text-xs font-bold text-slate-600">
                        {t("reports.filters.category")}
                    </span>
                    <input
                        type="text"
                        value={filters.category}
                        onChange={(event) => onChange("category", event.target.value)}
                        placeholder={t("reports.filters.categoryPlaceholder")}
                        className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold outline-none focus:border-blue-500"
                    />
                </label>

                {role === "admin" && (
                    <label className="block">
                        <span className="mb-1 block text-xs font-bold text-slate-600">
                            {t("reports.filters.owner")}
                        </span>
                        <input
                            type="text"
                            value={filters.owner}
                            onChange={(event) => onChange("owner", event.target.value)}
                            placeholder={t("reports.filters.ownerPlaceholder")}
                            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold outline-none focus:border-blue-500"
                        />
                    </label>
                )}

                <label className="block">
                    <span className="mb-1 block text-xs font-bold text-slate-600">
                        {t("reports.filters.search")}
                    </span>
                    <input
                        type="text"
                        value={filters.search}
                        onChange={(event) => onChange("search", event.target.value)}
                        placeholder={t("reports.filters.searchPlaceholder")}
                        className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold outline-none focus:border-blue-500"
                    />
                </label>
            </div>

            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <button
                    type="button"
                    onClick={onApply}
                    disabled={isLoading}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-black text-white transition hover:bg-blue-700 disabled:bg-slate-300"
                >
                    <Search size={18} />
                    {isLoading ? t("reports.filters.loading") : t("reports.filters.apply")}
                </button>

                <button
                    type="button"
                    onClick={onReset}
                    disabled={isLoading}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-100 px-5 py-3 text-sm font-black text-slate-800 transition hover:bg-slate-200 disabled:text-slate-400"
                >
                    <RotateCcw size={18} />
                    {t("reports.filters.reset")}
                </button>
            </div>
        </section>
    );
};