import { ArrowDownLeft, ArrowUpRight, Banknote, CreditCard } from "lucide-react";
import { useTranslation } from "react-i18next";

type WalletBalanceCardProps = {
    balance: number;
    linkedCard: string;
    onDeposit: () => void;
    onWithdraw: () => void;
};

export const WalletBalanceCard = ({
    balance,
    linkedCard,
    onDeposit,
    onWithdraw,
}: WalletBalanceCardProps) => {
    const { t } = useTranslation();

    return (
        <section className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
            <div className="rounded-3xl bg-slate-900 p-6 text-white shadow-sm sm:p-8">
                <div className="flex items-center gap-3 text-slate-300">
                    <Banknote size={24} />
                    <span className="font-bold">{t("wallet.currentBalance")}</span>
                </div>

                <p className="mt-5 text-4xl font-black sm:text-5xl">
                    {balance.toLocaleString("ru-RU")} {t("publication.price.currency")}
                </p>

                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                    <button
                        type="button"
                        onClick={onDeposit}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-green-500 px-5 py-3 font-bold text-white transition hover:bg-green-600"
                    >
                        <ArrowDownLeft size={20} />
                        {t("wallet.deposit")}
                    </button>

                    <button
                        type="button"
                        onClick={onWithdraw}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-500 px-5 py-3 font-bold text-white transition hover:bg-blue-600"
                    >
                        <ArrowUpRight size={20} />
                        {t("wallet.withdraw")}
                    </button>
                </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                <div className="flex items-center gap-3 text-slate-700">
                    <CreditCard className="text-blue-600" size={24} />
                    <span className="font-black">{t("wallet.linkedCard")}</span>
                </div>

                <p className="mt-5 rounded-2xl bg-slate-50 p-4 text-lg font-black text-slate-900">
                    {linkedCard || t("wallet.noLinkedCard")}
                </p>

                <p className="mt-3 text-sm leading-6 text-slate-500">
                    {t("wallet.linkedCardHint")}
                </p>
            </div>
        </section>
    );
};