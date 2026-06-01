import {
    CreditCard,
    Landmark,
    ShoppingBag,
    UserRound,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import type {
    MaterialReportRole,
    MaterialReportSummary as SummaryType,
} from "../model/types";

type Props = {
    role: MaterialReportRole;
    summary: SummaryType;
};

const formatMoney = (value?: number) => {
    return `${Number(value || 0).toLocaleString("ru-RU")} сом`;
};

export const MaterialReportSummary = ({ role, summary }: Props) => {
    const { t } = useTranslation();

    const cards = [
        {
            title: t("materialReport.summary.totalSales"),
            value: formatMoney(summary.total_sales),
            icon: <CreditCard size={22} />,
        },
        {
            title:
                role === "admin"
                    ? t("materialReport.summary.platformIncome")
                    : t("materialReport.summary.ownerIncome"),
            value:
                role === "admin"
                    ? formatMoney(summary.platform_income)
                    : formatMoney(summary.owner_income),
            icon:
                role === "admin" ? (
                    <Landmark size={22} />
                ) : (
                    <UserRound size={22} />
                ),
        },
        {
            title: t("materialReport.summary.purchasesCount"),
            value: String(summary.purchases_count || 0),
            icon: <ShoppingBag size={22} />,
        },
    ];

    return (
        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {cards.map((card) => (
                <article
                    key={card.title}
                    className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5"
                >
                    <div className="flex items-start justify-between gap-3">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                                {card.title}
                            </p>

                            <h3 className="mt-2 text-lg font-black text-slate-900 sm:text-xl">
                                {card.value}
                            </h3>
                        </div>

                        <div className="rounded-2xl bg-blue-50 p-3 text-blue-700">
                            {card.icon}
                        </div>
                    </div>
                </article>
            ))}
        </section>
    );
};

export default MaterialReportSummary;