import { Send } from "lucide-react";
import { useTranslation } from "react-i18next";

type CreatePublicationSubmitBarProps = {
    isSubmitting: boolean;
};

export const CreatePublicationSubmitBar = ({
    isSubmitting,
}: CreatePublicationSubmitBarProps) => {
    const { t } = useTranslation();

    return (
        <section className="sticky bottom-4 z-10 rounded-3xl border border-slate-200 bg-white/95 p-4 shadow-xl backdrop-blur sm:p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm font-semibold text-slate-500">
                    {t(
                        "publicationCreate.submit.hint",
                        "Перед отправкой система проверит текст и сравнит файл с уже опубликованными материалами.",
                    )}
                </p>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-6 py-3 text-sm font-black text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300 sm:w-auto"
                >
                    <Send className="h-5 w-5" />

                    {isSubmitting
                        ? t("publicationCreate.submit.saving", "Отправка...")
                        : t(
                            "publicationCreate.submit.button",
                            "Отправить на проверку",
                        )}
                </button>
            </div>
        </section>
    );
};