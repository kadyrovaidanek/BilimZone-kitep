import { FileSearch, SpellCheck, ShieldCheck } from "lucide-react";
import { useTranslation } from "react-i18next";

type PublicationPreSubmitInfoProps = {
    hasFile: boolean;
    hasPdfPreview: boolean;
};

export const PublicationPreSubmitInfo = ({
    hasFile,
    hasPdfPreview,
}: PublicationPreSubmitInfoProps) => {
    const { t } = useTranslation();

    return (
        <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <h2 className="text-lg font-black text-slate-900">
                {t(
                    "publicationCreate.preSubmit.title",
                    "Проверка перед отправкой",
                )}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
                {t(
                    "publicationCreate.preSubmit.subtitle",
                    "Перед отправкой система проверит материал и подскажет, если нужно что-то исправить.",
                )}
            </p>

            <div className="mt-4 grid gap-3 md:grid-cols-3">
                <div className="rounded-2xl bg-slate-50 p-4">
                    <div className="mb-2 flex items-center gap-2 font-bold text-slate-800">
                        <SpellCheck className="h-5 w-5 text-blue-600" />

                        {t(
                            "publicationCreate.preSubmit.textTitle",
                            "Проверка текста",
                        )}
                    </div>

                    <p className="text-sm text-slate-500">
                        {t(
                            "publicationCreate.preSubmit.textDescription",
                            "Система проверит название и описание: заглавные буквы и возможные ошибки.",
                        )}
                    </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                    <div className="mb-2 flex items-center gap-2 font-bold text-slate-800">
                        <FileSearch className="h-5 w-5 text-blue-600" />

                        {t(
                            "publicationCreate.preSubmit.similarityTitle",
                            "Похожие материалы",
                        )}
                    </div>

                    <p className="text-sm text-slate-500">
                        {t(
                            "publicationCreate.preSubmit.similarityDescription",
                            "Файл будет сравнен с материалами, которые уже опубликованы в каталоге.",
                        )}
                    </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                    <div className="mb-2 flex items-center gap-2 font-bold text-slate-800">
                        <ShieldCheck className="h-5 w-5 text-blue-600" />

                        {t(
                            "publicationCreate.preSubmit.previewTitle",
                            "Предпросмотр",
                        )}
                    </div>

                    <p className="text-sm text-slate-500">
                        {hasFile
                            ? hasPdfPreview
                                ? t(
                                    "publicationCreate.preSubmit.previewReady",
                                    "Предпросмотр файла готов.",
                                )
                                : t(
                                    "publicationCreate.preSubmit.previewWaiting",
                                    "Файл выбран. Предпросмотр можно обновить в блоке выше.",
                                )
                            : t(
                                "publicationCreate.preSubmit.previewEmpty",
                                "Сначала загрузите файл материала.",
                            )}
                    </p>
                </div>
            </div>
        </section>
    );
};