import { Search } from "lucide-react";
import { useTranslation } from "react-i18next";

import type { CollectionFilterType } from "../../lib/collectionFilters";

type CollectionToolbarProps = {
    search: string;
    filter: CollectionFilterType;
    onSearchChange: (value: string) => void;
    onFilterChange: (filter: CollectionFilterType) => void;
};

export const CollectionToolbar = ({
    search,
    filter,
    onSearchChange,
    onFilterChange,
}: CollectionToolbarProps) => {
    const { t } = useTranslation();

    const filters: CollectionFilterType[] = [
        "all",
        "free",
        "paid",
        "favorites",
    ];

    return (
        <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="relative w-full lg:max-w-md">
                    <Search
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                        value={search}
                        onChange={(event) => onSearchChange(event.target.value)}
                        placeholder={t("collection.searchPlaceholder")}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm font-medium outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                    />
                </div>

                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {filters.map((item) => (
                        <button
                            key={item}
                            type="button"
                            onClick={() => onFilterChange(item)}
                            className={`rounded-2xl px-3 py-2.5 text-xs font-bold transition sm:px-4 sm:text-sm ${filter === item
                                    ? "bg-slate-900 text-white"
                                    : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                                }`}
                        >
                            {t(`collection.filters.${item}`)}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};