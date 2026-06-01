import { ListPlus, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { ClassForm } from "../../lib/categoryTypes";

type CategoryClassOptionsSectionProps = {
    isSchoolCategory: boolean;
    classOptions: ClassForm[];
    onAdd: () => void;
    onUpdate: (
        index: number,
        field: keyof ClassForm,
        value: string | boolean | number,
    ) => void;
    onRemove: (index: number) => void;
};

export const CategoryClassOptionsSection = ({
    isSchoolCategory,
    classOptions,
    onAdd,
    onUpdate,
    onRemove,
}: CategoryClassOptionsSectionProps) => {
    const { t } = useTranslation();

    if (!isSchoolCategory) {
        return (
            <div className="mt-5 rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-700">
                {t("adminCatalog.form.onlySchoolHasClasses")}
            </div>
        );
    }

    return (
        <section className="mt-6 rounded-3xl border border-slate-200 p-4 sm:p-5">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h3 className="text-lg font-black text-slate-900">
                        {t("adminCatalog.form.classes")}
                    </h3>

                    <p className="text-sm text-slate-500">
                        {t("adminCatalog.form.classesHint")}
                    </p>
                </div>

                <button
                    type="button"
                    onClick={onAdd}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-50 px-4 py-2 font-bold text-blue-600 transition hover:bg-blue-100"
                >
                    <ListPlus size={18} />
                    {t("adminCatalog.actions.addClass")}
                </button>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {classOptions.map((option, index) => (
                    <div
                        key={option.id || index}
                        className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-3"
                    >
                        <input
                            value={option.value}
                            onChange={(event) =>
                                onUpdate(index, "value", event.target.value)
                            }
                            placeholder="1, 2, 3..."
                            className="min-w-0 flex-1 rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-blue-400"
                        />

                        <label className="flex items-center gap-1 text-sm font-semibold text-slate-600">
                            <input
                                type="checkbox"
                                checked={option.is_active}
                                onChange={(event) =>
                                    onUpdate(index, "is_active", event.target.checked)
                                }
                            />
                            {t("adminCatalog.form.activeSmall")}
                        </label>

                        <button
                            type="button"
                            onClick={() => onRemove(index)}
                            className="text-red-500 hover:text-red-700"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                ))}
            </div>
        </section>
    );
};