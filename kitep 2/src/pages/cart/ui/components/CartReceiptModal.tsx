import { CheckCircle2, ReceiptText, X } from "lucide-react";
import { useTranslation } from "react-i18next";

type CartReceiptModalProps = {
    open: boolean;
    receipt: any | null;
    onClose: () => void;
};

export const CartReceiptModal = ({
    open,
    receipt,
    onClose,
}: CartReceiptModalProps) => {
    const { t } = useTranslation();

    if (!open || !receipt) return null;

    const publicationTitle =
        receipt.publication_title || receipt.material_title || t("cart.receipt.noTitle");

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 py-6 backdrop-blur-sm">
            <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-5 shadow-2xl sm:p-6">
                <div className="mb-5 flex items-start justify-between gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-green-50 text-green-600">
                        <ReceiptText size={24} />
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="mb-5 flex items-center gap-2">
                    <CheckCircle2 className="text-green-600" size={22} />
                    <h3 className="text-xl font-black text-slate-900 sm:text-2xl">
                        {t("cart.receipt.title")}
                    </h3>
                </div>

                <div className="space-y-3 rounded-2xl bg-slate-50 p-4 text-sm">
                    <div className="flex justify-between gap-4">
                        <span className="text-slate-500">{t("cart.receipt.number")}</span>
                        <span className="font-bold text-slate-900">{receipt.receipt_number}</span>
                    </div>

                    <div className="flex justify-between gap-4">
                        <span className="text-slate-500">{t("cart.receipt.date")}</span>
                        <span className="text-right font-bold text-slate-900">{receipt.date}</span>
                    </div>

                    <div className="flex justify-between gap-4">
                        <span className="text-slate-500">{t("cart.receipt.buyer")}</span>
                        <span className="font-bold text-slate-900">{receipt.buyer}</span>
                    </div>

                    <div className="flex justify-between gap-4">
                        <span className="text-slate-500">{t("cart.receipt.owner")}</span>
                        <span className="font-bold text-slate-900">{receipt.owner}</span>
                    </div>
                </div>

                <div className="mt-4 rounded-2xl border border-slate-200 p-4">
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                        {t("cart.receipt.publication")}
                    </p>

                    <p className="mt-2 text-base font-black text-slate-900">
                        {publicationTitle}
                    </p>
                </div>

                <div className="mt-4 space-y-3 rounded-2xl bg-blue-50 p-4 text-sm">
                    <div className="flex justify-between gap-4">
                        <span className="text-slate-600">{t("cart.receipt.amount")}</span>
                        <span className="font-black text-blue-700">
                            {receipt.amount} {receipt.currency}
                        </span>
                    </div>

                    <div className="flex justify-between gap-4">
                        <span className="text-slate-600">{t("cart.receipt.ownerAmount")}</span>
                        <span className="font-bold text-slate-900">
                            {receipt.owner_amount} {receipt.currency}
                        </span>
                    </div>

                    <div className="flex justify-between gap-4">
                        <span className="text-slate-600">{t("cart.receipt.systemAmount")}</span>
                        <span className="font-bold text-slate-900">
                            {receipt.system_amount} {receipt.currency}
                        </span>
                    </div>

                    <div className="flex justify-between gap-4">
                        <span className="text-slate-600">{t("cart.receipt.commission")}</span>
                        <span className="font-bold text-slate-900">
                            {receipt.commission_percent}
                        </span>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={onClose}
                    className="mt-6 w-full rounded-2xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
                >
                    {t("cart.modal.close")}
                </button>
            </div>
        </div>
    );
};