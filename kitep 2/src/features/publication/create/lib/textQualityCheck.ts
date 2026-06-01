import type { CreatePublicationFormState } from "../model/types";

export type SpellcheckWarning = {
    unknownWords: string[];
    suggestions: Record<string, string[]>;
    fixedTitle: string;
    fixedDescription: string;
    hasCaseFix: boolean;
};

const suggestionMap: Record<string, string[]> = {
    отпр: ["отправить"],
    мпро: ["метро"],
    амприот: ["пример", "материал"],
};

const capitalizeSentences = (value: string) => {
    return value.replace(/(^\s*[а-яa-zё])|([.!?]\s+[а-яa-zё])/g, (match) =>
        match.toUpperCase(),
    );
};

const findSuspiciousWords = (text: string) => {
    const words = text
        .split(/\s+/)
        .map((word) => word.replace(/[.,!?;:()"«»]/g, "").trim())
        .filter(Boolean);

    return words.filter((word) => {
        const lower = word.toLowerCase();

        if (lower.length < 4) return false;

        return Boolean(suggestionMap[lower]);
    });
};

export const checkPublicationTextQuality = (
    form: CreatePublicationFormState,
): SpellcheckWarning | null => {
    const title = form.title.trim();
    const description = form.description.trim();

    const fixedTitle = capitalizeSentences(title);
    const fixedDescription = capitalizeSentences(description);

    const unknownWords = Array.from(
        new Set([
            ...findSuspiciousWords(title),
            ...findSuspiciousWords(description),
        ]),
    );

    const hasCaseFix =
        fixedTitle !== title || fixedDescription !== description;

    if (!unknownWords.length && !hasCaseFix) {
        return null;
    }

    const suggestions = unknownWords.reduce<Record<string, string[]>>(
        (result, word) => {
            result[word] = suggestionMap[word.toLowerCase()] || [];
            return result;
        },
        {},
    );

    return {
        unknownWords,
        suggestions,
        fixedTitle,
        fixedDescription,
        hasCaseFix,
    };
};