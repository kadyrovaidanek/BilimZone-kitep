export type WalletActionType = "deposit" | "withdraw";

export type WalletTransactionStatus = "pending" | "completed" | "failed";

export type WalletTransactionType = "deposit" | "withdraw" | "purchase";

export type WalletTransaction = {
    id: string;
    type: WalletTransactionType;
    title: string;
    amount: number;
    date: string;
    status: WalletTransactionStatus;
    receiptNumber?: string;
};

export type WalletReceipt = {
    id?: string;
    receipt_number: string;
    date: string;
    buyer: string;
    owner: string;
    publication_id?: number;
    publication_title?: string;
    amount: string;
    owner_amount: string;
    system_amount: string;
    commission_percent: string;
    currency: string;
    status: string;
    saved_at?: string;
    type?: "purchase";
};

export type WalletFormState = {
    cardNumber: string;
    expiryMonth: string;
    expiryYear: string;
    cvv: string;
    amount: string;
    code: string;
};

export type WalletUserLike = {
    id?: number | string;
    user_id?: number | string;
    pk?: number | string;
    username?: string;
    email?: string;
    role?: string;
};

export type WalletFormErrors = Partial<Record<keyof WalletFormState, string>>;

export type WalletBankConfirmation = {
    confirmationId?: number;
    externalReference?: string;
    amount: string;
    currency?: string;
    maskedCard?: string;
};