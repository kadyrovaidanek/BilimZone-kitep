import type {
    WalletReceipt,
    WalletTransaction,
    WalletUserLike,
} from "./walletTypes";

const WALLET_BALANCE_KEY_PREFIX = "bilimzone_wallet_balance";
const TRANSACTIONS_KEY_PREFIX = "bilimzone_wallet_transactions";
const RECEIPTS_KEY_PREFIX = "bilimzone_purchase_receipts";
const LINKED_CARD_KEY_PREFIX = "linked_fake_bank_masked_card";

export const WALLET_EVENT_NAME = "bilimzone-wallet-balance-updated";
export const TRANSACTIONS_EVENT_NAME =
    "bilimzone-wallet-transactions-updated";
export const RECEIPTS_EVENT_NAME = "bilimzone-receipts-updated";

const makeId = () => {
    if (typeof crypto !== "undefined" && crypto.randomUUID) {
        return crypto.randomUUID();
    }

    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

export const getWalletUserId = (user: WalletUserLike | null | undefined) => {
    const id = user?.id || user?.user_id || user?.pk || user?.email;
    return id ? String(id) : "";
};

const safeParse = <T,>(key: string, fallback: T): T => {
    try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : fallback;
    } catch {
        return fallback;
    }
};

export const getBalanceKey = (userId: string) =>
    `${WALLET_BALANCE_KEY_PREFIX}_${userId}`;

export const getTransactionsKey = (userId: string) =>
    `${TRANSACTIONS_KEY_PREFIX}_${userId}`;

export const getReceiptsKey = (userId: string) =>
    `${RECEIPTS_KEY_PREFIX}_${userId}`;

export const getLinkedCardKey = (userId: string) =>
    `${LINKED_CARD_KEY_PREFIX}_${userId}`;

export const getWalletBalance = (userId: string) => {
    return Number(localStorage.getItem(getBalanceKey(userId)) || 0);
};

export const setWalletBalance = (userId: string, balance: number) => {
    localStorage.setItem(getBalanceKey(userId), String(balance));

    window.dispatchEvent(
        new CustomEvent(WALLET_EVENT_NAME, {
            detail: {
                userId,
                balance,
            },
        }),
    );
};

export const getWalletTransactions = (userId: string) => {
    return safeParse<WalletTransaction[]>(getTransactionsKey(userId), []);
};

export const addWalletTransaction = (
    userId: string,
    transaction: Omit<WalletTransaction, "id" | "date"> & {
        date?: string;
        id?: string;
    },
) => {
    const current = getWalletTransactions(userId);

    const next: WalletTransaction = {
        id: transaction.id || makeId(),
        date: transaction.date || new Date().toISOString(),
        type: transaction.type,
        title: transaction.title,
        amount: transaction.amount,
        status: transaction.status,
        receiptNumber: transaction.receiptNumber,
    };

    localStorage.setItem(
        getTransactionsKey(userId),
        JSON.stringify([next, ...current]),
    );

    window.dispatchEvent(new CustomEvent(TRANSACTIONS_EVENT_NAME));

    return next;
};

export const getWalletReceipts = (userId: string) => {
    return safeParse<WalletReceipt[]>(getReceiptsKey(userId), []);
};

export const addWalletReceipt = (userId: string, receipt: WalletReceipt) => {
    const current = getWalletReceipts(userId);

    const normalized: WalletReceipt = {
        ...receipt,
        id: receipt.id || makeId(),
        saved_at: receipt.saved_at || new Date().toISOString(),
        type: "purchase",
    };

    const exists = current.some(
        (item) => item.receipt_number === normalized.receipt_number,
    );

    if (exists) {
        return normalized;
    }

    localStorage.setItem(
        getReceiptsKey(userId),
        JSON.stringify([normalized, ...current]),
    );

    window.dispatchEvent(new CustomEvent(RECEIPTS_EVENT_NAME));

    return normalized;
};

export const getLinkedCard = (userId: string) => {
    return localStorage.getItem(getLinkedCardKey(userId)) || "";
};

export const setLinkedCard = (userId: string, cardNumber: string) => {
    const clean = cardNumber.replace(/\s/g, "");
    const masked = clean.length >= 4 ? `**** **** **** ${clean.slice(-4)}` : "";

    if (masked) {
        localStorage.setItem(getLinkedCardKey(userId), masked);
    }

    return masked;
};

export const clearWalletData = (userId: string) => {
    localStorage.removeItem(getBalanceKey(userId));
    localStorage.removeItem(getTransactionsKey(userId));
    localStorage.removeItem(getReceiptsKey(userId));
    localStorage.removeItem(getLinkedCardKey(userId));
};