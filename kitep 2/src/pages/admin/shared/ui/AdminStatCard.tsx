type AdminStatCardProps = {
    label: string;
    value: string | number;
    colorClass?: string;
};

export const AdminStatCard = ({
    label,
    value,
    colorClass = "text-slate-900",
}: AdminStatCardProps) => {
    return (
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-slate-500">{label}</p>
            <p className={`mt-2 text-3xl font-black ${colorClass}`}>{value}</p>
        </div>
    );
};