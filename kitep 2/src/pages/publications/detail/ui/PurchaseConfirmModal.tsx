import { CreditCard, X } from "lucide-react";
import { useTranslation } from "react-i18next";

type PurchaseConfirmModalProps = {
    open: boolean;
    title: string;
    price: string | number;
    isPaid: boolean;
    processing: boolean;
    onClose: () => void;
    onConfirm: () => void;
};

export const PurchaseConfirmModal = ({
    open,
    title,
    price,
    isPaid,
    processing,
    onClose,
    onConfirm,
}: PurchaseConfirmModalProps) => {
    const { t } = useTranslation();

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-end bg-slate-950/60 p-3 backdrop-blur-sm sm:items-center sm:justify-center">
            <div className="w-full max-w-lg rounded-t-3xl bg-white p-5 shadow-2xl sm:rounded-3xl sm:p-7">
                <div className="mb-5 flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
                            <CreditCard size={24} />
                        </div>

                        <div>
                            <h2 className="text-xl font-black text-slate-900 sm:text-2xl">
                                {t("purchase.confirm.title")}
                            </h2>

                            <p className="mt-2 text-sm leading-6 text-slate-500">
                                {isPaid
                                    ? t("purchase.confirm.paidText", { title, price })
                                    : t("purchase.confirm.freeText", { title })}
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={processing}
                        className="rounded-2xl bg-slate-100 p-2 text-slate-500 transition hover:bg-slate-200 disabled:opacity-60"
                        aria-label={t("common.close")}
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={processing}
                        className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
                    >
                        {t("common.cancel")}
                    </button>

                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={processing}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700 disabled:bg-blue-300"
                    >
                        <CreditCard size={18} />
                        {processing
                            ? t("publication.detail.buying")
                            : t("purchase.confirm.confirm")}
                    </button>
                </div>
            </div>
        </div>
    );
};