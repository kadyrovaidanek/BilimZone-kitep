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

import type { ReportData, ReportRole } from "../../model/types";

type Props = {
    role: ReportRole;
    data: ReportData;
};

export const ReportCharts = ({ role, data }: Props) => {
    const { t } = useTranslation();

    const incomeKey = role === "admin" ? "platform_income" : "owner_income";
    const barData =
        "sales_by_category" in data.charts
            ? data.charts.sales_by_category.map((item) => ({
                name: item.category,
                sales: item.total_sales,
            }))
            : data.charts.sales_by_publication.map((item) => ({
                name: `Publication ${item.publication_id}`,
                sales: item.total_sales,
            }));

    return (
        <section className="grid gap-4 xl:grid-cols-2">
            <article className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                <h2 className="mb-4 text-base font-black text-slate-900 sm:text-lg">
                    {role === "admin"
                        ? t("reports.charts.platformIncomeByDate")
                        : t("reports.charts.ownerIncomeByDate")}
                </h2>

                <div className="h-72 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data.charts.sales_by_date}>
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
                    {role === "admin"
                        ? t("reports.charts.salesByCategory")
                        : t("reports.charts.salesByPublication")}
                </h2>

                <div className="h-72 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={barData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" fontSize={12} />
                            <YAxis fontSize={12} />
                            <Tooltip />
                            <Bar
                                dataKey="total_sales"
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