import { Download, ReceiptText } from "lucide-react";
import { useTranslation } from "react-i18next";

import type { WalletReceipt } from "../../lib/walletTypes";

type WalletReceiptsProps = {
    receipts: WalletReceipt[];
    onDownload: (receipt: WalletReceipt) => void;
    onDownloadAll: () => void;
};

export const WalletReceipts = ({
    receipts,
    onDownload,
    onDownloadAll,
}: WalletReceiptsProps) => {
    const { t } = useTranslation();

    return (
        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="flex items-center gap-2 text-xl font-black text-slate-900">
                        <ReceiptText className="text-blue-600" />
                        {t("wallet.receipts")}
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                        {t("wallet.receiptsSubtitle")}
                    </p>
                </div>

                {receipts.length > 0 && (
                    <button
                        type="button"
                        onClick={onDownloadAll}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-50 px-4 py-3 text-sm font-bold text-blue-700 hover:bg-blue-100"
                    >
                        <Download size={16} />
                        {t("wallet.downloadAllReceipts")}
                    </button>
                )}
            </div>

            {receipts.length === 0 ? (
                <div className="mt-5 rounded-2xl border border-dashed border-slate-300 p-8 text-center text-slate-500">
                    {t("wallet.noReceipts")}
                </div>
            ) : (
                <div className="mt-5 grid gap-4 lg:grid-cols-2">
                    {receipts.map((receipt) => {
                        const title = receipt.publication_title || "—";
                        return (
                            <div
                                key={receipt.id || receipt.receipt_number}
                                className="rounded-2xl border border-slate-200 p-4"
                            >
                                <p className="text-sm font-bold text-blue-600">
                                    {receipt.receipt_number}
                                </p>

                                <h3 className="mt-1 font-black text-slate-900">{title}</h3>

                                <div className="mt-3 space-y-1 text-sm text-slate-500">
                                    <p>
                                        {t("wallet.receiptDate")}: {receipt.date}
                                    </p>
                                    <p>
                                        {t("wallet.receiptAmount")}: {receipt.amount}{" "}
                                        {receipt.currency}
                                    </p>
                                    <p>
                                        {t("wallet.receiptStatus")}: {receipt.status}
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => onDownload(receipt)}
                                    className="mt-4 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-bold text-white hover:bg-slate-800"
                                >
                                    <Download size={16} />
                                    {t("wallet.downloadReceipt")}
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}
        </section>
    );
};