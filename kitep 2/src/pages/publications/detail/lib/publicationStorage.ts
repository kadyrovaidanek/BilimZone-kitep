import type { Publication } from "@/shared/api/publications";

export type PublicationCartItem = {
    id: number;
    title: string;
    author: string;
    description?: string;
    priceType: "free" | "paid";
    price: number;
    image?: string;
    fileUrl?: string;
};

const CART_KEY_PREFIX = "bilimzone_cart";
const FAVORITES_KEY_PREFIX = "bilimzone_favorites";
const WALLET_BALANCE_KEY_PREFIX = "bilimzone_wallet_balance";
const WALLET_EVENT_NAME = "bilimzone-wallet-balance-updated";

export const getUserId = (user: any) => {
    return String(user?.id || user?.user_id || user?.pk || user?.email || "");
};

export const getCartKey = (userId: string) => `${CART_KEY_PREFIX}_${userId}`;

export const getFavoritesKey = (userId: string) =>
    `${FAVORITES_KEY_PREFIX}_${userId}`;

export const getWalletBalanceKey = (userId: string) =>
    `${WALLET_BALANCE_KEY_PREFIX}_${userId}`;

export const readArray = <T,>(key: string): T[] => {
    try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
};

export const writeArray = <T,>(key: string, items: T[]) => {
    localStorage.setItem(key, JSON.stringify(items));
};

export const updateLocalWalletBalance = (
    userId: string,
    balance?: string | number,
) => {
    if (balance === undefined || balance === null || balance === "") {
        return;
    }

    localStorage.setItem(getWalletBalanceKey(userId), String(Number(balance)));

    window.dispatchEvent(
        new CustomEvent(WALLET_EVENT_NAME, {
            detail: {
                userId,
                balance: Number(balance),
            },
        }),
    );
};

export const toPublicationCartItem = (
    publication: Publication,
): PublicationCartItem => {
    return {
        id: publication.id,
        title: publication.title,
        author: publication.author_username || "Автор",
        description: publication.description || "",
        priceType: publication.price_type,
        price: Number(publication.price || 0),
        image: publication.cover_url || "",
        fileUrl: publication.file_url || "",
    };
};