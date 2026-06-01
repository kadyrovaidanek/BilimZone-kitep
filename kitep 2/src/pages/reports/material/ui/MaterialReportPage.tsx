import { Link } from "react-router-dom";
import { ArrowLeft, BarChart3, RotateCcw, Search } from "lucide-react";
import { useTranslation } from "react-i18next";

import { MaterialPurchaseHistoryTable } from "../components/MaterialPurchaseHistoryTable";
import { MaterialReportChart } from "../components/MaterialReportChart";
import { MaterialReportSummary } from "../components/MaterialReportSummary";
import { useMaterialReport } from "../hooks/useMaterialReport";
import type { MaterialReportRole } from "../model/types";

type Props = {
    role?: MaterialReportRole;
};

export const MaterialReportPage = ({ role = "owner" }: Props) => {
    const { t } = useTranslation();

    const {
        data,
        filters,
        isLoading,
        error,
        handleFilterChange,
        handleApplyFilters,
        handleResetFilters,
    } = useMaterialReport(role);

    return (
        <main className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl space-y-5">
                <Link
                    to={role === "admin" ? "/admin/reports" : "/reports"}
                    className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 transition hover:text-blue-600"
                >
                    <ArrowLeft size={18} />
                    {t("materialReport.back")}
                </Link>

                <header className="rounded-3xl bg-gradient-to-br from-slate-900 to-slate-700 p-5 text-white shadow-sm sm:p-7">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm font-bold uppercase tracking-wide text-blue-200">
                                {role === "admin"
                                    ? t("materialReport.adminBadge")
                                    : t("materialReport.ownerBadge")}
                            </p>

                            <h1 className="mt-2 text-2xl font-black sm:text-3xl">
                                {data?.publication.title || t("materialReport.title")}
                            </h1>

                            {data && (
                                <p className="mt-2 max-w-2xl text-sm font-medium text-slate-200 sm:text-base">
                                    {data.publication.category} ·{" "}
                                    {data.publication.author_username}
                                </p>
                            )}
                        </div>

                        <div className="rounded-3xl bg-white/10 p-4">
                            <BarChart3 size={36} />
                        </div>
                    </div>
                </header>

                <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                    <h2 className="mb-4 text-base font-black text-slate-900 sm:text-lg">
                        {t("materialReport.filters.title")}
                    </h2>

                    <div className="grid gap-3 md:grid-cols-3">
                        <label className="block">
                            <span className="mb-1 block text-xs font-bold text-slate-600">
                                {t("materialReport.filters.dateFrom")}
                            </span>
                            <input
                                type="date"
                                value={filters.date_from}
                                onChange={(event) =>
                                    handleFilterChange("date_from", event.target.value)
                                }
                                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold outline-none focus:border-blue-500"
                            />
                        </label>

                        <label className="block">
                            <span className="mb-1 block text-xs font-bold text-slate-600">
                                {t("materialReport.filters.dateTo")}
                            </span>
                            <input
                                type="date"
                                value={filters.date_to}
                                onChange={(event) =>
                                    handleFilterChange("date_to", event.target.value)
                                }
                                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold outline-none focus:border-blue-500"
                            />
                        </label>

                        <label className="block">
                            <span className="mb-1 block text-xs font-bold text-slate-600">
                                {t("materialReport.filters.search")}
                            </span>
                            <input
                                type="text"
                                value={filters.search}
                                onChange={(event) =>
                                    handleFilterChange("search", event.target.value)
                                }
                                placeholder={t("materialReport.filters.searchPlaceholder")}
                                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold outline-none focus:border-blue-500"
                            />
                        </label>
                    </div>

                    <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                        <button
                            type="button"
                            onClick={handleApplyFilters}
                            disabled={isLoading}
                            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-black text-white transition hover:bg-blue-700 disabled:bg-slate-300"
                        >
                            <Search size={18} />
                            {t("materialReport.filters.apply")}
                        </button>

                        <button
                            type="button"
                            onClick={handleResetFilters}
                            disabled={isLoading}
                            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-100 px-5 py-3 text-sm font-black text-slate-800 transition hover:bg-slate-200 disabled:text-slate-400"
                        >
                            <RotateCcw size={18} />
                            {t("materialReport.filters.reset")}
                        </button>
                    </div>
                </section>

                {error && (
                    <div className="rounded-3xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-700">
                        {error}
                    </div>
                )}

                {isLoading && (
                    <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-sm font-bold text-slate-500">
                        {t("materialReport.messages.loading")}
                    </div>
                )}

                {!isLoading && data && (
                    <>
                        <MaterialReportSummary role={role} summary={data.summary} />

                        <MaterialReportChart
                            role={role}
                            salesByDate={data.charts.sales_by_date}
                        />

                        <MaterialPurchaseHistoryTable
                            role={role}
                            purchases={data.purchases}
                        />
                    </>
                )}
            </div>
        </main>
    );
};

export default MaterialReportPage;