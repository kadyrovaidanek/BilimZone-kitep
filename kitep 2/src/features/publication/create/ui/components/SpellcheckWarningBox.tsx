import { Wand2 } from "lucide-react";
import { useTranslation } from "react-i18next";

import type { SpellcheckWarning } from "../../lib/textQualityCheck";

type Props = {
    warning: SpellcheckWarning;
    isSubmitting: boolean;
    onFix: () => void;
    onKeep: () => void;
};

export const SpellcheckWarningBox = ({
    warning,
    isSubmitting,
    onFix,
    onKeep,
}: Props) => {
    const { t } = useTranslation();

    const words = warning.unknownWords.join(", ");

    const suggestions = warning.unknownWords
        .flatMap((word) => warning.suggestions[word] || [])
        .join(", ");

    return (
        <div className="mb-5 rounded-3xl border border-blue-200 bg-blue-50 p-4 text-blue-900 sm:p-5">
            <div className="flex items-start gap-3">
                <Wand2 className="mt-1 h-6 w-6 shrink-0" />

                <div className="min-w-0 flex-1">
                    <h3 className="text-lg font-black">
                        {t("publicationCreate.spellcheck.title")}
                    </h3>

                    {warning.unknownWords.length > 0 && (
                        <p className="mt-2 text-sm font-semibold leading-6">
                            {t("publicationCreate.spellcheck.unknownWords", {
                                words,
                            })}
                        </p>
                    )}

                    {suggestions && (
                        <p className="mt-2 text-sm font-semibold leading-6">
                            {t("publicationCreate.spellcheck.suggestions", {
                                suggestions,
                            })}
                        </p>
                    )}

                    {warning.hasCaseFix && (
                        <p className="mt-2 text-sm font-semibold leading-6">
                            {t("publicationCreate.spellcheck.caseFix")}
                        </p>
                    )}

                    <p className="mt-3 text-sm font-bold">
                        {t("publicationCreate.spellcheck.question")}
                    </p>

                    <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                        <button
                            type="button"
                            onClick={onFix}
                            className="rounded-2xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
                        >
                            {t("publicationCreate.spellcheck.fix")}
                        </button>

                        <button
                            type="button"
                            onClick={onKeep}
                            disabled={isSubmitting}
                            className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800 disabled:bg-slate-300"
                        >
                            {isSubmitting
                                ? t("publicationCreate.submit.saving")
                                : t("publicationCreate.spellcheck.keep")}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};