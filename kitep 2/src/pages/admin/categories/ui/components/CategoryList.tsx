import { CheckCircle, Edit, Trash2, XCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

import type {
    AdminCatalogCategory,
    AdminCatalogDirection,
} from "../../lib/categoryTypes";

import { CategoryFilters } from "./CategoryFilters";

type CategoryListProps = {
    categories: AdminCatalogCategory[];
    loading: boolean;
    search: string;
    activeFilter: string;
    onSearchChange: (value: string) => void;
    onActiveFilterChange: (value: string) => void;
    onSearch: () => void;
    onEdit: (category: AdminCatalogCategory) => void;
    onDelete: (category: AdminCatalogCategory) => void;
    onToggle: (category: AdminCatalogCategory) => void;
};

export const CategoryList = ({
    categories,
    loading,
    search,
    activeFilter,
    onSearchChange,
    onActiveFilterChange,
    onSearch,
    onEdit,
    onDelete,
    onToggle,
}: CategoryListProps) => {
    const { t } = useTranslation();

    return (
        <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6 lg:p-7">
            <div className="mb-5 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                <h2 className="text-xl font-black text-slate-900">
                    {t("adminCatalog.list.title")}
                </h2>

                <CategoryFilters
                    search={search}
                    activeFilter={activeFilter}
                    onSearchChange={onSearchChange}
                    onActiveFilterChange={onActiveFilterChange}
                    onSearch={onSearch}
                />
            </div>

            {loading ? (
                <div className="rounded-2xl bg-slate-50 p-6 text-center text-slate-500">
                    {t("common.loading")}
                </div>
            ) : categories.length === 0 ? (
                <div className="rounded-2xl bg-slate-50 p-6 text-center text-slate-500">
                    {t("adminCatalog.list.empty")}
                </div>
            ) : (
                <div className="space-y-4">
                    {categories.map((category) => {
                        const activeDirections = category.directions.filter(
                            (item: AdminCatalogDirection) => item.is_active,
                        );

                        const activeClassCount = category.class_options.filter(
                            (item) => item.is_active,
                        ).length;

                        return (
                            <div
                                key={category.id}
                                className="rounded-2xl border border-slate-200 p-4 transition hover:bg-slate-50 sm:p-5"
                            >
                                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                                    <div className="flex-1">
                                        <div className="mb-2 flex flex-wrap items-center gap-2">
                                            <h3 className="text-lg font-black text-slate-900">
                                                {category.name_ru}
                                            </h3>

                                            {category.name_kg && (
                                                <span className="text-sm font-semibold text-slate-400">
                                                    / {category.name_kg}
                                                </span>
                                            )}

                                            <span
                                                className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold ${category.is_active
                                                        ? "bg-green-50 text-green-600"
                                                        : "bg-red-50 text-red-600"
                                                    }`}
                                            >
                                                {category.is_active ? (
                                                    <CheckCircle size={14} />
                                                ) : (
                                                    <XCircle size={14} />
                                                )}

                                                {category.is_active
                                                    ? t("adminCatalog.status.active")
                                                    : t("adminCatalog.status.inactive")}
                                            </span>
                                        </div>

                                        <div className="mb-3 flex flex-wrap gap-2 text-xs font-semibold">
                                            <span className="rounded-full bg-blue-50 px-3 py-1 text-blue-600">
                                                slug: {category.slug || "—"}
                                            </span>

                                            <span className="rounded-full bg-purple-50 px-3 py-1 text-purple-600">
                                                {category.active_directions_count ?? activeDirections.length}{" "}
                                                {t("adminCatalog.list.activeDirections")}
                                            </span>

                                            {category.slug === "school" && (
                                                <span className="rounded-full bg-orange-50 px-3 py-1 text-orange-600">
                                                    {activeClassCount} {t("adminCatalog.list.classes")}
                                                </span>
                                            )}
                                        </div>

                                        {category.description_ru && (
                                            <p className="mb-3 text-sm text-slate-500">
                                                {category.description_ru}
                                            </p>
                                        )}

                                        <div className="flex flex-wrap gap-2">
                                            {activeDirections
                                                .slice(0, 10)
                                                .map((direction: AdminCatalogDirection) => (
                                                    <span
                                                        key={direction.id}
                                                        className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600"
                                                    >
                                                        {direction.name_ru}
                                                    </span>
                                                ))}

                                            {activeDirections.length > 10 && (
                                                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-400">
                                                    +{activeDirections.length - 10}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:grid-cols-1">
                                        <button
                                            type="button"
                                            onClick={() => onEdit(category)}
                                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-white"
                                        >
                                            <Edit size={16} />
                                            {t("common.edit")}
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => onToggle(category)}
                                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-white"
                                        >
                                            {category.is_active
                                                ? t("adminCatalog.actions.disable")
                                                : t("adminCatalog.actions.enable")}
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => onDelete(category)}
                                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-50 px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-100"
                                        >
                                            <Trash2 size={16} />
                                            {t("common.delete")}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </section>
    );
};