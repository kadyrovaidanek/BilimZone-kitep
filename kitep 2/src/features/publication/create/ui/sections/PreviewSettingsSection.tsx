import { FileText, Info, Loader2, RefreshCw } from "lucide-react";
import { useTranslation } from "react-i18next";

import { getReadableFileFormat } from "../../lib/fileValidation";

import type {
    CreatePublicationErrors,
    CreatePublicationField,
    CreatePublicationFormState,
} from "../../model/types";

type PreviewSettingsSectionProps = {
    form: CreatePublicationFormState;
    errors: CreatePublicationErrors;
    filePreviewUrl: string;
    isPreviewLoading: boolean;
    previewError: string;
    onRefreshPreview: () => void;
    onChange: <K extends CreatePublicationField>(
        field: K,
        value: CreatePublicationFormState[K],
    ) => void;
};

export const PreviewSettingsSection = ({
    form,
    errors,
    filePreviewUrl,
    isPreviewLoading,
    previewError,
    onRefreshPreview,
    onChange,
}: PreviewSettingsSectionProps) => {
    const { t } = useTranslation();

    const fileFormat = getReadableFileFormat(form.file);

    return (
        <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <h2 className="text-xl font-black text-slate-900">
                        {t("publicationCreate.sections.preview", "Предпросмотр")}
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                        {t(
                            "publicationCreate.preview.description",
                            "Выберите страницы, которые будут доступны читателям перед скачиванием материала.",
                        )}
                    </p>
                </div>

                {form.file && (
                    <button
                        type="button"
                        onClick={onRefreshPreview}
                        disabled={isPreviewLoading}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm font-bold text-blue-700 transition hover:bg-blue-100 disabled:opacity-60"
                    >
                        {isPreviewLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <RefreshCw className="h-4 w-4" />
                        )}

                        {t(
                            "publicationCreate.preview.refresh",
                            "Обновить предпросмотр",
                        )}
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <label className="block">
                    <span className="mb-2 block text-sm font-bold text-slate-700">
                        {t("publicationCreate.fields.previewStart", "Начальная страница")}
                    </span>

                    <input
                        type="number"
                        min="1"
                        value={form.preview_start_page}
                        onChange={(event) =>
                            onChange("preview_start_page", event.target.value)
                        }
                        className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                    />

                    {errors.preview_start_page && (
                        <p className="mt-2 text-sm font-semibold text-red-500">
                            {errors.preview_start_page}
                        </p>
                    )}
                </label>

                <label className="block">
                    <span className="mb-2 block text-sm font-bold text-slate-700">
                        {t("publicationCreate.fields.previewEnd", "Конечная страница")}
                    </span>

                    <input
                        type="number"
                        min="1"
                        value={form.preview_end_page}
                        onChange={(event) =>
                            onChange("preview_end_page", event.target.value)
                        }
                        className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                    />

                    {errors.preview_end_page && (
                        <p className="mt-2 text-sm font-semibold text-red-500">
                            {errors.preview_end_page}
                        </p>
                    )}
                </label>
            </div>

            <p className="mt-3 text-xs font-semibold text-slate-400">
                {t(
                    "publicationCreate.hints.preview",
                    "Читатели увидят только выбранные страницы. Максимум — 5 страниц.",
                )}
            </p>

            {isPreviewLoading && (
                <div className="mt-5 flex items-center gap-3 rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm font-bold text-blue-700">
                    <Loader2 className="h-5 w-5 animate-spin" />

                    {t(
                        "publicationCreate.preview.loading",
                        "Готовим предпросмотр файла...",
                    )}
                </div>
            )}

            {previewError && !isPreviewLoading && (
                <div className="mt-5 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-semibold text-red-700">
                    {previewError}
                </div>
            )}

            {filePreviewUrl && !isPreviewLoading && (
                <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white">
                    <iframe
                        src={filePreviewUrl}
                        title={t("publicationCreate.preview.title", "Предпросмотр файла")}
                        className="h-[420px] w-full border-0 sm:h-[560px] lg:h-[640px]"
                    />

                    <div className="border-t border-slate-200 bg-slate-50 p-3 text-sm font-semibold text-slate-500">
                        {t(
                            "publicationCreate.preview.ready",
                            "Предпросмотр готов. Именно эти страницы увидят читатели.",
                        )}
                    </div>
                </div>
            )}

            {!form.file && !isPreviewLoading && (
                <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-slate-500">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                        <Info className="h-5 w-5 shrink-0" />

                        <p className="text-sm font-semibold">
                            {t(
                                "publicationCreate.preview.empty",
                                "Загрузите файл материала, чтобы увидеть предпросмотр.",
                            )}
                        </p>
                    </div>
                </div>
            )}

            {form.file && !filePreviewUrl && !isPreviewLoading && !previewError && (
                <div className="mt-5 rounded-2xl border border-blue-100 bg-blue-50 p-4 text-blue-800">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-blue-600">
                            <FileText className="h-6 w-6" />
                        </div>

                        <div className="min-w-0 flex-1">
                            <p className="font-black">
                                {t(
                                    "publicationCreate.preview.waiting",
                                    "Предпросмотр ещё не создан",
                                )}
                            </p>

                            <p className="mt-1 break-all text-sm font-semibold">
                                {form.file.name}
                            </p>

                            <p className="mt-2 text-sm leading-6">
                                {t(
                                    "publicationCreate.preview.tryRefresh",
                                    "Нажмите «Обновить предпросмотр», чтобы открыть выбранные страницы файла {{format}}.",
                                    {
                                        format: fileFormat,
                                    },
                                )}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};