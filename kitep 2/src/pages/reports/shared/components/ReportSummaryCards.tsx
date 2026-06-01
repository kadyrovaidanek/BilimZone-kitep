import {
    BadgePercent,
    CreditCard,
    FileText,
    Landmark,
    ShoppingBag,
    UserRound,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import type { ReportData, ReportRole } from "../../model/types";

type Props = {
    role: ReportRole;
    data: ReportData;
};

const formatMoney = (value?: number) => {
    return `${Number(value || 0).toLocaleString("ru-RU")} сом`;
};

export const ReportSummaryCards = ({ role, data }: Props) => {
    const { t } = useTranslation();
    const summary = data.summary;

    const cards =
        role === "admin"
            ? [
                {
                    title: t("reports.summary.totalSales"),
                    value: formatMoney(summary.total_sales),
                    icon: <CreditCard size={22} />,
                },
                {
                    title: t("reports.summary.platformIncome"),
                    value: formatMoney(summary.platform_income),
                    icon: <Landmark size={22} />,
                },
                {
                    title: t("reports.summary.ownersIncome"),
                    value: formatMoney(summary.owners_income),
                    icon: <UserRound size={22} />,
                },
                {
                    title: t("reports.summary.purchasesCount"),
                    value: String(summary.purchases_count || 0),
                    icon: <ShoppingBag size={22} />,
                },
            ]
            : [
                {
                    title: t("reports.summary.ownerIncome"),
                    value: formatMoney(summary.owner_income),
                    icon: <UserRound size={22} />,
                },
                {
                    title: t("reports.summary.totalSales"),
                    value: formatMoney(summary.total_sales),
                    icon: <CreditCard size={22} />,
                },
                {
                    title: t("reports.summary.purchasesCount"),
                    value: String(summary.purchases_count || 0),
                    icon: <ShoppingBag size={22} />,
                },
                {
                    title: t("reports.summary.topMaterial"),
                    value: summary.top_material || t("reports.summary.noData"),
                    icon: <FileText size={22} />,
                },
            ];

    return (
        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {cards.map((card) => (
                <article
                    key={card.title}
                    className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5"
                >
                    <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                                {card.title}
                            </p>
                            <h3 className="mt-2 truncate text-lg font-black text-slate-900 sm:text-xl">
                                {card.value}
                            </h3>
                        </div>

                        <div className="shrink-0 rounded-2xl bg-blue-50 p-3 text-blue-700">
                            {card.icon}
                        </div>
                    </div>
                </article>
            ))}

            <article className="rounded-3xl border border-blue-100 bg-blue-50 p-4 shadow-sm sm:p-5 xl:col-span-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-wide text-blue-700">
                            {t("reports.summary.commission")}
                        </p>
                        <h3 className="mt-1 text-lg font-black text-slate-900">
                            {data.commission_percent}%
                        </h3>
                        <p className="mt-1 text-sm font-semibold text-slate-600">
                            {role === "admin"
                                ? t("reports.summary.adminCommissionDescription")
                                : t("reports.summary.ownerCommissionDescription")}
                        </p>
                    </div>

                    <div className="rounded-2xl bg-white p-3 text-blue-700">
                        <BadgePercent size={28} />
                    </div>
                </div>
            </article>
        </section>
    );
};