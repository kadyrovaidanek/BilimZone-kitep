import { useTranslation } from "react-i18next";

import type {
    CreatePublicationErrors,
    CreatePublicationField,
    CreatePublicationFormState,
    PublicationType,
} from "../../model/types";

type MainInfoSectionProps = {
    form: CreatePublicationFormState;
    errors: CreatePublicationErrors;
    onChange: <K extends CreatePublicationField>(
        field: K,
        value: CreatePublicationFormState[K],
    ) => void;
};

const publicationTypes: PublicationType[] = [
    "book",
    "article",
    "coursework",
    "diploma",
    "lecture",
    "methodical",
    "test",
    "other",
];

export const MainInfoSection = ({
    form,
    errors,
    onChange,
}: MainInfoSectionProps) => {
    const { t } = useTranslation();

    return (
        <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
            <h2 className="mb-5 text-xl font-black text-slate-900">
                {t("publicationCreate.sections.main", "Основная информация")}
            </h2>

            <div className="grid gap-4">
                <label className="block">
                    <span className="mb-2 block text-sm font-bold text-slate-700">
                        {t("publicationCreate.fields.title", "Название публикации")}
                    </span>

                    <input
                        value={form.title}
                        onChange={(event) => onChange("title", event.target.value)}
                        placeholder={t(
                            "publicationCreate.placeholders.title",
                            "Например: Методическое пособие по математике",
                        )}
                        className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                    />

                    {errors.title && (
                        <p className="mt-2 text-sm font-semibold text-red-500">
                            {errors.title}
                        </p>
                    )}
                </label>

                <label className="block">
                    <span className="mb-2 block text-sm font-bold text-slate-700">
                        {t("publicationCreate.fields.description", "Описание")}
                    </span>

                    <textarea
                        value={form.description}
                        onChange={(event) => onChange("description", event.target.value)}
                        placeholder={t(
                            "publicationCreate.placeholders.description",
                            "Кратко опишите содержание публикации...",
                        )}
                        className="min-h-[140px] w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                    />

                    {errors.description && (
                        <p className="mt-2 text-sm font-semibold text-red-500">
                            {errors.description}
                        </p>
                    )}
                </label>

                <label className="block">
                    <span className="mb-2 block text-sm font-bold text-slate-700">
                        {t("publicationCreate.fields.type", "Тип публикации")}
                    </span>

                    <select
                        value={form.publication_type}
                        onChange={(event) =>
                            onChange("publication_type", event.target.value as PublicationType)
                        }
                        className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                    >
                        {publicationTypes.map((type) => (
                            <option key={type} value={type}>
                                {t(`publicationCreate.types.${type}`, type)}
                            </option>
                        ))}
                    </select>
                </label>
            </div>
        </section>
    );
};