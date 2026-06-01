export type CartItem = {
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
const WALLET_BALANCE_KEY_PREFIX = "bilimzone_wallet_balance";
const WALLET_EVENT_NAME = "bilimzone-wallet-balance-updated";

export const getCartKey = (userId: number | string) => {
    return `${CART_KEY_PREFIX}_${userId}`;
};

export const getWalletBalanceKey = (userId: number | string) => {
    return `${WALLET_BALANCE_KEY_PREFIX}_${userId}`;
};

export const readCart = (userId: number | string): CartItem[] => {
    try {
        const raw = localStorage.getItem(getCartKey(userId));
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
};

export const writeCart = (userId: number | string, items: CartItem[]) => {
    localStorage.setItem(getCartKey(userId), JSON.stringify(items));
};

export const updateLocalWalletBalance = (
    userId: number | string,
    balance?: string | number,
) => {
    if (balance === undefined || balance === null || balance === "") {
        return;
    }

    localStorage.setItem(getWalletBalanceKey(userId), String(Number(balance)));

    window.dispatchEvent(
        new CustomEvent(WALLET_EVENT_NAME, {
            detail: {
                userId: String(userId),
                balance: Number(balance),
            },
        }),
    );
};