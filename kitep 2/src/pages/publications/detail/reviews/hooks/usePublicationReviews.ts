import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { useAuth } from "@/entities/user/model/useAuth";

import {
    createPublicationReview,
    getPublicationReviews,
} from "../api/publicationReviewsApi";
import type { PublicationReview } from "../model/types";

type UsePublicationReviewsParams = {
    publicationId: number | string;
    initialAverageRating?: number;
    initialReviewsCount?: number;
};

const getCurrentUserId = (user: any) => {
    return String(user?.id || user?.user_id || user?.pk || "");
};

export const usePublicationReviews = ({
    publicationId,
    initialAverageRating = 0,
    initialReviewsCount = 0,
}: UsePublicationReviewsParams) => {
    const { t } = useTranslation();
    const { user } = useAuth();

    const [reviews, setReviews] = useState<PublicationReview[]>([]);
    const [averageRating, setAverageRating] = useState(initialAverageRating);
    const [reviewsCount, setReviewsCount] = useState(initialReviewsCount);

    const [loading, setLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [rating, setRating] = useState(0);
    const [text, setText] = useState("");

    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const currentUserId = useMemo(() => getCurrentUserId(user), [user]);

    const isAuthorized = Boolean(currentUserId);

    const loadReviews = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await getPublicationReviews(publicationId);

            setReviews(response.data.reviews);
            setAverageRating(Number(response.data.average_rating || 0));
            setReviewsCount(Number(response.data.reviews_count || 0));
        } catch (requestError) {
            console.log("REVIEWS LOAD ERROR:", requestError);

            setError(
                t(
                    "publication.reviews.messages.loadError",
                    "Не удалось загрузить отзывы.",
                ),
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadReviews();
    }, [publicationId]);

    const resetForm = () => {
        setRating(0);
        setText("");
    };

    const submitReview = async () => {
        setError("");
        setSuccessMessage("");

        if (!currentUserId) {
            setError(
                t(
                    "publication.reviews.messages.authRequired",
                    "Чтобы оставить отзыв, войдите в аккаунт.",
                ),
            );
            return;
        }

        if (rating < 1 || rating > 5) {
            setError(
                t(
                    "publication.reviews.messages.ratingRequired",
                    "Выберите оценку от 1 до 5.",
                ),
            );
            return;
        }

        try {
            setIsSubmitting(true);

            await createPublicationReview(publicationId, {
                user: currentUserId,
                rating,
                text: text.trim(),
            });

            setSuccessMessage(
                t(
                    "publication.reviews.messages.success",
                    "Ваш отзыв успешно сохранён.",
                ),
            );

            resetForm();
            await loadReviews();
        } catch (requestError: any) {
            console.log("REVIEW SUBMIT ERROR:", requestError);

            const backendData = requestError?.response?.data;

            if (backendData && typeof backendData === "object") {
                const firstKey = Object.keys(backendData)[0];
                const firstValue = backendData[firstKey];

                if (Array.isArray(firstValue)) {
                    setError(firstValue[0]);
                    return;
                }

                if (typeof firstValue === "string") {
                    setError(firstValue);
                    return;
                }
            }

            setError(
                t(
                    "publication.reviews.messages.submitError",
                    "Не удалось отправить отзыв. Попробуйте ещё раз.",
                ),
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
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
        reloadReviews: loadReviews,
    };
};