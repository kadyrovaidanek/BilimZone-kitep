import { useTranslation } from "react-i18next";

import type {
    EditPublicationFormState,
    EditPublicationType,
} from "../../lib/editPublicationTypes";
import { EditFormField } from "./EditFormField";

type EditMainInfoSectionProps = {
    form: EditPublicationFormState;
    errors: Partial<Record<keyof EditPublicationFormState, string>>;
    onChange: <K extends keyof EditPublicationFormState>(
        field: K,
        value: EditPublicationFormState[K],
    ) => void;
};

export const EditMainInfoSection = ({
    form,
    errors,
    onChange,
}: EditMainInfoSectionProps) => {
    const { t } = useTranslation();

    const publicationTypes: EditPublicationType[] = [
        "book",
        "article",
        "coursework",
        "diploma",
        "lecture",
        "methodical",
        "test",
        "other",
    ];

    return (
        <section>
            <h2 className="mb-4 text-xl font-black text-slate-900">
                {t("publication_edit.sections.main")}
            </h2>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <EditFormField
                    label={t("publication_edit.fields.title")}
                    error={errors.title}
                    className="lg:col-span-2"
                >
                    <input
                        value={form.title}
                        onChange={(event) => onChange("title", event.target.value)}
                        placeholder={t("publication_edit.placeholders.title")}
                        className={`w-full rounded-2xl border px-4 py-3 outline-none transition focus:ring-2 ${errors.title
                                ? "border-red-300 focus:ring-red-100"
                                : "border-slate-200 focus:border-blue-400 focus:ring-blue-100"
                            }`}
                    />
                </EditFormField>

                <label className="block lg:col-span-2">
                    <span className="mb-2 block text-sm font-semibold text-slate-700">
                        {t("publication_edit.fields.description")}
                    </span>

                    <textarea
                        value={form.description}
                        onChange={(event) => onChange("description", event.target.value)}
                        placeholder={t("publication_edit.placeholders.description")}
                        className="min-h-[130px] w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                    />
                </label>

                <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-slate-700">
                        {t("publication_edit.fields.publicationType")}
                    </span>

                    <select
                        value={form.publication_type}
                        onChange={(event) =>
                            onChange(
                                "publication_type",
                                event.target.value as EditPublicationType,
                            )
                        }
                        className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                    >
                        {publicationTypes.map((type) => (
                            <option key={type} value={type}>
                                {t(`publication.types.${type}`)}
                            </option>
                        ))}
                    </select>
                </label>
            </div>
        </section>
    );
};