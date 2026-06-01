import { Eye, FileText } from "lucide-react";
import { useTranslation } from "react-i18next";

import type {
    EditPublicationFormState,
    ExistingPublicationFiles,
} from "../../lib/editPublicationTypes";
import {
    getFileFormat,
    getFileNameFromUrl,
    isOfficeFileName,
    isPdfUrl,
} from "../../lib/editPublicationHelpers";

type EditPublicationPreviewProps = {
    form: EditPublicationFormState;
    existingFiles: ExistingPublicationFiles;
    filePreviewUrl: string;
    coverPreviewUrl: string;
    officePreviewText: string;
    onDownload: () => void;
};

export const EditPublicationPreview = ({
    form,
    existingFiles,
    filePreviewUrl,
    coverPreviewUrl,
    officePreviewText,
}: EditPublicationPreviewProps) => {
    const { t } = useTranslation();

    const activeFileUrl =
        filePreviewUrl ||
        existingFiles.pdfFileUrl ||
        existingFiles.previewFileUrl ||
        existingFiles.fileUrl;

    const activeCoverUrl = coverPreviewUrl || existingFiles.coverUrl;

    const fileName =
        form.file?.name ||
        getFileNameFromUrl(existingFiles.fileUrl) ||
        getFileNameFromUrl(existingFiles.pdfFileUrl);

    const format = fileName ? getFileFormat(fileName) : "";

    const isLocalPdf =
        form.file &&
        (form.file.type.includes("pdf") || form.file.name.toLowerCase().endsWith(".pdf"));

    const isExistingPdf = !form.file && isPdfUrl(activeFileUrl);

    return (
        <aside className="xl:sticky xl:top-6 xl:h-fit">
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
                <div className="mb-4 flex items-center gap-2">
                    <Eye className="h-5 w-5 text-blue-600" />
                    <h2 className="text-xl font-black text-slate-900">
                        {t("publication_edit.preview.title")}
                    </h2>
                </div>

                <p className="mb-4 text-sm text-slate-500">
                    {t("publication_edit.preview.subtitle")}
                </p>

                {!activeFileUrl && !form.file ? (
                    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-500">
                        {t("publication_edit.preview.empty")}
                    </div>
                ) : isLocalPdf || isExistingPdf ? (
                    <div className="overflow-hidden rounded-2xl border border-slate-300 bg-white">
                        {activeCoverUrl && (
                            <img
                                src={activeCoverUrl}
                                alt={form.title || "cover"}
                                className="h-48 w-full object-cover sm:h-56"
                            />
                        )}

                        <iframe
                            src={activeFileUrl}
                            title={form.title || fileName}
                            className="h-[420px] w-full border-0 sm:h-[520px]"
                        />

                        <div className="border-t border-slate-200 bg-slate-50 p-3 text-sm text-slate-500">
                            {t("publication_edit.preview.pdfHint", {
                                start: form.preview_start_page,
                                end: form.preview_end_page,
                            })}
                        </div>
                    </div>
                ) : isOfficeFileName(fileName) || form.file ? (
                    <div className="min-h-[420px] overflow-hidden rounded-2xl border border-slate-300 bg-white sm:min-h-[520px]">
                        {activeCoverUrl && (
                            <img
                                src={activeCoverUrl}
                                alt={form.title || "cover"}
                                className="h-48 w-full object-cover sm:h-56"
                            />
                        )}

                        <div className="border-b border-slate-200 bg-slate-800 px-4 py-3 text-white">
                            <div className="flex items-center gap-4 text-sm">
                                <span>☰</span>
                                <span>
                                    {form.preview_start_page} / {form.preview_end_page}
                                </span>
                                <span>−</span>
                                <span>＋</span>
                                <span>↶</span>
                                <span>↷</span>
                                <span className="ml-auto">⋮</span>
                            </div>
                        </div>

                        <div className="p-5 sm:p-6">
                            <div className="mb-5 rounded-2xl bg-blue-50 p-4">
                                <p className="text-sm font-bold text-blue-700">
                                    {t("publication_edit.preview.beforeSave")}
                                </p>

                                <p className="mt-1 text-sm text-blue-600">
                                    {t("publication_edit.preview.officeHint", {
                                        format: format || "FILE",
                                        start: form.preview_start_page,
                                        end: form.preview_end_page,
                                    })}
                                </p>
                            </div>

                            <h3 className="mb-3 text-2xl font-extrabold text-slate-900">
                                {form.title || t("publication_edit.preview.defaultTitle")}
                            </h3>

                            {form.description && (
                                <div className="mb-5 rounded-2xl bg-slate-50 p-4">
                                    <p className="mb-2 text-sm font-bold text-slate-500">
                                        {t("publication_edit.fields.description")}
                                    </p>

                                    <p className="whitespace-pre-wrap text-slate-700">
                                        {form.description}
                                    </p>
                                </div>
                            )}

                            <div className="rounded-2xl border border-slate-200 bg-white p-5">
                                <div className="mb-3 flex items-center gap-2 text-slate-800">
                                    <FileText className="h-5 w-5 text-blue-600" />
                                    <p className="font-bold">
                                        {t("publication_edit.fields.file")}: {fileName}
                                    </p>
                                </div>

                                <div className="max-h-[300px] overflow-y-auto rounded-xl bg-slate-50 p-4 sm:max-h-[360px]">
                                    <pre className="whitespace-pre-wrap font-sans text-sm leading-7 text-slate-700">
                                        {officePreviewText.includes(".")
                                            ? t(officePreviewText)
                                            : officePreviewText ||
                                            t("publication_edit.preview.processing")}
                                    </pre>
                                </div>
                            </div>

                            {filePreviewUrl ? (
                                <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200">
                                    <iframe
                                        src={filePreviewUrl}
                                        title={t("publicationCreate.preview.title", "Предпросмотр PDF")}
                                        className="h-[420px] w-full sm:h-[560px]"
                                    />
                                </div>
                            ) : form.file ? (
                                <div className="mt-5 rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm font-semibold text-blue-700">
                                    Предпросмотр на этой странице доступен для PDF-файлов. Ваш файл будет
                                    обработан после отправки, и выбранные страницы будут доступны читателям.
                                </div>
                            ) : (
                                <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm font-semibold text-slate-500">
                                    Загрузите файл, чтобы увидеть предпросмотр.
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="min-h-[360px] rounded-2xl border border-slate-300 bg-white p-6">
                        {activeCoverUrl && (
                            <img
                                src={activeCoverUrl}
                                alt={form.title || "cover"}
                                className="mb-5 h-48 w-full rounded-xl object-cover sm:h-56"
                            />
                        )}

                        <h3 className="mb-4 text-2xl font-bold text-slate-900">
                            {form.title || t("publication_edit.preview.defaultTitle")}
                        </h3>

                        <p className="whitespace-pre-wrap text-slate-700">
                            {form.description || t("publication_edit.preview.defaultDescription")}
                        </p>

                        <div className="mt-5 rounded-xl bg-blue-50 p-3 text-sm font-semibold text-blue-700">
                            {t("publication_edit.fields.file")}: {fileName}
                        </div>
                    </div>
                )}
            </div>
        </aside>
    );
};