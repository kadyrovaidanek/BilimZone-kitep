import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import type { Category } from "@/shared/api/categories";
import type { EditPublicationFormState } from "../../lib/editPublicationTypes";
import { EditFormField } from "./EditFormField";

type EditCatalogSectionProps = {
    form: EditPublicationFormState;
    errors: Partial<Record<keyof EditPublicationFormState, string>>;
    categories: Category[];
    loadingCategories: boolean;
    currentLang: "ru" | "kg";
    onChange: <K extends keyof EditPublicationFormState>(
        field: K,
        value: EditPublicationFormState[K],
    ) => void;
};

export const EditCatalogSection = ({
    form,
    errors,
    categories,
    loadingCategories,
    currentLang,
    onChange,
}: EditCatalogSectionProps) => {
    const { t } = useTranslation();

    const selectedCategory = useMemo(() => {
        return categories.find((category) => String(category.id) === form.category);
    }, [categories, form.category]);

    const selectedDirections = useMemo(() => {
        return selectedCategory?.directions?.filter((item) => item.is_active) || [];
    }, [selectedCategory]);

    const selectedOptions = useMemo(() => {
        return selectedCategory?.options?.filter((item) => item.is_active) || [];
    }, [selectedCategory]);

    const getCategoryName = (category: Category) => {
        return currentLang === "kg"
            ? category.name_kg || category.name_ru
            : category.name_ru;
    };

    const getDirectionName = (direction: Category["directions"][number]) => {
        return currentLang === "kg"
            ? direction.name_kg || direction.name_ru
            : direction.name_ru;
    };

    const getOptionLabel = () => {
        if (!selectedOptions.length) {
            return t("publication_edit.fields.option");
        }

        const firstOption = selectedOptions[0];

        return currentLang === "kg"
            ? firstOption.label_kg || firstOption.label_ru || t("publication_edit.fields.option")
            : firstOption.label_ru || t("publication_edit.fields.option");
    };

    return (
        <section className="border-t border-slate-100 pt-6">
            <h2 className="mb-4 text-xl font-black text-slate-900">
                {t("publication_edit.sections.catalog")}
            </h2>

            {loadingCategories ? (
                <div className="rounded-2xl bg-slate-50 p-5 text-center text-slate-500">
                    {t("publication_edit.messages.categoriesLoading")}
                </div>
            ) : (
                <div className="space-y-4">
                    <EditFormField
                        label={t("publication_edit.fields.category")}
                        error={errors.category}
                    >
                        <select
                            value={form.category}
                            onChange={(event) => {
                                onChange("category", event.target.value);
                                onChange("direction", "");
                                onChange("option", "");
                            }}
                            className={`w-full rounded-2xl border px-4 py-3 outline-none transition focus:ring-2 ${errors.category
                                ? "border-red-300 focus:ring-red-100"
                                : "border-slate-200 focus:border-blue-400 focus:ring-blue-100"
                                }`}
                        >
                            <option value="">
                                {t("publication_edit.placeholders.category")}
                            </option>

                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {getCategoryName(category)}
                                </option>
                            ))}
                        </select>
                    </EditFormField>

                    {form.category && (
                        <EditFormField
                            label={t("publication_edit.fields.direction")}
                            error={errors.direction}
                        >
                            <select
                                value={form.direction}
                                onChange={(event) => onChange("direction", event.target.value)}
                                className={`w-full rounded-2xl border px-4 py-3 outline-none transition focus:ring-2 ${errors.direction
                                    ? "border-red-300 focus:ring-red-100"
                                    : "border-slate-200 focus:border-blue-400 focus:ring-blue-100"
                                    }`}
                            >
                                <option value="">
                                    {t("publication_edit.placeholders.direction")}
                                </option>

                                {selectedDirections.map((direction) => (
                                    <option key={direction.id} value={direction.id}>
                                        {getDirectionName(direction)}
                                    </option>
                                ))}
                            </select>

                            {selectedDirections.length === 0 && (
                                <p className="mt-2 text-sm text-slate-400">
                                    {t("publication_edit.messages.noDirections")}
                                </p>
                            )}
                        </EditFormField>
                    )}

                    {form.category && form.direction && selectedOptions.length > 0 && (
                        <EditFormField label={getOptionLabel()} error={errors.option}>
                            <select
                                value={form.option}
                                onChange={(event) => onChange("option", event.target.value)}
                                className={`w-full rounded-2xl border px-4 py-3 outline-none transition focus:ring-2 ${errors.option
                                    ? "border-red-300 focus:ring-red-100"
                                    : "border-slate-200 focus:border-blue-400 focus:ring-blue-100"
                                    }`}
                            >
                                <option value="">
                                    {t("publication_edit.placeholders.option")}
                                </option>

                                {selectedOptions.map((option) => (
                                    <option key={option.id} value={option.id}>
                                        {option.value}
                                    </option>
                                ))}
                            </select>
                        </EditFormField>
                    )}
                </div>
            )}
        </section>
    );
};