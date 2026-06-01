import { CheckCircle2, ReceiptText, X } from "lucide-react";
import { useTranslation } from "react-i18next";

type PurchaseReceipt = {
    receipt_number?: string;
    date?: string;
    buyer?: string;
    owner?: string;
    publication_title?: string;
    material_title?: string;
    amount?: string;
    currency?: string;
    status?: string;
};

type PurchaseReceiptModalProps = {
    open: boolean;
    receipt: PurchaseReceipt | null;
    onClose: () => void;
};

export const PurchaseReceiptModal = ({
    open,
    receipt,
    onClose,
}: PurchaseReceiptModalProps) => {
    const { t } = useTranslation();

    if (!open || !receipt) {
        return null;
    }

    const title =
        receipt.publication_title ||
        receipt.material_title ||
        t("purchase.receipt.publication", "Публикация");

    const currency = receipt.currency || "сом";

    return (
        <div className="fixed inset-0 z-[120] flex items-end bg-slate-950/60 p-3 backdrop-blur-sm sm:items-center sm:justify-center">
            <div className="max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-t-3xl bg-white p-5 shadow-2xl sm:rounded-3xl sm:p-7">
                <div className="mb-5 flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-green-100 text-green-600">
                            <CheckCircle2 size={24} />
                        </div>

                        <div>
                            <h2 className="text-xl font-black text-slate-900 sm:text-2xl">
                                {t("purchase.receipt.title", "Покупка выполнена")}
                            </h2>

                            <p className="mt-1 text-sm leading-6 text-slate-500">
                                {t(
                                    "purchase.receipt.subtitle",
                                    "Чек покупки сохранён в вашем кошельке.",
                                )}
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-2xl bg-slate-100 p-2 text-slate-500 transition hover:bg-slate-200"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                    <div className="mb-5 flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
                            <ReceiptText size={22} />
                        </div>

                        <div>
                            <p className="text-sm font-bold text-slate-500">
                                {t("purchase.receipt.check", "Чек покупки")}
                            </p>

                            <p className="text-lg font-black text-slate-900">
                                № {receipt.receipt_number || "—"}
                            </p>
                        </div>
                    </div>

                    <div className="grid gap-3">
                        <ReceiptRow
                            label={t("purchase.receipt.date", "Дата")}
                            value={receipt.date || "—"}
                        />

                        <ReceiptRow
                            label={t("purchase.receipt.buyer", "Покупатель")}
                            value={receipt.buyer || "—"}
                        />

                        <ReceiptRow
                            label={t("purchase.receipt.owner", "Владелец")}
                            value={receipt.owner || "—"}
                        />

                        <ReceiptRow
                            label={t("purchase.receipt.publication", "Публикация")}
                            value={title}
                        />

                        <div className="rounded-2xl bg-white p-4">
                            <p className="text-sm font-bold text-slate-500">
                                {t("purchase.receipt.amount", "Сумма")}
                            </p>

                            <p className="mt-1 text-2xl font-black text-slate-900">
                                {receipt.amount || "0.00"} {currency}
                            </p>
                        </div>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={onClose}
                    className="mt-5 w-full rounded-2xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
                >
                    {t("common.close", "Закрыть")}
                </button>
            </div>
        </div>
    );
};

function ReceiptRow({
    label,
    value,
}: {
    label: string;
    value: string;
}) {
    return (
        <div className="rounded-2xl bg-white p-4">
            <p className="text-xs font-bold uppercase text-slate-500">
                {label}
            </p>

            <p className="mt-1 break-words text-base font-black text-slate-900">
                {value}
            </p>
        </div>
    );
}