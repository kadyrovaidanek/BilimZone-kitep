import {
    ArrowDownLeft,
    ArrowUpRight,
    Clock3,
    ReceiptText,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import type { WalletTransaction } from "../../lib/walletTypes";

type WalletTransactionsProps = {
    transactions: WalletTransaction[];
};

export const WalletTransactions = ({ transactions }: WalletTransactionsProps) => {
    const { t } = useTranslation();

    return (
        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <h2 className="text-xl font-black text-slate-900">
                {t("wallet.transactions")}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
                {t("wallet.transactionsSubtitle")}
            </p>

            {transactions.length === 0 ? (
                <div className="mt-5 rounded-2xl border border-dashed border-slate-300 p-8 text-center text-slate-500">
                    {t("wallet.noTransactions")}
                </div>
            ) : (
                <div className="mt-5 space-y-3">
                    {transactions.map((item) => {
                        const Icon =
                            item.type === "deposit"
                                ? ArrowDownLeft
                                : item.type === "withdraw"
                                    ? ArrowUpRight
                                    : ReceiptText;

                        return (
                            <div
                                key={item.id}
                                className="flex flex-col gap-3 rounded-2xl bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-blue-600">
                                        <Icon size={20} />
                                    </div>

                                    <div>
                                        <p className="font-bold text-slate-900">{item.title}</p>
                                        <p className="text-sm text-slate-500">
                                            {new Date(item.date).toLocaleString()}
                                        </p>
                                    </div>
                                </div>

                                <div className="text-left sm:text-right">
                                    <p className="font-black text-slate-900">
                                        {item.amount} {t("publication.price.currency")}
                                    </p>

                                    <p className="inline-flex items-center gap-1 text-sm text-slate-500">
                                        <Clock3 size={14} />
                                        {t(`wallet.status.${item.status}`)}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </section>
    );
};