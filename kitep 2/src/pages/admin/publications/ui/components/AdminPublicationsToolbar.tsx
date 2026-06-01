import { RefreshCw, Search, X } from "lucide-react";
import { useTranslation } from "react-i18next";

import type { AdminAuthorRoleFilter } from "@/pages/admin/AdminMaterialsPage";
import type { AdminPublicationFilter } from "../../lib/adminPublicationHelpers";

type AdminPublicationsToolbarProps = {
    search: string;
    statusFilter: AdminPublicationFilter;
    dateFrom: string;
    dateTo: string;
    authorRoleFilter: AdminAuthorRoleFilter;
    onSearchChange: (value: string) => void;
    onStatusChange: (value: AdminPublicationFilter) => void;
    onDateFromChange: (value: string) => void;
    onDateToChange: (value: string) => void;
    onAuthorRoleChange: (value: AdminAuthorRoleFilter) => void;
    onResetExtraFilters: () => void;
    onRefresh: () => void;
};

export const AdminPublicationsToolbar = ({
    search,
    statusFilter,
    dateFrom,
    dateTo,
    authorRoleFilter,
    onSearchChange,
    onStatusChange,
    onDateFromChange,
    onDateToChange,
    onAuthorRoleChange,
    onResetExtraFilters,
    onRefresh,
}: AdminPublicationsToolbarProps) => {
    const { t } = useTranslation();

    const hasExtraFilters =
        Boolean(dateFrom) || Boolean(dateTo) || authorRoleFilter !== "all";

    return (
        <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-12">
                <div className="md:col-span-2 xl:col-span-3">
                    <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-400">
                        {t("adminPublications.filters.searchLabel", "Поиск")}
                    </label>

                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                        <input
                            value={search}
                            onChange={(event) => onSearchChange(event.target.value)}
                            placeholder={t(
                                "adminPublications.searchPlaceholder",
                                "Введите название или автора",
                            )}
                            className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm font-semibold outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                        />
                    </div>
                </div>

                <div className="xl:col-span-2">
                    <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-400">
                        {t("adminPublications.filters.status", "Статус")}
                    </label>

                    <select
                        value={statusFilter}
                        onChange={(event) =>
                            onStatusChange(event.target.value as AdminPublicationFilter)
                        }
                        className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                    >
                        <option value="all">{t("adminPublications.filters.all", "Все")}</option>
                        <option value="pending">
                            {t("adminPublications.filters.pending", "На проверке")}
                        </option>
                        <option value="published">
                            {t("adminPublications.filters.published", "Опубликовано")}
                        </option>
                        <option value="rejected">
                            {t("adminPublications.filters.rejected", "Отклонено")}
                        </option>
                    </select>
                </div>

                <div className="xl:col-span-2">
                    <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-400">
                        {t("adminPublications.filters.dateFrom", "Дата от")}
                    </label>

                    <input
                        type="date"
                        value={dateFrom}
                        onChange={(event) => onDateFromChange(event.target.value)}
                        className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                    />
                </div>

                <div className="xl:col-span-2">
                    <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-400">
                        {t("adminPublications.filters.dateTo", "Дата до")}
                    </label>

                    <input
                        type="date"
                        value={dateTo}
                        onChange={(event) => onDateToChange(event.target.value)}
                        className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                    />
                </div>

                <div className="xl:col-span-2">
                    <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-400">
                        {t("adminPublications.filters.ownerType", "Кто отправил")}
                    </label>

                    <select
                        value={authorRoleFilter}
                        onChange={(event) =>
                            onAuthorRoleChange(event.target.value as AdminAuthorRoleFilter)
                        }
                        className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                    >
                        <option value="all">
                            {t("adminPublications.filters.ownerAll", "Все")}
                        </option>
                        <option value="author">
                            {t("adminPublications.filters.authors", "Авторы")}
                        </option>
                        <option value="organization">
                            {t("adminPublications.filters.organizations", "Организации")}
                        </option>
                    </select>
                </div>

                <div className="flex gap-2 md:col-span-2 xl:col-span-1 xl:items-end">
                    {hasExtraFilters && (
                        <button
                            type="button"
                            onClick={onResetExtraFilters}
                            className="flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl border border-slate-200 px-4 text-sm font-bold text-slate-600 transition hover:bg-slate-50 xl:flex-none"
                            title={t("adminPublications.actions.reset", "Сбросить")}
                        >
                            <X className="h-4 w-4" />
                            <span className="xl:hidden">
                                {t("adminPublications.actions.reset", "Сбросить")}
                            </span>
                        </button>
                    )}

                    <button
                        type="button"
                        onClick={onRefresh}
                        className="flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-blue-600 px-4 text-sm font-bold text-white transition hover:bg-blue-700 xl:flex-none"
                    >
                        <RefreshCw className="h-4 w-4" />
                        <span className="xl:hidden">
                            {t("adminPublications.actions.refresh", "Обновить")}
                        </span>
                    </button>
                </div>
            </div>
        </section>
    );
};