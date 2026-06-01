import { AlertCircle, CheckCircle2, Star } from "lucide-react";
import { useTranslation } from "react-i18next";

import { usePublicationReviews } from "../hooks/usePublicationReviews";
import { RatingStars } from "./RatingStars";
import { ReviewForm } from "./ReviewForm";
import { ReviewsAuthNotice } from "./ReviewsAuthNotice";
import { ReviewsList } from "./ReviewsList";

type ReviewsSectionProps = {
    publicationId: number | string;
    initialAverageRating?: number;
    initialReviewsCount?: number;
};

export const ReviewsSection = ({
    publicationId,
    initialAverageRating = 0,
    initialReviewsCount = 0,
}: ReviewsSectionProps) => {
    const { t } = useTranslation();

    const {
        reviews,
        averageRating,
        reviewsCount,

        loading,
        isSubmitting,

        rating,
        text,

        error,
        successMessage,

        isAuthorized,

        setRating,
        setText,
        submitReview,
    } = usePublicationReviews({
        publicationId,
        initialAverageRating,
        initialReviewsCount,
    });

    return (
        <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
            <div className="flex flex-col gap-4 border-b border-slate-100 pb-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="flex items-center gap-2 text-xl font-black text-slate-900 sm:text-2xl">
                        <Star className="h-6 w-6 text-yellow-400" />
                        {t("publication.reviews.title", "Отзывы и оценки")}
                    </h2>

                    <p className="mt-1 text-sm font-semibold leading-6 text-slate-500">
                        {t(
                            "publication.reviews.subtitle",
                            "Оценки помогают другим пользователям выбрать полезный материал.",
                        )}
                    </p>
                </div>

                <div className="rounded-3xl bg-slate-50 px-4 py-3">
                    <div className="flex items-center gap-3">
                        <RatingStars value={averageRating} readonly />

                        <div className="text-right">
                            <p className="text-lg font-black text-slate-900">
                                {Number(averageRating || 0).toFixed(1)}
                            </p>

                            <p className="text-xs font-semibold text-slate-500">
                                {t("publication.reviews.count", {
                                    count: reviewsCount,
                                    defaultValue: "{{count}} отзывов",
                                })}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {(error || successMessage) && (
                <div className="mt-5 grid gap-3">
                    {error && (
                        <div className="flex items-start gap-3 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    {successMessage && (
                        <div className="flex items-start gap-3 rounded-2xl border border-green-100 bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">
                            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
                            <span>{successMessage}</span>
                        </div>
                    )}
                </div>
            )}

            <div className="mt-5 grid gap-5">
                {isAuthorized ? (
                    <ReviewForm
                        rating={rating}
                        text={text}
                        isSubmitting={isSubmitting}
                        onRatingChange={setRating}
                        onTextChange={setText}
                        onSubmit={submitReview}
                    />
                ) : (
                    <ReviewsAuthNotice />
                )}

                <ReviewsList reviews={reviews} loading={loading} />
            </div>
        </section>
    );
};