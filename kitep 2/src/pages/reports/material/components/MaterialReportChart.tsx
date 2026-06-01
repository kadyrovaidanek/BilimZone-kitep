import { useTranslation } from "react-i18next";
import {
    Bar,
    BarChart,
    CartesianGrid,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

import type {
    MaterialReportRole,
    MaterialSalesByDateItem,
} from "../model/types";

type Props = {
    role: MaterialReportRole;
    salesByDate: MaterialSalesByDateItem[];
};

export const MaterialReportChart = ({ role, salesByDate }: Props) => {
    const { t } = useTranslation();

    const incomeKey = role === "admin" ? "platform_income" : "owner_income";

    return (
        <section className="grid gap-4 xl:grid-cols-2">
            <article className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                <h2 className="mb-4 text-base font-black text-slate-900 sm:text-lg">
                    {role === "admin"
                        ? t("materialReport.charts.platformIncomeByDate")
                        : t("materialReport.charts.ownerIncomeByDate")}
                </h2>

                <div className="h-72 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={salesByDate}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" fontSize={12} />
                            <YAxis fontSize={12} />
                            <Tooltip />
                            <Line
                                type="monotone"
                                dataKey={incomeKey}
                                stroke="#2563eb"
                                strokeWidth={3}
                                dot={{ r: 4 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </article>

            <article className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                <h2 className="mb-4 text-base font-black text-slate-900 sm:text-lg">
                    {t("materialReport.charts.purchasesByDate")}
                </h2>

                <div className="h-72 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={salesByDate}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" fontSize={12} />
                            <YAxis fontSize={12} />
                            <Tooltip />
                            <Bar
                                dataKey="purchases_count"
                                fill="#2563eb"
                                radius={[8, 8, 0, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </article>
        </section>
    );
};