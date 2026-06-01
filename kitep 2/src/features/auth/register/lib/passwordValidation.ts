export type PasswordStrengthLevel = "empty" | "weak" | "medium" | "strong";

export type PasswordStrengthResult = {
    level: PasswordStrengthLevel;
    hasMinLength: boolean;
    hasLetter: boolean;
    hasPunctuation: boolean;
};

const PASSWORD_HAS_LETTER_REGEX = /[A-Za-zА-Яа-яЁё]/;
const PASSWORD_HAS_PUNCTUATION_REGEX = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?.,]/;

export const getPasswordStrength = (
    password: string,
): PasswordStrengthResult => {
    const value = password.trim();

    const hasMinLength = value.length >= 8;
    const hasLetter = PASSWORD_HAS_LETTER_REGEX.test(value);
    const hasPunctuation = PASSWORD_HAS_PUNCTUATION_REGEX.test(value);

    if (!value) {
        return {
            level: "empty",
            hasMinLength: false,
            hasLetter: false,
            hasPunctuation: false,
        };
    }

    // 12345678 -> слабый, потому что нет буквы
    // abc -> слабый, потому что меньше 8 символов
    if (!hasMinLength || !hasLetter) {
        return {
            level: "weak",
            hasMinLength,
            hasLetter,
            hasPunctuation,
        };
    }

    // !122345в -> надёжный, потому что есть 8 символов, буква и знак
    if (hasPunctuation) {
        return {
            level: "strong",
            hasMinLength,
            hasLetter,
            hasPunctuation,
        };
    }

    // 12a34f78 -> средний, потому что есть 8 символов и буква, но нет знака
    return {
        level: "medium",
        hasMinLength,
        hasLetter,
        hasPunctuation,
    };
};