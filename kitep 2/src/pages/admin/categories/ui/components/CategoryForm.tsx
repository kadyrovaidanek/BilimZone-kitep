import { Plus, RotateCcw } from "lucide-react";
import { useTranslation } from "react-i18next";

import type {
    CategoryFormState,
    ClassForm,
    DirectionForm,
} from "../../lib/categoryTypes";
import { CategoryDirectionsSection } from "./CategoryDirectionsSection";
import { CategoryClassOptionsSection } from "./CategoryClassOptionsSection";

type CategoryFormProps = {
    form: CategoryFormState;
    editingId: number | null;
    isSchoolCategory: boolean;
    onChange: (form: CategoryFormState) => void;
    onSubmit: () => void;
    onReset: () => void;
};

export const CategoryForm = ({
    form,
    editingId,
    isSchoolCategory,
    onChange,
    onSubmit,
    onReset,
}: CategoryFormProps) => {
    const { t } = useTranslation();

    const updateField = <K extends keyof CategoryFormState>(
        field: K,
        value: CategoryFormState[K],
    ) => {
        onChange({
            ...form,
            [field]: value,
        });
    };

    const addDirection = () => {
        updateField("directions", [
            ...form.directions,
            {
                name_ru: "",
                name_kg: "",
                is_active: true,
                sort_order: form.directions.length,
            },
        ]);
    };

    const updateDirection = (
        index: number,
        field: keyof DirectionForm,
        value: string | boolean | number,
    ) => {
        updateField(
            "directions",
            form.directions.map((item, itemIndex) =>
                itemIndex === index ? { ...item, [field]: value } : item,
            ),
        );
    };

    const removeDirection = (index: number) => {
        updateField(
            "directions",
            form.directions.filter((_, itemIndex) => itemIndex !== index),
        );
    };

    const addClassOption = () => {
        updateField("class_options", [
            ...form.class_options,
            {
                value: "",
                is_active: true,
                sort_order: form.class_options.length,
            },
        ]);
    };

    const updateClassOption = (
        index: number,
        field: keyof ClassForm,
        value: string | boolean | number,
    ) => {
        updateField(
            "class_options",
            form.class_options.map((item, itemIndex) =>
                itemIndex === index ? { ...item, [field]: value } : item,
            ),
        );
    };

    const removeClassOption = (index: number) => {
        updateField(
            "class_options",
            form.class_options.filter((_, itemIndex) => itemIndex !== index),
        );
    };

    return (
        <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6 lg:p-7">
            <h2 className="mb-5 text-xl font-black text-slate-900">
                {editingId
                    ? t("adminCatalog.form.editTitle")
                    : t("adminCatalog.form.addTitle")}
            </h2>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-slate-700">
                        {t("adminCatalog.form.slug")}
                    </span>

                    <input
                        value={form.slug}
                        onChange={(event) => updateField("slug", event.target.value)}
                        placeholder="school, tests, university..."
                        className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                    />

                    <p className="mt-1 text-xs text-slate-400">
                        {t("adminCatalog.form.slugHint")}
                    </p>
                </label>

                <label className="mt-0 flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3 lg:mt-7">
                    <input
                        type="checkbox"
                        checked={form.is_active}
                        onChange={(event) =>
                            updateField("is_active", event.target.checked)
                        }
                    />

                    <span className="font-semibold text-slate-700">
                        {t("adminCatalog.form.active")}
                    </span>
                </label>

                <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-slate-700">
                        {t("adminCatalog.form.nameRu")}
                    </span>

                    <input
                        value={form.name_ru}
                        onChange={(event) => updateField("name_ru", event.target.value)}
                        placeholder={t("adminCatalog.form.nameRuPlaceholder")}
                        className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                    />
                </label>

                <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-slate-700">
                        {t("adminCatalog.form.nameKg")}
                    </span>

                    <input
                        value={form.name_kg}
                        onChange={(event) => updateField("name_kg", event.target.value)}
                        placeholder={t("adminCatalog.form.nameKgPlaceholder")}
                        className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                    />
                </label>

                <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-slate-700">
                        {t("adminCatalog.form.descriptionRu")}
                    </span>

                    <textarea
                        value={form.description_ru}
                        onChange={(event) =>
                            updateField("description_ru", event.target.value)
                        }
                        placeholder={t("adminCatalog.form.descriptionRuPlaceholder")}
                        className="min-h-[110px] w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                    />
                </label>

                <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-slate-700">
                        {t("adminCatalog.form.descriptionKg")}
                    </span>

                    <textarea
                        value={form.description_kg}
                        onChange={(event) =>
                            updateField("description_kg", event.target.value)
                        }
                        placeholder={t("adminCatalog.form.descriptionKgPlaceholder")}
                        className="min-h-[110px] w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                    />
                </label>
            </div>

            <CategoryDirectionsSection
                directions={form.directions}
                onAdd={addDirection}
                onUpdate={updateDirection}
                onRemove={removeDirection}
            />

            <CategoryClassOptionsSection
                isSchoolCategory={isSchoolCategory}
                classOptions={form.class_options}
                onAdd={addClassOption}
                onUpdate={updateClassOption}
                onRemove={removeClassOption}
            />

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <button
                    type="button"
                    onClick={onSubmit}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-6 py-3 font-bold text-white transition hover:bg-slate-800"
                >
                    <Plus size={20} />
                    {editingId
                        ? t("adminCatalog.actions.save")
                        : t("adminCatalog.actions.add")}
                </button>

                {editingId && (
                    <button
                        type="button"
                        onClick={onReset}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 px-6 py-3 font-bold text-slate-600 transition hover:bg-slate-50"
                    >
                        <RotateCcw size={18} />
                        {t("common.cancel")}
                    </button>
                )}
            </div>
        </section>
    );
};