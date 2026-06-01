import { useTranslation } from "react-i18next";

import type {
    MaterialPurchaseHistoryItem,
    MaterialReportRole,
} from "../model/types";

type Props = {
    role: MaterialReportRole;
    purchases: MaterialPurchaseHistoryItem[];
};

const formatMoney = (value?: number) => {
    return `${Number(value || 0).toLocaleString("ru-RU")} сом`;
};

export const MaterialPurchaseHistoryTable = ({ role, purchases }: Props) => {
    const { t } = useTranslation();

    return (
        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 p-4 sm:p-5">
                <h2 className="text-base font-black text-slate-900 sm:text-lg">
                    {t("materialReport.history.title")}
                </h2>
                <p className="mt-1 text-sm font-medium text-slate-500">
                    {t("materialReport.history.subtitle")}
                </p>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                    <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                        <tr>
                            <th className="px-4 py-3 font-black">
                                {t("materialReport.history.buyer")}
                            </th>
                            <th className="px-4 py-3 font-black">
                                {t("materialReport.history.date")}
                            </th>
                            <th className="px-4 py-3 font-black">
                                {t("materialReport.history.amount")}
                            </th>
                            <th className="px-4 py-3 font-black">
                                {t("materialReport.history.ownerIncome")}
                            </th>
                            {role === "admin" && (
                                <th className="px-4 py-3 font-black">
                                    {t("materialReport.history.platformIncome")}
                                </th>
                            )}
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                        {purchases.length === 0 && (
                            <tr>
                                <td
                                    colSpan={role === "admin" ? 5 : 4}
                                    className="px-4 py-8 text-center font-semibold text-slate-500"
                                >
                                    {t("materialReport.history.empty")}
                                </td>
                            </tr>
                        )}

                        {purchases.map((purchase) => (
                            <tr key={purchase.id}>
                                <td className="px-4 py-3 font-bold text-slate-900">
                                    {purchase.buyer_username}
                                </td>
                                <td className="px-4 py-3 font-semibold text-slate-700">
                                    {purchase.created_at}
                                </td>
                                <td className="px-4 py-3 font-semibold text-slate-700">
                                    {formatMoney(purchase.amount)}
                                </td>
                                <td className="px-4 py-3 font-semibold text-slate-700">
                                    {formatMoney(purchase.owner_income)}
                                </td>
                                {role === "admin" && (
                                    <td className="px-4 py-3 font-semibold text-slate-700">
                                        {formatMoney(purchase.platform_income)}
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
};