import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://bilimzone-backend1.onrender.com";

export type PublicationPurchase = {
    id: number;
    buyer: number;
    publication: number;

    publication_title: string;
    publication_description?: string | null;
    publication_price: string;
    publication_price_type: "free" | "paid";
    publication_type: string;

    publication_file_url?: string | null;
    publication_preview_file_url?: string | null;
    publication_pdf_file_url?: string | null;
    publication_cover_url?: string | null;

    author_user: number;
    author_username?: string;

    category_name_ru?: string | null;
    category_name_kg?: string | null;

    direction_name_ru?: string | null;
    direction_name_kg?: string | null;

    option_value?: string | null;

    amount: string;
    owner_amount: string;
    system_amount: string;
    created_at: string;
};

export type PurchasePublicationPayload = {
    user_id: number | string;
};

export type PurchaseErrorCode =
    | "insufficient_balance"
    | "insufficient_funds"
    | "bank_unavailable"
    | "bank_code_create_failed"
    | "bank_code_confirm_failed"
    | "code_not_required";

export type PurchaseErrorResponse = {
    success?: false;
    code?: PurchaseErrorCode;
    error?: string;
    message?: string;
    detail?: string;

    required_amount?: string;
    current_balance?: string;
    missing_amount?: string;
    redirect_url?: string;

    bank?: any;
};

export type PurchaseWalletInfo = {
    buyer_balance?: string;
    owner_balance?: string;
    system_balance?: string;
    system_admin_id?: number;
};

export type PurchaseStartResponse = {
    message: string;
    already_purchased: boolean;
    code_required?: boolean;

    confirmation_id?: number;
    external_reference?: string;

    amount?: string;
    owner_amount?: string;
    system_amount?: string;
    currency?: string;

    receipt?: any;
    purchase?: PublicationPurchase;
    bank?: any;

    payment_source?: string;
    wallet?: PurchaseWalletInfo;
};

export type ConfirmPurchasePayload = {
    user_id: number | string;
    confirmation_id?: number;
    external_reference?: string;
    code: string;
};

export type ConfirmPurchaseResponse = {
    message: string;
    already_purchased: boolean;
    code_required?: boolean;

    amount?: string;
    owner_amount?: string;
    system_amount?: string;

    receipt?: any;
    purchase?: PublicationPurchase;
    bank?: any;
};

export const purchasePublication = (
    publicationId: number | string,
    payload: PurchasePublicationPayload,
) => {
    return axios.post<PurchaseStartResponse>(
        `${API_BASE_URL}/api/publications/${publicationId}/purchase/`,
        payload,
    );
};

export const confirmPurchasePublication = (
    publicationId: number | string,
    payload: ConfirmPurchasePayload,
) => {
    return axios.post<ConfirmPurchaseResponse>(
        `${API_BASE_URL}/api/publications/${publicationId}/purchase/confirm/`,
        payload,
    );
};

export const getUserPurchases = (userId: number | string) => {
    return axios.get<PublicationPurchase[]>(
        `${API_BASE_URL}/api/users/${userId}/purchases/`,
    );
};

export const isInsufficientBalanceError = (error: unknown) => {
    const axiosError = error as any;

    const status = axiosError?.response?.status;
    const data = axiosError?.response?.data as PurchaseErrorResponse | undefined;

    const text = String(
        data?.error ||
        data?.message ||
        data?.detail ||
        axiosError?.message ||
        "",
    ).toLowerCase();

    return (
        status === 402 ||
        data?.code === "insufficient_balance" ||
        data?.code === "insufficient_funds" ||
        text.includes("недостаточно") ||
        text.includes("insufficient") ||
        text.includes("balance") ||
        text.includes("баланс")
    );
};