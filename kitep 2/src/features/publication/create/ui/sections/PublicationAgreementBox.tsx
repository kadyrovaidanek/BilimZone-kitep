import { useState } from "react";
import { ExternalLink, FileText, X } from "lucide-react";
import { useTranslation } from "react-i18next";

import type { Agreement } from "@/shared/api/agreements";

type PublicationAgreementBoxProps = {
    agreement: Agreement | null;
    loading: boolean;
    accepted: boolean;
    error?: string;
    onAcceptedChange: (value: boolean) => void;
};

export const PublicationAgreementBox = ({
    agreement,
    loading,
    accepted,
    error,
    onAcceptedChange,
}: PublicationAgreementBoxProps) => {
    const { t } = useTranslation();

    const [isOpen, setIsOpen] = useState(false);
    const [wasOpened, setWasOpened] = useState(false);

    const openAgreement = () => {
        setWasOpened(true);
        setIsOpen(true);
    };

    if (loading) {
        return (
            <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm font-semibold text-blue-700">
                {t("publicationCreate.agreement.loading", "Загрузка договора...")}
            </div>
        );
    }

    if (!agreement) {
        return (
            <div className="rounded-2xl border border-red-100 bg-red-50 p-4">
                <h3 className="font-black text-red-700">
                    {t(
                        "publicationCreate.agreement.notFoundTitle",
                        "Активный договор не найден",
                    )}
                </h3>

                <p className="mt-2 text-sm leading-6 text-red-600">
                    {t(
                        "publicationCreate.agreement.notFoundText",
                        "Администратор должен добавить активный договор для платного материала в разделе договоров.",
                    )}
                </p>

                {error && (
                    <p className="mt-2 text-sm font-semibold text-red-600">{error}</p>
                )}
            </div>
        );
    }

    return (
        <>
            <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4 sm:p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <FileText className="h-5 w-5 text-blue-700" />

                            <h3 className="font-black text-slate-900">
                                {agreement.title}
                            </h3>
                        </div>

                        <p className="mt-2 text-sm leading-6 text-slate-600">
                            {t(
                                "publicationCreate.agreement.description",
                                "Перед размещением платной публикации необходимо ознакомиться с условиями договора.",
                            )}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={openAgreement}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-blue-700 sm:w-auto"
                    >
                        <ExternalLink className="h-4 w-4" />
                        {t("publicationCreate.agreement.open", "Открыть договор")}
                    </button>
                </div>

                <label className="mt-4 flex items-start gap-3 rounded-2xl bg-white p-4">
                    <input
                        type="checkbox"
                        checked={accepted}
                        disabled={!wasOpened}
                        onChange={(event) => onAcceptedChange(event.target.checked)}
                        className="mt-1 h-4 w-4 shrink-0"
                    />

                    <span className="text-sm font-semibold leading-6 text-slate-700">
                        {t(
                            "publicationCreate.agreement.accept",
                            "Я ознакомился(ась) с договором и принимаю условия размещения платной публикации.",
                        )}

                        {!wasOpened && (
                            <span className="mt-1 block text-xs font-bold text-orange-500">
                                {t(
                                    "publicationCreate.agreement.openFirst",
                                    "Сначала откройте договор для ознакомления.",
                                )}
                            </span>
                        )}
                    </span>
                </label>

                {error && (
                    <p className="mt-2 text-sm font-semibold text-red-500">{error}</p>
                )}
            </div>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-3 sm:p-6">
                    <div className="flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
                        <div className="flex items-start justify-between gap-4 border-b border-slate-200 p-4 sm:p-5">
                            <div>
                                <h3 className="text-lg font-black text-slate-900 sm:text-xl">
                                    {agreement.title}
                                </h3>

                                <p className="mt-1 text-sm text-slate-500">
                                    {t(
                                        "publicationCreate.agreement.modalSubtitle",
                                        "Ознакомьтесь с договором перед подтверждением.",
                                    )}
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => setIsOpen(false)}
                                className="rounded-xl border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-50"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="min-h-0 flex-1 overflow-auto p-4 sm:p-5">
                            {agreement.file_url ? (
                                <iframe
                                    src={agreement.file_url}
                                    title={agreement.title}
                                    className="h-[70vh] w-full rounded-2xl border border-slate-200"
                                />
                            ) : agreement.text ? (
                                <div className="whitespace-pre-wrap rounded-2xl bg-slate-50 p-4 text-sm leading-7 text-slate-700 sm:p-5">
                                    {agreement.text}
                                </div>
                            ) : (
                                <div className="rounded-2xl bg-slate-50 p-6 text-center text-slate-500">
                                    {t(
                                        "publicationCreate.agreement.noText",
                                        "Текст договора отсутствует.",
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col gap-3 border-t border-slate-200 p-4 sm:flex-row sm:justify-end sm:p-5">
                            {agreement.file_url && (
                                <a
                                    href={agreement.file_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                                >
                                    <ExternalLink className="h-4 w-4" />
                                    {t(
                                        "publicationCreate.agreement.openNewTab",
                                        "Открыть в новой вкладке",
                                    )}
                                </a>
                            )}

                            <button
                                type="button"
                                onClick={() => setIsOpen(false)}
                                className="inline-flex items-center justify-center rounded-2xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
                            >
                                {t(
                                    "publicationCreate.agreement.readAndBack",
                                    "Ознакомился(ась), вернуться",
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};