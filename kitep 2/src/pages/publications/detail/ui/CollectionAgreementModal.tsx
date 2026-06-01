import { useState } from "react";
import { AlertTriangle, CheckCircle2, ShieldCheck, X } from "lucide-react";
import { useTranslation } from "react-i18next";

type CollectionAgreementModalProps = {
    open: boolean;
    isPaid: boolean;
    processing: boolean;
    onClose: () => void;
    onConfirm: () => void;
};

export const CollectionAgreementModal = ({
    open,
    isPaid,
    processing,
    onClose,
    onConfirm,
}: CollectionAgreementModalProps) => {
    const { t } = useTranslation();
    const [accepted, setAccepted] = useState(false);

    if (!open) {
        return null;
    }

    const handleClose = () => {
        if (processing) {
            return;
        }

        setAccepted(false);
        onClose();
    };

    const handleConfirm = () => {
        if (!accepted || processing) {
            return;
        }

        setAccepted(false);
        onConfirm();
    };

    const rules = t("publication.collectionAgreement.rules", {
        returnObjects: true,
    }) as string[];

    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/50 px-3 py-4 backdrop-blur-sm sm:items-center sm:px-4">
            <div className="w-full max-w-lg rounded-3xl bg-white p-5 shadow-2xl sm:p-6">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                            <ShieldCheck className="h-6 w-6" />
                        </div>

                        <div>
                            <h2 className="text-lg font-black text-slate-900 sm:text-xl">
                                {t(
                                    "publication.collectionAgreement.title",
                                    "Условия использования материала",
                                )}
                            </h2>

                            <p className="mt-1 text-sm font-semibold leading-5 text-slate-500">
                                {isPaid
                                    ? t(
                                        "publication.collectionAgreement.paidDescription",
                                        "Перед покупкой подтвердите, что вы принимаете правила использования материала.",
                                    )
                                    : t(
                                        "publication.collectionAgreement.freeDescription",
                                        "Перед добавлением материала в коллекцию подтвердите, что вы принимаете правила использования.",
                                    )}
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={handleClose}
                        disabled={processing}
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
                        aria-label={t(
                            "publication.collectionAgreement.close",
                            "Закрыть",
                        )}
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="mt-5 rounded-2xl border border-amber-100 bg-amber-50 p-4">
                    <div className="flex gap-3">
                        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />

                        <div>
                            <p className="text-sm font-bold text-amber-800">
                                {t(
                                    "publication.collectionAgreement.warningTitle",
                                    "Важно",
                                )}
                            </p>

                            <p className="mt-1 text-sm font-semibold leading-6 text-amber-700">
                                {t(
                                    "publication.collectionAgreement.warningText",
                                    "Материал защищён авторскими правами. Его можно использовать только согласно условиям платформы.",
                                )}
                            </p>
                        </div>
                    </div>
                </div>

                <ul className="mt-5 grid gap-3">
                    {Array.isArray(rules) &&
                        rules.map((rule, index) => (
                            <li
                                key={index}
                                className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm font-semibold leading-6 text-slate-700"
                            >
                                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
                                <span>{rule}</span>
                            </li>
                        ))}
                </ul>

                <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-200 p-4 transition hover:bg-slate-50">
                    <input
                        type="checkbox"
                        checked={accepted}
                        onChange={(event) => setAccepted(event.target.checked)}
                        className="mt-1 h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />

                    <span className="text-sm font-bold leading-6 text-slate-700">
                        {t(
                            "publication.collectionAgreement.checkbox",
                            "Я ознакомился(ась) с условиями и принимаю их",
                        )}
                    </span>
                </label>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    <button
                        type="button"
                        onClick={handleClose}
                        disabled={processing}
                        className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {t("publication.collectionAgreement.cancel", "Отмена")}
                    </button>

                    <button
                        type="button"
                        onClick={handleConfirm}
                        disabled={!accepted || processing}
                        className="rounded-2xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                    >
                        {processing
                            ? t(
                                "publication.collectionAgreement.processing",
                                "Обработка...",
                            )
                            : t(
                                "publication.collectionAgreement.continue",
                                "Продолжить",
                            )}
                    </button>
                </div>
            </div>
        </div>
    );
};