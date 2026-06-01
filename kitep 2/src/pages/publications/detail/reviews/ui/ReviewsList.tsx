import { MessageCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

import type { PublicationReview } from "../model/types";
import { RatingStars } from "./RatingStars";

type ReviewsListProps = {
    reviews: PublicationReview[];
    loading: boolean;
};

const formatReviewDate = (value: string, language: string) => {
    if (!value) {
        return "";
    }

    try {
        return new Intl.DateTimeFormat(language === "kg" ? "ky-KG" : "ru-RU", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        }).format(new Date(value));
    } catch {
        return value;
    }
};

export const ReviewsList = ({ reviews, loading }: ReviewsListProps) => {
    const { t, i18n } = useTranslation();

    if (loading) {
        return (
            <div className="rounded-3xl border border-slate-200 bg-white p-6 text-center text-sm font-semibold text-slate-500">
                {t("publication.reviews.messages.loading", "Отзывы загружаются...")}
            </div>
        );
    }

    if (reviews.length === 0) {
        return (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-6 text-center">
                <MessageCircle className="mx-auto h-10 w-10 text-slate-300" />

                <h3 className="mt-3 text-lg font-black text-slate-900">
                    {t("publication.reviews.empty.title", "Пока нет отзывов")}
                </h3>

                <p className="mt-1 text-sm font-semibold leading-6 text-slate-500">
                    {t(
                        "publication.reviews.empty.description",
                        "Станьте первым, кто оценит этот материал.",
                    )}
                </p>
            </div>
        );
    }

    return (
        <div className="grid gap-3">
            {reviews.map((review) => (
                <article
                    key={review.id}
                    className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5"
                >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                            <h3 className="text-base font-black text-slate-900">
                                {review.username ||
                                    t(
                                        "publication.reviews.unknownUser",
                                        "Пользователь",
                                    )}
                            </h3>

                            <p className="mt-1 text-xs font-semibold text-slate-400">
                                {formatReviewDate(review.created_at, i18n.language)}
                            </p>
                        </div>

                        <RatingStars value={review.rating} readonly />
                    </div>

                    <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-slate-600">
                        {review.text}
                    </p>
                </article>
            ))}
        </div>
    );
};