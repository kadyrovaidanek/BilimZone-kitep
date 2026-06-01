import type { ReactNode } from "react";
import { AlertTriangle, CreditCard, Wallet, X } from "lucide-react";
import { useTranslation } from "react-i18next";

import type { PurchaseErrorResponse } from "@/shared/api/purchases";

type InsufficientBalanceModalProps = {
    open: boolean;
    data: PurchaseErrorResponse | null;
    onClose: () => void;
    onGoWallet: () => void;
};

export const InsufficientBalanceModal = ({
    open,
    data,
    onClose,
    onGoWallet,
}: InsufficientBalanceModalProps) => {
    const { t } = useTranslation();

    if (!open) {
        return null;
    }

    const requiredAmount = data?.required_amount;
    const currentBalance = data?.current_balance;
    const missingAmount = data?.missing_amount;

    return (
        <div className="fixed inset-0 z-[100] flex items-end bg-slate-950/60 p-3 backdrop-blur-sm sm:items-center sm:justify-center">
            <div className="w-full max-w-lg rounded-t-3xl bg-white p-5 shadow-2xl sm:rounded-3xl sm:p-7">
                <div className="mb-5 flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-100 text-red-600">
                            <AlertTriangle size={24} />
                        </div>

                        <div>
                            <h2 className="text-xl font-black text-slate-900 sm:text-2xl">
                                {t("purchase.insufficientBalance.title")}
                            </h2>

                            <p className="mt-1 text-sm leading-6 text-slate-500">
                                {data?.detail || t("purchase.insufficientBalance.subtitle")}
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-2xl bg-slate-100 p-2 text-slate-500 transition hover:bg-slate-200"
                        aria-label={t("common.close")}
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                    <InfoCard
                        icon={<CreditCard size={18} />}
                        label={t("purchase.insufficientBalance.required")}
                        value={requiredAmount ? `${requiredAmount} KGS` : "—"}
                    />

                    <InfoCard
                        icon={<Wallet size={18} />}
                        label={t("purchase.insufficientBalance.current")}
                        value={currentBalance ? `${currentBalance} KGS` : "—"}
                    />

                    <InfoCard
                        icon={<AlertTriangle size={18} />}
                        label={t("purchase.insufficientBalance.missing")}
                        value={missingAmount ? `${missingAmount} KGS` : "—"}
                    />
                </div>

                <div className="mt-5 rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm leading-6 text-blue-800">
                    {t("purchase.insufficientBalance.hint")}
                </div>

                <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                    >
                        {t("common.cancel")}
                    </button>

                    <button
                        type="button"
                        onClick={onGoWallet}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
                    >
                        <Wallet size={18} />
                        {t("purchase.insufficientBalance.goWallet")}
                    </button>
                </div>
            </div>
        </div>
    );
};

function InfoCard({
    icon,
    label,
    value,
}: {
    icon: ReactNode;
    label: string;
    value: string;
}) {
    return (
        <div className="rounded-2xl bg-slate-100 p-4">
            <div className="mb-2 flex items-center gap-2 text-slate-500">
                {icon}
                <span className="text-xs font-bold uppercase">{label}</span>
            </div>

            <p className="text-lg font-black text-slate-900">{value}</p>
        </div>
    );
}