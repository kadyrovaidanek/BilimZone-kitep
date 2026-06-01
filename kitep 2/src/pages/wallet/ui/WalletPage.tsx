import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { useTranslation } from "react-i18next";

import { useAuth } from "@/entities/user/model/useAuth";
import {
    confirmWalletCode,
    createWalletCode,
    getBackendWalletBalance,
    getBackendWalletTransactions,
} from "@/shared/api/wallet";

import {
    addWalletTransaction,
    getLinkedCard,
    getWalletReceipts,
    getWalletUserId,
    setLinkedCard,
    setWalletBalance,
} from "../lib/walletStorage";
import {
    downloadAllReceiptsPdf,
    downloadReceiptPdf,
} from "../lib/walletPdf";
import type {
    WalletActionType,
    WalletBankConfirmation,
    WalletFormErrors,
    WalletFormState,
    WalletTransaction,
} from "../lib/walletTypes";

import { WalletAuthState } from "./components/WalletAuthState";
import { WalletHeader } from "./components/WalletHeader";
import { WalletBalanceCard } from "./components/WalletBalanceCard";
import { WalletActionModal } from "./components/WalletActionModal";
import { WalletTransactions } from "./components/WalletTransactions";
import { WalletReceipts } from "./components/WalletReceipts";

const initialForm: WalletFormState = {
    cardNumber: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
    amount: "",
    code: "",
};

const normalizeExpiryYear = (value: string) => {
    const year = Number(value);

    if (!Number.isFinite(year)) {
        return 0;
    }

    if (year > 0 && year < 100) {
        return 2000 + year;
    }

    return year;
};

const validateFirstStep = (
    form: WalletFormState,
    action: WalletActionType,
    balance: number,
): WalletFormErrors => {
    const errors: WalletFormErrors = {};

    const cardNumber = form.cardNumber.replace(/\D/g, "");
    const amount = Number(form.amount);
    const month = Number(form.expiryMonth);
    const year = normalizeExpiryYear(form.expiryYear);

    if (cardNumber.length !== 16) {
        errors.cardNumber = "wallet.errors.cardNumber";
    }

    if (!Number.isFinite(amount) || amount <= 0) {
        errors.amount = "wallet.errors.amount";
    }

    if (action === "withdraw" && amount > balance) {
        errors.amount = "wallet.errors.balance";
    }

    if (!Number.isFinite(month) || month < 1 || month > 12) {
        errors.expiryMonth = "wallet.errors.expiryMonth";
    }

    if (!Number.isFinite(year) || year < 2024) {
        errors.expiryYear = "wallet.errors.expiryYear";
    }

    if (!form.cvv || form.cvv.length < 3) {
        errors.cvv = "wallet.errors.cvv";
    }

    return errors;
};

const validateCodeStep = (form: WalletFormState): WalletFormErrors => {
    const errors: WalletFormErrors = {};

    if (!form.code || form.code.length !== 6) {
        errors.code = "wallet.errors.code";
    }

    return errors;
};

const mapBackendTransaction = (item: any): WalletTransaction => {
    return {
        id: String(item.id),
        type: item.type,
        title: item.title,
        amount: Number(item.amount || 0),
        date: item.created_at,
        status: "completed",
    };
};

