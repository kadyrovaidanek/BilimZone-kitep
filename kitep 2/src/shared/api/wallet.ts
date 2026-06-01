import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.2:8000";

export type WalletAction = "deposit" | "withdraw";

export type WalletCreateCodePayload = {
    user_id: number | string;
    action: WalletAction;
    card_number: string;
    expiry_month: number;
    expiry_year: number;
    cvv: string;
    amount: string;
};

export type WalletCreateCodeResponse = {
    message: string;
    code_required: boolean;
    action: WalletAction;
    amount: string;
    confirmation_id?: number;
    external_reference?: string;
    currency?: string;
    masked_card?: string;
    bank?: any;
};

export type WalletConfirmCodePayload = {
    user_id: number | string;
    action: WalletAction;
    amount: string;
    confirmation_id?: number;
    external_reference?: string;
    code: string;
};

export type WalletConfirmCodeResponse = {
    message: string;
    action: WalletAction;
    amount: string;
    wallet_balance: string;
    bank?: any;
};

export type WalletBalanceResponse = {
    user_id: number;
    username: string;
    balance: string;
};

export type WalletTransactionResponse = {
    id: number;
    type: string;
    title: string;
    description?: string;
    amount: string;
    balance_after: string;
    created_at: string;
};

export const createWalletCode = (payload: WalletCreateCodePayload) => {
    return axios.post<WalletCreateCodeResponse>(
        `${API_BASE_URL}/api/wallet/create-code/`,
        payload,
    );
};

export const confirmWalletCode = (payload: WalletConfirmCodePayload) => {
    return axios.post<WalletConfirmCodeResponse>(
        `${API_BASE_URL}/api/wallet/confirm-code/`,
        payload,
    );
};

export const getBackendWalletBalance = (userId: number | string) => {
    return axios.get<WalletBalanceResponse>(
        `${API_BASE_URL}/api/wallet/${userId}/`,
    );
};

export const getBackendWalletTransactions = (userId: number | string) => {
    return axios.get<WalletTransactionResponse[]>(
        `${API_BASE_URL}/api/wallet/${userId}/transactions/`,
    );
};