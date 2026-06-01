const WALLET_BALANCE_KEY_PREFIX = "bilimzone_wallet_balance";

type Language = "ru" | "kg";

export const getLocalWalletBalance = (userId: string) => {
    if (!userId) return 0;

    const raw = localStorage.getItem(`${WALLET_BALANCE_KEY_PREFIX}_${userId}`);
    const value = Number(raw || 0);

    if (!Number.isFinite(value)) {
        return 0;
    }

    return value;
};

export const buildLocalInsufficientBalanceData = ({
    price,
    balance,
    language = "ru",
}: {
    price: number;
    balance: number;
    language?: Language;
}) => {
    const missing = Math.max(price - balance, 0);

    const texts = {
        ru: {
            error: "Недостаточно средств для покупки.",
            message: "Недостаточно средств для покупки.",
            detail:
                "На вашем кошельке недостаточно средств. Пополните кошелёк и повторите покупку.",
        },
        kg: {
            error: "Сатып алуу үчүн каражат жетишсиз.",
            message: "Сатып алуу үчүн каражат жетишсиз.",
            detail:
                "Капчыгыңызда каражат жетишсиз. Капчыкты толуктап, сатып алууну кайра аракет кылыңыз.",
        },
    };

    const currentTexts = texts[language];

    return {
        success: false as const,
        code: "insufficient_balance" as const,
        error: currentTexts.error,
        message: currentTexts.message,
        detail: currentTexts.detail,
        required_amount: price.toFixed(2),
        current_balance: balance.toFixed(2),
        missing_amount: missing.toFixed(2),
        redirect_url: "/wallet",
    };
};