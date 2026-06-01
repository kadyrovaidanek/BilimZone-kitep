import type { ChangeEvent, ReactNode } from "react";
import { CheckCircle, FileText, ImageIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

import type {
    EditPublicationErrors,
    EditPublicationFormState,
    ExistingPublicationFiles,
} from "../../lib/editPublicationTypes";
import { getFileNameFromUrl } from "../../lib/editPublicationHelpers";

type EditFilesSectionProps = {
    form: EditPublicationFormState;
    errors: EditPublicationErrors;
    existingFiles: ExistingPublicationFiles;
    onDocumentChange: (event: ChangeEvent<HTMLInputElement>) => void;
    onCoverChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

export const EditFilesSection = ({
    form,
    errors,
    existingFiles,
    onDocumentChange,
    onCoverChange,
}: EditFilesSectionProps) => {
    const { t } = useTranslation();

    return (
        <section className="border-t border-slate-100 pt-6">
            <h2 className="mb-4 text-xl font-black text-slate-900">
                {t("publication_edit.sections.files")}
            </h2>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <FileBox
                    label={t("publication_edit.fields.file")}
                    hint={t("publication_edit.hints.file")}
                    icon={<FileText size={18} className="text-blue-600" />}
                    accept=".pdf,.doc,.docx,.ppt,.pptx"
                    onChange={onDocumentChange}
                    fileName={
                        form.file?.name ||
                        getFileNameFromUrl(existingFiles.fileUrl) ||
                        existingFiles.fileName
                    }
                    error={errors.file}
                    color="blue"
                />

                <FileBox
                    label={t("publication_edit.fields.cover")}
                    hint={t("publication_edit.hints.cover")}
                    icon={<ImageIcon size={18} className="text-orange-500" />}
                    accept=".jpg,.jpeg,.png,image/jpeg,image/png"
                    onChange={onCoverChange}
                    fileName={form.cover?.name || getFileNameFromUrl(existingFiles.coverUrl)}
                    error={errors.cover}
                    color="orange"
                />
            </div>
        </section>
    );
};

function FileBox({
    label,
    hint,
    icon,
    accept,
    fileName,
    error,
    color,
    onChange,
}: {
    label: string;
    hint: string;
    icon: ReactNode;
    accept: string;
    fileName?: string;
    error?: string;
    color: "blue" | "orange";
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}) {
    const { t } = useTranslation();

    const colorClass =
        color === "blue"
            ? "file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            : "file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100";

    return (
        <label className="block rounded-2xl border border-slate-200 p-4">
            <span className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700">
                {icon}
                {label}
            </span>

            <input
                type="file"
                accept={accept}
                onChange={onChange}
                className={`w-full text-sm text-slate-500 file:mr-4 file:rounded-xl file:border-0 file:px-4 file:py-2.5 file:font-semibold ${colorClass}`}
            />

            <p className="mt-2 text-xs text-slate-400">{hint}</p>

            {fileName && (
                <p className="mt-2 text-sm font-semibold text-green-600">
                    <CheckCircle size={16} className="mr-1 inline" />
                    {fileName}
                </p>
            )}

            {error && (
                <p className="mt-2 text-sm text-red-500">
                    {error.includes(".") ? t(error) : error}
                </p>
            )}
        </label>
    );
}