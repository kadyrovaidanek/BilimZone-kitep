import { CheckCircle2, FileUp } from "lucide-react";
import { useTranslation } from "react-i18next";

import type {
    CreatePublicationErrors,
    CreatePublicationFormState,
} from "../../model/types";

type FilesSectionProps = {
    form: CreatePublicationFormState;
    errors: CreatePublicationErrors;
    onFileChange: (
        field: "file" | "cover",
    ) => (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export const FilesSection = ({
    form,
    errors,
    onFileChange,
}: FilesSectionProps) => {
    const { t } = useTranslation();

    return (
        <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
            <h2 className="mb-5 text-xl font-black text-slate-900">
                {t("publicationCreate.sections.files", "Файл материала")}
            </h2>

            <label className="block rounded-2xl border border-dashed border-slate-300 p-4 transition hover:border-blue-300 hover:bg-blue-50/40">
                <span className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-700">
                    <FileUp className="h-5 w-5 text-blue-600" />
                    {t("publicationCreate.fields.file", "Файл публикации")}
                </span>

                <input
                    type="file"
                    accept=".pdf,.doc,.docx,.ppt,.pptx"
                    onChange={onFileChange("file")}
                    className="w-full text-sm text-slate-500 file:mr-4 file:rounded-xl file:border-0 file:bg-blue-50 file:px-4 file:py-3 file:font-bold file:text-blue-700 hover:file:bg-blue-100"
                />

                {form.file ? (
                    <div className="mt-4 flex items-start gap-3 rounded-2xl border border-green-100 bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">
                        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />

                        <div>
                            <p>
                                {t(
                                    "publicationCreate.messages.fileSelected",
                                    "Файл выбран и сохранён в форме",
                                )}
                            </p>

                            <p className="mt-1 break-all text-xs text-green-600">
                                {form.file.name}
                            </p>

                            <p className="mt-1 text-xs text-green-600">
                                {t(
                                    "publicationCreate.messages.fileStillSaved",
                                    "Если вы исправляете текст, файл не нужно загружать заново.",
                                )}
                            </p>
                        </div>
                    </div>
                ) : (
                    <p className="mt-3 text-xs font-semibold text-slate-400">
                        {t(
                            "publicationCreate.hints.file",
                            "Поддерживаются PDF, DOC, DOCX, PPT и PPTX.",
                        )}
                    </p>
                )}

                {errors.file && (
                    <p className="mt-2 text-sm font-semibold text-red-500">
                        {errors.file}
                    </p>
                )}
            </label>
        </section>
    );
};