import { Loader2, Send } from "lucide-react";
import { useTranslation } from "react-i18next";

import { RatingStars } from "./RatingStars";

type ReviewFormProps = {
    rating: number;
    text: string;
    isSubmitting: boolean;
    onRatingChange: (value: number) => void;
    onTextChange: (value: string) => void;
    onSubmit: () => void;
};

export const ReviewForm = ({
    rating,
    text,
    isSubmitting,
    onRatingChange,
    onTextChange,
    onSubmit,
}: ReviewFormProps) => {
    const { t } = useTranslation();

    return (
        <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <h3 className="text-lg font-black text-slate-900">
                {t("publication.reviews.form.title")}
            </h3>

            <p className="mt-1 text-sm font-semibold leading-6 text-slate-500">
                {t("publication.reviews.form.subtitle")}
            </p>

            <div className="mt-4">
                <span className="mb-2 block text-sm font-bold text-slate-700">
                    {t("publication.reviews.form.rating")}
                </span>

                <RatingStars value={rating} size="lg" onChange={onRatingChange} />
            </div>

            <label className="mt-4 block">
                <textarea
                    value={text}
                    onChange={(event) => onTextChange(event.target.value)}
                    rows={5}
                    maxLength={1000}
                    placeholder={t("publication.reviews.form.placeholder")}
                    className="w-full resize-none rounded-2xl border border-slate-200 px-4 py-3 text-sm leading-6 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                />

                <div className="mt-2 flex justify-end text-xs font-semibold text-slate-400">
                    {text.length}/1000
                </div>
            </label>

            <button
                type="button"
                onClick={onSubmit}
                disabled={isSubmitting}
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300 sm:w-auto"
            >
                {isSubmitting ? (
                    <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        {t("publication.reviews.form.submitting")}
                    </>
                ) : (
                    <>
                        <Send className="h-5 w-5" />
                        {t("publication.reviews.form.submit")}
                    </>
                )}
            </button>
        </div>
    );
};