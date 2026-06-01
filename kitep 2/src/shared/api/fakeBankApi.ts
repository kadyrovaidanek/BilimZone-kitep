const BANK_API_URL =
    import.meta.env.VITE_BANK_API_URL || "http://127.0.0.1:8010/api";

export interface FakeBankCard {
    id: number;
    card_number: string;
    masked_number: string;
    card_holder: string;
    expiry_month: number;
    expiry_year: number;
    cvv: string;
    is_active: boolean;
    created_at: string;
}

export interface FakeBankAccount {
    id: number;
    account_number: string;
    currency: "KGS";
    balance: string;
    is_active: boolean;
    created_at: string;
    card: FakeBankCard;
}

export interface FakeBankCustomer {
    id: number;
    full_name: string;
    phone: string;
    email: string | null;
    external_bilimzone_user_id: string;
    is_active: boolean;
    created_at: string;
    accounts: FakeBankAccount[];
}

export interface FakeBankSyncUserPayload {
    bilimzone_user_id: string;
    username?: string;
    email?: string;
    role?: string;
}

export interface FakeBankSyncUserResponse {
    created: boolean;
    customer: FakeBankCustomer;
}

export interface FakeBankCardVerifyPayload {
    card_number: string;
    expiry_month: number;
    expiry_year: number;
    cvv: string;
}

export interface FakeBankCardVerifyResponse {
    success: boolean;
    message: string;
    demo_code: string;
    card: {
        card_number: string;
        masked_number: string;
        card_holder: string;
    };
}

export interface FakeBankCardConfirmPayload {
    card_number: string;
    code: string;
}

export interface FakeBankCardConfirmResponse {
    success: boolean;
    message: string;
    account: FakeBankAccount;
}

export interface FakeBankTopUpPayload {
    card_number: string;
    amount: string;
    bilimzone_user_id: string;
    description?: string;
}

export interface FakeBankCashInPayload {
    card_number: string;
    amount: string;
    description?: string;
}

export interface FakeBankOperationResponse {
    success?: boolean;
    message?: string;
    bilimzone_user_id?: string;
    amount?: string;
    currency?: "KGS";
    external_reference?: string;
    account?: FakeBankAccount;
    transaction: {
        id: number;
        transaction_id: string;
        transaction_type: string;
        status: string;
        amount: string;
        currency: "KGS";
        description: string;
        external_service: string;
        external_user_id: string;
        external_reference: string;
        created_at: string;
    };
}

async function request<T>(endpoint: string, options: RequestInit): Promise<T> {
    const response = await fetch(`${BANK_API_URL}${endpoint}`, {
        headers: {
            "Content-Type": "application/json",
            ...(options.headers || {}),
        },
        ...options,
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
        throw new Error(data?.detail || "Ошибка Fake Bank");
    }

    return data as T;
}

export const fakeBankApi = {
    syncBilimZoneUser(payload: FakeBankSyncUserPayload) {
        return request<FakeBankSyncUserResponse>("/bank/bilimzone/sync-user/", {
            method: "POST",
            body: JSON.stringify(payload),
        });
    },

    verifyCard(payload: FakeBankCardVerifyPayload) {
        return request<FakeBankCardVerifyResponse>("/bank/card/verify/", {
            method: "POST",
            body: JSON.stringify(payload),
        });
    },

    confirmCard(payload: FakeBankCardConfirmPayload) {
        return request<FakeBankCardConfirmResponse>("/bank/card/confirm/", {
            method: "POST",
            body: JSON.stringify(payload),
        });
    },

    topUpBilimZone(payload: FakeBankTopUpPayload) {
        return request<FakeBankOperationResponse>("/bank/bilimzone/top-up/", {
            method: "POST",
            body: JSON.stringify(payload),
        });
    },

    cashInToBankCard(payload: FakeBankCashInPayload) {
        return request<FakeBankOperationResponse>("/bank/cash-in/", {
            method: "POST",
            body: JSON.stringify(payload),
        });
    },
};