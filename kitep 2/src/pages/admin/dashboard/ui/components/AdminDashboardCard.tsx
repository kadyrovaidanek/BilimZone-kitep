import type { ReactNode } from "react";
import { Link } from "react-router-dom";

type AdminDashboardCardProps = {
    to: string;
    title: string;
    description: string;
    icon: ReactNode;
};

export const AdminDashboardCard = ({
    to,
    title,
    description,
    icon,
}: AdminDashboardCardProps) => {
    return (
        <Link
            to={to}
            className="group rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
        >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
                {icon}
            </div>

            <h2 className="text-lg font-black text-slate-900">{title}</h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
        </Link>
    );
};