import type { ReactNode } from "react";

type AdminPageHeaderProps = {
    title: string;
    subtitle?: string;
    badge?: string;
    icon?: ReactNode;
    rightSlot?: ReactNode;
};

export const AdminPageHeader = ({
    title,
    subtitle,
    badge,
    icon,
    rightSlot,
}: AdminPageHeaderProps) => {
    return (
        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    {badge && (
                        <div className="mb-3 inline-flex items-center gap-2 rounded-2xl bg-blue-50 px-4 py-2 font-bold text-blue-600">
                            {icon}
                            {badge}
                        </div>
                    )}

                    <h1 className="text-2xl font-black text-slate-900 sm:text-3xl">
                        {title}
                    </h1>

                    {subtitle && (
                        <p className="mt-2 text-sm leading-6 text-slate-500 sm:text-base">
                            {subtitle}
                        </p>
                    )}
                </div>

                {rightSlot}
            </div>
        </section>
    );
};