export const WalletPage = () => {
    const { t } = useTranslation();
    const { user } = useAuth();

    const userId = getWalletUserId(user);

    const [balance, setBalance] = useState(0);
    const [linkedCard, setLinkedCardState] = useState("");
    const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
    const [receipts, setReceipts] = useState(
        userId ? getWalletReceipts(userId) : [],
    );

    const [action, setAction] = useState<WalletActionType | null>(null);
    const [form, setForm] = useState<WalletFormState>(initialForm);
    const [errors, setErrors] = useState<WalletFormErrors>({});
    const [processing, setProcessing] = useState(false);
    const [confirmation, setConfirmation] =
        useState<WalletBankConfirmation | null>(null);

    const refreshWallet = async () => {
        if (!userId) {
            setBalance(0);
            setTransactions([]);
            setReceipts([]);
            return;
        }

        try {
            const [balanceResponse, transactionsResponse] = await Promise.all([
                getBackendWalletBalance(userId),
                getBackendWalletTransactions(userId),
            ]);

            const backendBalance = Number(balanceResponse.data.balance || 0);
            const backendTransactions =
                transactionsResponse.data.map(mapBackendTransaction);

            setBalance(backendBalance);
            setTransactions(backendTransactions);

            // Чтобы боковое меню тоже видело актуальный баланс.
            setWalletBalance(userId, backendBalance);
        } catch (error) {
            console.log("BACKEND WALLET LOAD ERROR:", error);
            setBalance(0);
            setTransactions([]);
        }

        setLinkedCardState(getLinkedCard(userId));
        setReceipts(getWalletReceipts(userId));
    };

    useEffect(() => {
        refreshWallet();

        const handler = () => {
            refreshWallet();
        };

        window.addEventListener("focus", handler);
        window.addEventListener("storage", handler);
        window.addEventListener("bilimzone-wallet-balance-updated", handler);
        window.addEventListener("bilimzone-wallet-transactions-updated", handler);
        window.addEventListener("bilimzone-receipts-updated", handler);

        return () => {
            window.removeEventListener("focus", handler);
            window.removeEventListener("storage", handler);
            window.removeEventListener("bilimzone-wallet-balance-updated", handler);
            window.removeEventListener(
                "bilimzone-wallet-transactions-updated",
                handler,
            );
            window.removeEventListener("bilimzone-receipts-updated", handler);
        };
    }, [userId]);

    const openModal = (type: WalletActionType) => {
        setAction(type);
        setForm(initialForm);
        setErrors({});
        setConfirmation(null);
    };

    const closeModal = () => {
        setAction(null);
        setForm(initialForm);
        setErrors({});
        setConfirmation(null);
    };

    const updateField = <K extends keyof WalletFormState>(
        field: K,
        value: WalletFormState[K],
    ) => {
        setForm((prev) => ({
            ...prev,
            [field]: value,
        }));

        setErrors((prev) => {
            const next = { ...prev };
            delete next[field];
            return next;
        });
    };

    const resetConfirmation = () => {
        setConfirmation(null);
        setForm((prev) => ({
            ...prev,
            code: "",
        }));
        setErrors({});
    };

    const createBankCode = async () => {
        if (!userId || !action) {
            return;
        }

        const nextErrors = validateFirstStep(form, action, balance);
        setErrors(nextErrors);

        if (Object.keys(nextErrors).length > 0) {
            return;
        }

        const amount = Number(form.amount);

        try {
            setProcessing(true);

            const response = await createWalletCode({
                user_id: userId,
                action,
                card_number: form.cardNumber.replace(/\D/g, ""),
                expiry_month: Number(form.expiryMonth),
                expiry_year: normalizeExpiryYear(form.expiryYear),
                cvv: form.cvv,
                amount: String(amount),
            });

            setConfirmation({
                confirmationId: response.data.confirmation_id,
                externalReference: response.data.external_reference,
                amount: response.data.amount,
                currency: response.data.currency,
                maskedCard: response.data.masked_card,
            });

            setForm((prev) => ({
                ...prev,
                code: "",
            }));

            if (response.data.masked_card) {
                localStorage.setItem(
                    `linked_fake_bank_masked_card_${userId}`,
                    response.data.masked_card,
                );
                setLinkedCardState(response.data.masked_card);
            } else {
                const masked = setLinkedCard(userId, form.cardNumber);
                setLinkedCardState(masked);
            }

            alert(
                response.data.message ||
                t(
                    "wallet.bankCodeSent",
                    "Код подтверждения отправлен в личный кабинет банка.",
                ),
            );
        } catch (error: any) {
            console.log("WALLET CREATE CODE ERROR:", error?.response?.data || error);

            const data = error?.response?.data;

            alert(
                data?.error ||
                data?.detail ||
                data?.bank?.error ||
                data?.bank?.detail ||
                t("wallet.errors.operation"),
            );
        } finally {
            setProcessing(false);
        }
    };

    const confirmBankCode = async () => {
        if (!userId || !action || !confirmation) {
            return;
        }

        const nextErrors = validateCodeStep(form);
        setErrors(nextErrors);

        if (Object.keys(nextErrors).length > 0) {
            return;
        }

        const amount = Number(confirmation.amount || form.amount);

        try {
            setProcessing(true);

            const response = await confirmWalletCode({
                user_id: userId,
                action,
                amount: String(amount),
                confirmation_id: confirmation.confirmationId,
                external_reference: confirmation.externalReference,
                code: form.code,
            });

            const backendBalance = Number(response.data.wallet_balance || 0);

            setBalance(backendBalance);
            setWalletBalance(userId, backendBalance);

            addWalletTransaction(userId, {
                type: action,
                title:
                    action === "deposit"
                        ? t("wallet.depositTransaction")
                        : t("wallet.withdrawTransaction"),
                amount,
                status: "completed",
            });

            await refreshWallet();

            alert(
                response.data.message ||
                (action === "deposit"
                    ? t("wallet.depositSuccess")
                    : t("wallet.withdrawSuccess")),
            );

            closeModal();
        } catch (error: any) {
            console.log("WALLET CONFIRM CODE ERROR:", error?.response?.data || error);

            const data = error?.response?.data;

            alert(
                data?.error ||
                data?.detail ||
                data?.bank?.error ||
                data?.bank?.detail ||
                t("wallet.errors.operation"),
            );
        } finally {
            setProcessing(false);
        }
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (confirmation) {
            await confirmBankCode();
            return;
        }

        await createBankCode();
    };

    const sortedTransactions = useMemo(() => {
        return [...transactions].sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
        );
    }, [transactions]);

    if (!user) {
        return <WalletAuthState />;
    }

    return (
        <main className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl space-y-6">
                <WalletHeader />

                <WalletBalanceCard
                    balance={balance}
                    linkedCard={linkedCard}
                    onDeposit={() => openModal("deposit")}
                    onWithdraw={() => openModal("withdraw")}
                />

                <WalletReceipts
                    receipts={receipts}
                    onDownload={downloadReceiptPdf}
                    onDownloadAll={() => downloadAllReceiptsPdf(receipts)}
                />

                <WalletTransactions transactions={sortedTransactions} />
            </div>

            <WalletActionModal
                action={action}
                form={form}
                errors={errors}
                processing={processing}
                confirmation={confirmation}
                onChange={updateField}
                onClose={closeModal}
                onSubmit={handleSubmit}
                onResetConfirmation={resetConfirmation}
            />
        </main>
    );
};

export default WalletPage;