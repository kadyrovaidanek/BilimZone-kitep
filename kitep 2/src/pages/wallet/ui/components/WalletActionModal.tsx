import type { FormEvent, ReactNode } from "react";
import {
    Building2,
    CheckCircle2,
    ExternalLink,
    KeyRound,
    LockKeyhole,
    ShieldCheck,
    X,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import type {
    WalletActionType,
    WalletBankConfirmation,
    WalletFormErrors,
    WalletFormState,
} from "../../lib/walletTypes";

type WalletActionModalProps = {
    action: WalletActionType | null;
    form: WalletFormState;
    errors: WalletFormErrors;
    processing: boolean;
    confirmation: WalletBankConfirmation | null;
    onChange: <K extends keyof WalletFormState>(
        field: K,
        value: WalletFormState[K],
    ) => void;
    onClose: () => void;
    onSubmit: (event: FormEvent<HTMLFormElement>) => void;
    onResetConfirmation: () => void;
};

export const WalletActionModal = ({
    action,
    form,
    errors,
    processing,
    confirmation,
    onChange,
    onClose,
    onSubmit,
    onResetConfirmation,
}: WalletActionModalProps) => {
    const { t } = useTranslation();

    if (!action) {
        return null;
    }

    const isDeposit = action === "deposit";
    const isCodeStep = Boolean(confirmation);

    return (
        <div className="fixed inset-0 z-50 flex items-end bg-slate-950/50 p-3 sm:items-center sm:justify-center">
            <form
                onSubmit={onSubmit}
                className="max-h-[92vh] w-full overflow-y-auto rounded-3xl bg-white p-5 shadow-xl sm:max-w-xl sm:p-7"
            >
                <div className="mb-5 flex items-start justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-black text-slate-900">
                            {isDeposit
                                ? t("wallet.depositTitle")
                                : t("wallet.withdrawTitle")}
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            {isCodeStep
                                ? t(
                                    "wallet.bankCodeSubtitle",
                                    "Код отправлен в личный кабинет Fake Bank.",
                                )
                                : isDeposit
                                    ? t("wallet.depositSubtitle")
                                    : t("wallet.withdrawSubtitle")}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-2xl bg-slate-100 p-2 text-slate-500 hover:bg-slate-200"
                    >
                        <X size={20} />
                    </button>
                </div>

                {!isCodeStep ? (
                    <>
                        <div className="mb-5 rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-700">
                            <div className="flex items-center gap-2 font-bold">
                                <ShieldCheck size={18} />
                                {t("wallet.bankCheckTitle", "Проверка через Fake Bank")}
                            </div>

                            <p className="mt-1 leading-6">
                                {t(
                                    "wallet.bankCheckText",
                                    "Введите данные карты Fake Bank. Система проверит номер карты, срок действия и CVV, затем отправит код подтверждения в кабинет банка.",
                                )}
                            </p>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <Field label={t("wallet.cardNumber")} error={errors.cardNumber}>
                                <input
                                    value={form.cardNumber}
                                    onChange={(e) =>
                                        onChange(
                                            "cardNumber",
                                            e.target.value.replace(/\D/g, "").slice(0, 16),
                                        )
                                    }
                                    placeholder="9964000000000001"
                                    inputMode="numeric"
                                    className="wallet-input"
                                />
                            </Field>

                            <Field label={t("wallet.amount")} error={errors.amount}>
                                <input
                                    value={form.amount}
                                    onChange={(e) =>
                                        onChange(
                                            "amount",
                                            e.target.value.replace(/[^\d.]/g, ""),
                                        )
                                    }
                                    placeholder="1000"
                                    inputMode="decimal"
                                    className="wallet-input"
                                />
                            </Field>

                            <Field
                                label={t("wallet.expiryMonth")}
                                error={errors.expiryMonth}
                            >
                                <input
                                    value={form.expiryMonth}
                                    onChange={(e) =>
                                        onChange(
                                            "expiryMonth",
                                            e.target.value.replace(/\D/g, "").slice(0, 2),
                                        )
                                    }
                                    placeholder="12"
                                    inputMode="numeric"
                                    maxLength={2}
                                    className="wallet-input"
                                />
                            </Field>

                            <Field
                                label={t("wallet.expiryYear")}
                                error={errors.expiryYear}
                            >
                                <input
                                    value={form.expiryYear}
                                    onChange={(e) =>
                                        onChange(
                                            "expiryYear",
                                            e.target.value.replace(/\D/g, "").slice(0, 4),
                                        )
                                    }
                                    placeholder="2030"
                                    inputMode="numeric"
                                    maxLength={4}
                                    className="wallet-input"
                                />
                            </Field>

                            <Field label={t("wallet.cvv")} error={errors.cvv}>
                                <input
                                    value={form.cvv}
                                    onChange={(e) =>
                                        onChange(
                                            "cvv",
                                            e.target.value.replace(/\D/g, "").slice(0, 4),
                                        )
                                    }
                                    placeholder="123"
                                    inputMode="numeric"
                                    maxLength={4}
                                    className="wallet-input"
                                />
                            </Field>
                        </div>
                    </>
                ) : (
                    <div className="grid gap-4">
                        <div className="rounded-3xl border border-blue-100 bg-blue-50 p-4">
                            <div className="flex items-start gap-3">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white">
                                    <KeyRound size={22} />
                                </div>

                                <div className="min-w-0 flex-1">
                                    <h3 className="text-base font-black text-blue-950">
                                        {t(
                                            "wallet.bankCodeTitle",
                                            "Введите код из Fake Bank",
                                        )}
                                    </h3>

                                    <p className="mt-2 text-sm leading-6 text-blue-800">
                                        {t(
                                            "wallet.bankCodeText",
                                            "Откройте кабинет банка, найдите код подтверждения и введите его здесь.",
                                        )}
                                    </p>

                                    <div className="mt-3 flex flex-wrap gap-2 text-sm font-bold">
                                        <span className="rounded-2xl bg-white px-3 py-2 text-blue-900">
                                            {t("wallet.amount")}: {confirmation?.amount}{" "}
                                            {confirmation?.currency || "KGS"}
                                        </span>

                                        {confirmation?.maskedCard && (
                                            <span className="rounded-2xl bg-white px-3 py-2 text-blue-900">
                                                {confirmation.maskedCard}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <a
                                href="http://localhost:5273"
                                target="_blank"
                                rel="noreferrer"
                                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-bold text-blue-700 transition hover:bg-blue-100 sm:w-auto"
                            >
                                <Building2 size={18} />
                                {t("wallet.openFakeBank", "Открыть Fake Bank")}
                                <ExternalLink size={16} />
                            </a>
                        </div>

                        <Field label={t("wallet.code")} error={errors.code}>
                            <input
                                value={form.code}
                                onChange={(e) =>
                                    onChange(
                                        "code",
                                        e.target.value.replace(/\D/g, "").slice(0, 6),
                                    )
                                }
                                placeholder="000000"
                                inputMode="numeric"
                                maxLength={6}
                                className="wallet-input text-center text-lg font-black tracking-[0.35em]"
                            />
                        </Field>

                        <button
                            type="button"
                            onClick={onResetConfirmation}
                            className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50"
                        >
                            {t("wallet.changeCard", "Изменить карту или сумму")}
                        </button>
                    </div>
                )}

                <button
                    type="submit"
                    disabled={processing}
                    className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 font-bold text-white hover:bg-slate-800 disabled:bg-slate-400"
                >
                    {isCodeStep ? <CheckCircle2 size={18} /> : <LockKeyhole size={18} />}

                    {processing
                        ? t("wallet.processing")
                        : isCodeStep
                            ? t("wallet.confirmBankCode", "Подтвердить код")
                            : isDeposit
                                ? t("wallet.confirmDeposit")
                                : t("wallet.confirmWithdraw")}
                </button>
            </form>
        </div>
    );
};

function Field({
    label,
    error,
    children,
}: {
    label: string;
    error?: string;
    children: ReactNode;
}) {
    const { t } = useTranslation();

    return (
        <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">
                {label}
            </span>

            {children}

            {error && <p className="mt-2 text-sm text-red-500">{t(error)}</p>}
        </label>
    );
}