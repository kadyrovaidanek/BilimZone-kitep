import { BarChart3 } from "lucide-react";
import { useTranslation } from "react-i18next";

import { ReportCharts } from "../../shared/components/ReportCharts";
import { ReportExportButtons } from "../../shared/components/ReportExportButtons";
import { ReportFilters } from "../../shared/components/ReportFilters";
import { ReportSummaryCards } from "../../shared/components/ReportSummaryCards";
import { ReportTables } from "../../shared/components/ReportTables";
import { useReports } from "../../shared/hooks/useReports";

export const OwnerReportsPage = () => {
    const { t } = useTranslation();

    const {
        data,
        filters,
        isLoading,
        isExporting,
        error,
        handleFilterChange,
        handleApplyFilters,
        handleResetFilters,
        handleExport,
    } = useReports("owner");

    return (
        <main className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl space-y-5">
                <header className="rounded-3xl bg-gradient-to-br from-blue-700 to-slate-900 p-5 text-white shadow-sm sm:p-7">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm font-bold uppercase tracking-wide text-blue-200">
                                {t("reports.owner.badge")}
                            </p>

                            <h1 className="mt-2 text-2xl font-black sm:text-3xl">
                                {t("reports.owner.title")}
                            </h1>

                            <p className="mt-2 max-w-2xl text-sm font-medium text-slate-200 sm:text-base">
                                {t("reports.owner.subtitle")}
                            </p>
                        </div>

                        <div className="rounded-3xl bg-white/10 p-4">
                            <BarChart3 size={36} />
                        </div>
                    </div>
                </header>

                <ReportFilters
                    role="owner"
                    filters={filters}
                    isLoading={isLoading}
                    onChange={handleFilterChange}
                    onApply={handleApplyFilters}
                    onReset={handleResetFilters}
                />

                <ReportExportButtons
                    isExporting={isExporting}
                    onExport={handleExport}
                />

                {error && (
                    <div className="rounded-3xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-700">
                        {error}
                    </div>
                )}

                {isLoading && (
                    <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-sm font-bold text-slate-500">
                        {t("reports.messages.loading")}
                    </div>
                )}

                {!isLoading && data && (
                    <>
                        <ReportSummaryCards role="owner" data={data} />
                        <ReportCharts role="owner" data={data} />
                        <ReportTables role="owner" data={data} />
                    </>
                )}
            </div>
        </main>
    );
};

export default OwnerReportsPage;