import { useTranslation } from "react-i18next";

import type {
    EditPublicationErrors,
    EditPublicationFormState,
} from "../../lib/editPublicationTypes";
import { EditFormField } from "./EditFormField";

type EditPreviewPagesSectionProps = {
    form: EditPublicationFormState;
    errors: EditPublicationErrors;
    onChange: <K extends keyof EditPublicationFormState>(
        field: K,
        value: EditPublicationFormState[K],
    ) => void;
};

export const EditPreviewPagesSection = ({
    form,
    errors,
    onChange,
}: EditPreviewPagesSectionProps) => {
    const { t } = useTranslation();

    return (
        <section className="border-t border-slate-100 pt-6">
            <h2 className="mb-4 text-xl font-black text-slate-900">
                {t("publication_edit.previewPages.title")}
            </h2>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <EditFormField
                    label={t("publication_edit.previewPages.start")}
                    error={errors.preview_start_page}
                >
                    <input
                        type="number"
                        min="1"
                        value={form.preview_start_page}
                        onChange={(event) =>
                            onChange("preview_start_page", event.target.value)
                        }
                        className={`w-full rounded-2xl border px-4 py-3 outline-none transition focus:ring-2 ${errors.preview_start_page
                                ? "border-red-300 focus:ring-red-100"
                                : "border-slate-200 focus:border-blue-400 focus:ring-blue-100"
                            }`}
                    />
                </EditFormField>

                <EditFormField
                    label={t("publication_edit.previewPages.end")}
                    error={errors.preview_end_page}
                >
                    <input
                        type="number"
                        min="1"
                        value={form.preview_end_page}
                        onChange={(event) =>
                            onChange("preview_end_page", event.target.value)
                        }
                        className={`w-full rounded-2xl border px-4 py-3 outline-none transition focus:ring-2 ${errors.preview_end_page
                                ? "border-red-300 focus:ring-red-100"
                                : "border-slate-200 focus:border-blue-400 focus:ring-blue-100"
                            }`}
                    />
                </EditFormField>
            </div>

            <p className="mt-3 text-sm text-slate-400">
                {t("publication_edit.previewPages.hint")}
            </p>
        </section>
    );
};