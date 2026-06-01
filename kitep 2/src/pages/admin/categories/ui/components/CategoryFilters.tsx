import { Search } from "lucide-react";
import { useTranslation } from "react-i18next";

type CategoryFiltersProps = {
    search: string;
    activeFilter: string;
    onSearchChange: (value: string) => void;
    onActiveFilterChange: (value: string) => void;
    onSearch: () => void;
};

export const CategoryFilters = ({
    search,
    activeFilter,
    onSearchChange,
    onActiveFilterChange,
    onSearch,
}: CategoryFiltersProps) => {
    const { t } = useTranslation();

    return (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto_auto]">
            <div className="relative">
                <Search
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                    value={search}
                    onChange={(event) => onSearchChange(event.target.value)}
                    placeholder={t("adminCatalog.filters.searchPlaceholder")}
                    className="w-full rounded-xl border border-slate-200 py-2 pl-10 pr-3 text-sm outline-none focus:border-blue-400"
                />
            </div>

            <select
                value={activeFilter}
                onChange={(event) => onActiveFilterChange(event.target.value)}
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
            >
                <option value="all_filter">
                    {t("adminCatalog.filters.allStatuses")}
                </option>
                <option value="true">{t("adminCatalog.status.activePlural")}</option>
                <option value="false">
                    {t("adminCatalog.status.inactivePlural")}
                </option>
            </select>

            <button
                type="button"
                onClick={onSearch}
                className="rounded-xl bg-blue-600 px-5 py-2 text-sm font-bold text-white hover:bg-blue-700"
            >
                {t("common.search")}
            </button>
        </div>
    );
};