import type { ReactNode } from "react";

type AdminEmptyStateProps = {
    icon?: ReactNode;
    text: string;
};

export const AdminEmptyState = ({ icon, text }: AdminEmptyStateProps) => {
    return (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
            {icon && <div className="mx-auto mb-3 flex justify-center">{icon}</div>}
            <p className="font-bold">{text}</p>
        </div>
    );
};