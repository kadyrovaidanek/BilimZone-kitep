import { Search } from "lucide-react";
import { useTranslation } from "react-i18next";

import type { PublicationsStatusFilter } from "../../lib/publicationFilters";

type PublicationsToolbarProps = {
    search: string;
    statusFilter: PublicationsStatusFilter;
    onSearchChange: (value: string) => void;
    onStatusChange: (value: PublicationsStatusFilter) => void;
};

export const PublicationsToolbar = ({
    search,
    statusFilter,
    onSearchChange,
    onStatusChange,
}: PublicationsToolbarProps) => {
    const { t } = useTranslation();

    const statuses: PublicationsStatusFilter[] = [
        "all",
        "draft",
        "pending",
        "published",
        "rejected",
    ];

    return (
        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="relative w-full lg:max-w-md">
                    <Search
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                        value={search}
                        onChange={(event) => onSearchChange(event.target.value)}
                        placeholder={t("publications.searchPlaceholder")}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm font-medium outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                    />
                </div>

                <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
                    {statuses.map((status) => (
                        <button
                            key={status}
                            type="button"
                            onClick={() => onStatusChange(status)}
                            className={`rounded-2xl px-3 py-2.5 text-xs font-bold transition sm:px-4 sm:text-sm ${statusFilter === status
                                    ? "bg-slate-900 text-white"
                                    : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                                }`}
                        >
                            {t(`publications.status.${status}`)}
                        </button>
                    ))}
                </div>
            </div>
        </section>
    );
};