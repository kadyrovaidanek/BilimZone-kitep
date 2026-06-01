import { Link } from "react-router-dom";
import { ExternalLink } from "lucide-react";
import { useTranslation } from "react-i18next";

import type { AdminReportData, OwnerReportData, ReportData, ReportRole } from "../../model/types";

type Props = {
    role: ReportRole;
    data: ReportData;
};

const formatMoney = (value?: number) => {
    return `${Number(value || 0).toLocaleString("ru-RU")} сом`;
};

export const ReportTables = ({ role, data }: Props) => {
    const { t } = useTranslation();

    if (role === "owner") {
        const ownerData = data as OwnerReportData;

        return (
            <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-100 p-4 sm:p-5">
                    <h2 className="text-base font-black text-slate-900 sm:text-lg">
                        {t("reports.tables.myPublications")}
                    </h2>
                    <p className="mt-1 text-sm font-medium text-slate-500">
                        {t("reports.tables.myPublicationsSubtitle")}
                    </p>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full text-left text-sm">
                        <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                            <tr>
                                <th className="px-4 py-3 font-black">
                                    {t("reports.tables.publication")}
                                </th>
                                <th className="px-4 py-3 font-black">
                                    {t("reports.tables.category")}
                                </th>
                                <th className="px-4 py-3 font-black">
                                    {t("reports.tables.count")}
                                </th>
                                <th className="px-4 py-3 font-black">
                                    {t("reports.tables.totalSales")}
                                </th>
                                <th className="px-4 py-3 font-black">
                                    {t("reports.tables.ownerIncome")}
                                </th>
                                <th className="px-4 py-3 font-black">
                                    {t("reports.tables.action")}
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-100">
                            {ownerData.tables.publications.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="px-4 py-8 text-center font-semibold text-slate-500"
                                    >
                                        {t("reports.tables.empty")}
                                    </td>
                                </tr>
                            )}

                            {ownerData.tables.publications.map((item) => (
                                <tr key={item.publication_id}>
                                    <td className="max-w-xs px-4 py-3 font-bold text-slate-900">
                                        {item.title}
                                    </td>
                                    <td className="px-4 py-3 font-semibold text-slate-700">
                                        {item.category || t("reports.tables.noCategory")}
                                    </td>
                                    <td className="px-4 py-3 font-semibold text-slate-700">
                                        {item.purchases_count}
                                    </td>
                                    <td className="px-4 py-3 font-semibold text-slate-700">
                                        {formatMoney(item.total_sales)}
                                    </td>
                                    <td className="px-4 py-3 font-semibold text-slate-700">
                                        {formatMoney(item.owner_income)}
                                    </td>
                                    <td className="px-4 py-3">
                                        <Link
                                            to={`/reports/material/${item.publication_id}`}
                                            className="inline-flex items-center gap-2 rounded-2xl bg-blue-50 px-3 py-2 text-xs font-black text-blue-700 transition hover:bg-blue-100"
                                        >
                                            <ExternalLink size={14} />
                                            {t("reports.tables.openReport")}
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        );
    }

    const adminData = data as AdminReportData;

    return (
        <section className="grid gap-4">
            <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-100 p-4 sm:p-5">
                    <h2 className="text-base font-black text-slate-900 sm:text-lg">
                        {t("reports.tables.topPublications")}
                    </h2>
                    <p className="mt-1 text-sm font-medium text-slate-500">
                        {t("reports.tables.topPublicationsSubtitle")}
                    </p>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full text-left text-sm">
                        <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                            <tr>
                                <th className="px-4 py-3 font-black">
                                    {t("reports.tables.publication")}
                                </th>
                                <th className="px-4 py-3 font-black">
                                    {t("reports.tables.owner")}
                                </th>
                                <th className="px-4 py-3 font-black">
                                    {t("reports.tables.count")}
                                </th>
                                <th className="px-4 py-3 font-black">
                                    {t("reports.tables.totalSales")}
                                </th>
                                <th className="px-4 py-3 font-black">
                                    {t("reports.tables.platformIncome")}
                                </th>
                                <th className="px-4 py-3 font-black">
                                    {t("reports.tables.ownerIncome")}
                                </th>
                                <th className="px-4 py-3 font-black">
                                    {t("reports.tables.action")}
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-100">
                            {adminData.tables.top_publications.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="px-4 py-8 text-center font-semibold text-slate-500"
                                    >
                                        {t("reports.tables.empty")}
                                    </td>
                                </tr>
                            )}

                            {adminData.tables.top_publications.map((item) => (
                                <tr key={item.publication_id}>
                                    <td className="max-w-xs px-4 py-3 font-bold text-slate-900">
                                        {item.title}
                                    </td>
                                    <td className="px-4 py-3 font-semibold text-slate-700">
                                        {item.owner}
                                    </td>
                                    <td className="px-4 py-3 font-semibold text-slate-700">
                                        {item.purchases_count}
                                    </td>
                                    <td className="px-4 py-3 font-semibold text-slate-700">
                                        {formatMoney(item.total_sales)}
                                    </td>
                                    <td className="px-4 py-3 font-semibold text-slate-700">
                                        {formatMoney(item.platform_income)}
                                    </td>
                                    <td className="px-4 py-3 font-semibold text-slate-700">
                                        {formatMoney(item.owners_income)}
                                    </td>
                                    <td className="px-4 py-3">
                                        <Link
                                            to={`/admin/reports/material/${item.publication_id}`}
                                            className="inline-flex items-center gap-2 rounded-2xl bg-slate-100 px-3 py-2 text-xs font-black text-slate-800 transition hover:bg-slate-200"
                                        >
                                            <ExternalLink size={14} />
                                            {t("reports.tables.openReport")}
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </article>

            <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-100 p-4 sm:p-5">
                    <h2 className="text-base font-black text-slate-900 sm:text-lg">
                        {t("reports.tables.topOwners")}
                    </h2>
                    <p className="mt-1 text-sm font-medium text-slate-500">
                        {t("reports.tables.topOwnersSubtitle")}
                    </p>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full text-left text-sm">
                        <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                            <tr>
                                <th className="px-4 py-3 font-black">
                                    {t("reports.tables.owner")}
                                </th>
                                <th className="px-4 py-3 font-black">
                                    {t("reports.tables.count")}
                                </th>
                                <th className="px-4 py-3 font-black">
                                    {t("reports.tables.totalSales")}
                                </th>
                                <th className="px-4 py-3 font-black">
                                    {t("reports.tables.platformIncome")}
                                </th>
                                <th className="px-4 py-3 font-black">
                                    {t("reports.tables.ownerIncome")}
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-100">
                            {adminData.tables.top_owners.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="px-4 py-8 text-center font-semibold text-slate-500"
                                    >
                                        {t("reports.tables.empty")}
                                    </td>
                                </tr>
                            )}

                            {adminData.tables.top_owners.map((item) => (
                                <tr key={item.owner_id}>
                                    <td className="px-4 py-3 font-bold text-slate-900">
                                        {item.owner}
                                    </td>
                                    <td className="px-4 py-3 font-semibold text-slate-700">
                                        {item.purchases_count}
                                    </td>
                                    <td className="px-4 py-3 font-semibold text-slate-700">
                                        {formatMoney(item.total_sales)}
                                    </td>
                                    <td className="px-4 py-3 font-semibold text-slate-700">
                                        {formatMoney(item.platform_income)}
                                    </td>
                                    <td className="px-4 py-3 font-semibold text-slate-700">
                                        {formatMoney(item.owner_income)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </article>
        </section>
    );
};