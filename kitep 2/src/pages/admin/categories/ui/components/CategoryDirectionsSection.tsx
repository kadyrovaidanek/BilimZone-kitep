import { ListPlus, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { DirectionForm } from "../../lib/categoryTypes";

type CategoryDirectionsSectionProps = {
    directions: DirectionForm[];
    onAdd: () => void;
    onUpdate: (
        index: number,
        field: keyof DirectionForm,
        value: string | boolean | number,
    ) => void;
    onRemove: (index: number) => void;
};

export const CategoryDirectionsSection = ({
    directions,
    onAdd,
    onUpdate,
    onRemove,
}: CategoryDirectionsSectionProps) => {
    const { t } = useTranslation();

    return (
        <section className="mt-6 rounded-3xl border border-slate-200 p-4 sm:p-5">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h3 className="text-lg font-black text-slate-900">
                        {t("adminCatalog.form.directions")}
                    </h3>

                    <p className="text-sm text-slate-500">
                        {t("adminCatalog.form.directionsHint")}
                    </p>
                </div>

                <button
                    type="button"
                    onClick={onAdd}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-50 px-4 py-2 font-bold text-blue-600 transition hover:bg-blue-100"
                >
                    <ListPlus size={18} />
                    {t("adminCatalog.actions.addDirection")}
                </button>
            </div>

            <div className="space-y-3">
                {directions.map((direction, index) => (
                    <div
                        key={direction.id || index}
                        className="grid grid-cols-1 gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-3 lg:grid-cols-[1fr_1fr_auto_auto]"
                    >
                        <input
                            value={direction.name_ru}
                            onChange={(event) =>
                                onUpdate(index, "name_ru", event.target.value)
                            }
                            placeholder={t("adminCatalog.form.directionRu")}
                            className="rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-blue-400"
                        />

                        <input
                            value={direction.name_kg}
                            onChange={(event) =>
                                onUpdate(index, "name_kg", event.target.value)
                            }
                            placeholder={t("adminCatalog.form.directionKg")}
                            className="rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-blue-400"
                        />

                        <label className="flex items-center gap-2 text-sm font-semibold text-slate-600">
                            <input
                                type="checkbox"
                                checked={direction.is_active}
                                onChange={(event) =>
                                    onUpdate(index, "is_active", event.target.checked)
                                }
                            />
                            {t("adminCatalog.form.activeSmall")}
                        </label>

                        <button
                            type="button"
                            onClick={() => onRemove(index)}
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-50 px-3 py-2 text-sm font-bold text-red-600 hover:bg-red-100"
                        >
                            <Trash2 size={16} />
                            {t("common.delete")}
                        </button>
                    </div>
                ))}
            </div>
        </section>
    );
};