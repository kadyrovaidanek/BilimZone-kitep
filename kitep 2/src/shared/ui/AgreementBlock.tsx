import { useEffect, useState } from "react";
import { ExternalLink, FileText, X } from "lucide-react";
import { useTranslation } from "react-i18next";

import {
    getActiveAgreement,
    type ActiveAgreementAudience,
    type ActiveAgreementContext,
    type Agreement,
} from "@/shared/api/agreements";

type AgreementBlockProps = {
    audience: ActiveAgreementAudience;
    context: ActiveAgreementContext;
    checked: boolean;
    onChange: (checked: boolean) => void;
    onAgreementLoaded?: (agreement: Agreement | null) => void;
    error?: string;
};

export const AgreementBlock = ({
    audience,
    context,
    checked,
    onChange,
    onAgreementLoaded,
    error,
}: AgreementBlockProps) => {
    const { t } = useTranslation();

    const [agreement, setAgreement] = useState<Agreement | null>(null);
    const [loading, setLoading] = useState(false);
    const [opened, setOpened] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        const loadAgreement = async () => {
            try {
                setLoading(true);
                setOpened(false);
                onChange(false);

                const response = await getActiveAgreement({
                    audience,
                    context,
                });

                setAgreement(response.data.agreement);
                onAgreementLoaded?.(response.data.agreement);
            } catch (loadError) {
                console.log("AGREEMENT LOAD ERROR:", loadError);
                setAgreement(null);
                onAgreementLoaded?.(null);
            } finally {
                setLoading(false);
            }
        };

        loadAgreement();
    }, [audience, context]);

    const openAgreement = () => {
        setOpened(true);
        setModalOpen(true);
    };

    if (loading) {
        return (
            <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm font-semibold text-blue-700">
                {t("agreementBlock.loading")}
            </div>
        );
    }

    if (!agreement) {
        return (
            <div className="rounded-2xl border border-orange-100 bg-orange-50 p-4 text-sm font-semibold text-orange-700">
                {t("agreementBlock.empty")}
            </div>
        );
    }

    return (
        <>
            <div className="rounded-3xl border border-blue-100 bg-blue-50 p-4 sm:p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                        <div className="flex items-center gap-2">
                            <FileText className="h-5 w-5 shrink-0 text-blue-700" />

                            <h3 className="break-words text-base font-black text-slate-900 sm:text-lg">
                                {agreement.title}
                            </h3>
                        </div>

                        <p className="mt-2 text-sm leading-6 text-slate-600">
                            {t("agreementBlock.description")}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={openAgreement}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-blue-700 sm:w-auto"
                    >
                        <ExternalLink className="h-4 w-4" />
                        {t("agreementBlock.openAgreement")}
                    </button>
                </div>

                {opened && (
                    <p className="mt-3 text-xs font-bold text-green-600">
                        {t("agreementBlock.read")}
                    </p>
                )}

                <label className="mt-4 flex items-start gap-3 rounded-2xl bg-white p-4">
                    <input
                        type="checkbox"
                        checked={checked}
                        disabled={!opened}
                        onChange={(event) => onChange(event.target.checked)}
                        className="mt-1 h-4 w-4 shrink-0"
                    />

                    <span className="text-sm font-semibold leading-6 text-slate-700">
                        {t("agreementBlock.accept")}

                        {!opened && (
                            <span className="mt-1 block text-xs font-bold text-orange-500">
                                {t("agreementBlock.openAgreement")}
                            </span>
                        )}
                    </span>
                </label>

                {error && (
                    <p className="mt-2 text-sm font-semibold text-red-500">{error}</p>
                )}
            </div>

            {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-3 sm:p-6">
                    <div className="flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
                        <div className="flex items-start justify-between gap-4 border-b border-slate-200 p-4 sm:p-5">
                            <div>
                                <h3 className="text-lg font-black text-slate-900 sm:text-xl">
                                    {agreement.title}
                                </h3>

                                <p className="mt-1 text-sm text-slate-500">
                                    {t("agreementBlock.modalSubtitle")}
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => setModalOpen(false)}
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
                                    {t("agreementBlock.noText")}
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
                                    {t("agreementBlock.openFile")}
                                </a>
                            )}

                            <button
                                type="button"
                                onClick={() => setModalOpen(false)}
                                className="inline-flex items-center justify-center rounded-2xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
                            >
                                {t("agreementBlock.acceptAndBack")}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};