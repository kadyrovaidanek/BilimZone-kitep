import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import type { Category, CategoryOption } from "../../api/publicationCreateApi";
import type {
    CreatePublicationErrors,
    CreatePublicationField,
    CreatePublicationFormState,
} from "../../model/types";

type CatalogSectionProps = {
    form: CreatePublicationFormState;
    errors: CreatePublicationErrors;
    categories: Category[];
    onChange: <K extends CreatePublicationField>(
        field: K,
        value: CreatePublicationFormState[K],
    ) => void;
};

export const CatalogSection = ({
    form,
    errors,
    categories,
    onChange,
}: CatalogSectionProps) => {
    const { t, i18n } = useTranslation();

    const isKg = i18n.language.startsWith("kg") || i18n.language.startsWith("ky");

    const selectedCategory = useMemo(() => {
        return categories.find((category) => String(category.id) === form.category);
    }, [categories, form.category]);

    const directions = selectedCategory?.directions || [];

    const isSchoolCategory = useMemo(() => {
        if (!selectedCategory) return false;

        const nameRu = selectedCategory.name_ru?.toLowerCase() || "";
        const nameKg = selectedCategory.name_kg?.toLowerCase() || "";

        return (
            nameRu.includes("школ") ||
            nameRu.includes("школь") ||
            nameKg.includes("мектеп")
        );
    }, [selectedCategory]);

    const classOptions = useMemo(() => {
        if (!selectedCategory) return [];

        const backendOptions =
            selectedCategory.class_options ||
            selectedCategory.options ||
            [];

        if (backendOptions.length > 0) {
            return backendOptions;
        }

        return [];
    }, [selectedCategory]);

    const getCategoryName = (category: Category) => {
        return isKg ? category.name_kg || category.name_ru : category.name_ru;
    };

    const isBadOptionLabel = (value?: string | null) => {
        const text = (value || "").trim().toLowerCase();

        return (
            !text ||
            text === "выберите класс" ||
            text === "выберите значение" ||
            text === "классты тандаңыз"
        );
    };

    const getOptionName = (option: CategoryOption, index: number) => {
        const label = isKg
            ? option.label_kg || option.label_ru || option.value
            : option.label_ru || option.label_kg || option.value;

        if (!isBadOptionLabel(label)) {
            return label;
        }

        const classNumber = option.value && /^\d+$/.test(String(option.value))
            ? option.value
            : String(index + 1);

        return isKg ? `${classNumber}-класс` : `${classNumber} класс`;
    };

    const handleCategoryChange = (value: string) => {
        onChange("category", value);
        onChange("option", "");
    };

    return (
        <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
            <h2 className="mb-5 text-xl font-black text-slate-900">
                {t("publicationCreate.sections.catalog", "Каталог")}
            </h2>

            <div
                className={
                    isSchoolCategory
                        ? "grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3"
                        : "grid grid-cols-1 gap-4 md:grid-cols-2"
                }
            >
                <label className="block">
                    <span className="mb-2 block text-sm font-bold text-slate-700">
                        {t("publicationCreate.fields.category", "Категория")}
                    </span>

                    <select
                        value={form.category}
                        onChange={(event) => handleCategoryChange(event.target.value)}
                        className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                    >
                        <option value="">
                            {t(
                                "publicationCreate.placeholders.category",
                                "Выберите категорию",
                            )}
                        </option>

                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {getCategoryName(category)}
                            </option>
                        ))}
                    </select>

                    {errors.category && (
                        <p className="mt-2 text-sm font-semibold text-red-500">
                            {errors.category}
                        </p>
                    )}
                </label>

                <label className="block">
                    <span className="mb-2 block text-sm font-bold text-slate-700">
                        {t("publicationCreate.fields.direction", "Направление")}
                    </span>

                    <select
                        value={form.direction}
                        onChange={(event) => onChange("direction", event.target.value)}
                        disabled={!form.category}
                        className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100 disabled:text-slate-400"
                    >
                        <option value="">
                            {t(
                                "publicationCreate.placeholders.direction",
                                "Выберите направление",
                            )}
                        </option>

                        {directions.map((direction) => (
                            <option key={direction.id} value={direction.id}>
                                {isKg
                                    ? direction.name_kg || direction.name_ru
                                    : direction.name_ru}
                            </option>
                        ))}
                    </select>

                    {errors.direction && (
                        <p className="mt-2 text-sm font-semibold text-red-500">
                            {errors.direction}
                        </p>
                    )}
                </label>

                {isSchoolCategory && (
                    <label className="block md:col-span-2 xl:col-span-1">
                        <span className="mb-2 block text-sm font-bold text-slate-700">
                            {t("publicationCreate.fields.option", "Класс")}
                        </span>

                        <select
                            value={form.option}
                            onChange={(event) => onChange("option", event.target.value)}
                            disabled={!form.category || classOptions.length === 0}
                            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100 disabled:text-slate-400"
                        >
                            <option value="">
                                {classOptions.length === 0
                                    ? t(
                                        "publicationCreate.placeholders.noClasses",
                                        "Классы не добавлены",
                                    )
                                    : t(
                                        "publicationCreate.placeholders.option",
                                        "Выберите класс",
                                    )}
                            </option>

                            {classOptions.map((option, index) => (
                                <option key={option.id} value={option.id}>
                                    {getOptionName(option, index)}
                                </option>
                            ))}
                        </select>

                        {errors.option && (
                            <p className="mt-2 text-sm font-semibold text-red-500">
                                {errors.option}
                            </p>
                        )}
                    </label>
                )}
            </div>
        </section>
    );
};