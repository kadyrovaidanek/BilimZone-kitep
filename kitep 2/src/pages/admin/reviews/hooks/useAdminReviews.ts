import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import {
    deleteAdminReview,
    getAdminReviews,
} from "../api/adminReviewsApi";
import type { AdminPublicationReview } from "../model/types";

export const useAdminReviews = () => {
    const { t } = useTranslation();

    const [reviews, setReviews] = useState<AdminPublicationReview[]>([]);
    const [loading, setLoading] = useState(false);
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const [search, setSearch] = useState("");
    const [ratingFilter, setRatingFilter] = useState("all");

    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const loadReviews = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await getAdminReviews();
            setReviews(response.data.reviews);
        } catch (requestError) {
            console.log("ADMIN REVIEWS LOAD ERROR:", requestError);

            setError(
                t(
                    "adminReviews.messages.loadError",
                    "Не удалось загрузить отзывы.",
                ),
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadReviews();
    }, []);

    const filteredReviews = useMemo(() => {
        const searchValue = search.trim().toLowerCase();

        return reviews.filter((review) => {
            const matchesSearch =
                !searchValue ||
                review.publication_title.toLowerCase().includes(searchValue) ||
                review.username.toLowerCase().includes(searchValue) ||
                review.text.toLowerCase().includes(searchValue);

            const matchesRating =
                ratingFilter === "all" ||
                String(review.rating) === String(ratingFilter);

            return matchesSearch && matchesRating;
        });
    }, [reviews, search, ratingFilter]);

    const handleDelete = async (review: AdminPublicationReview) => {
        const ok = confirm(
            t(
                "adminReviews.messages.deleteConfirm",
                "Удалить этот отзыв? Действие нельзя отменить.",
            ),
        );

        if (!ok) {
            return;
        }

        try {
            setDeletingId(review.id);
            setError("");
            setSuccessMessage("");

            await deleteAdminReview(review.id);

            setReviews((prev) => prev.filter((item) => item.id !== review.id));

            setSuccessMessage(
                t("adminReviews.messages.deleted", "Отзыв удалён."),
            );
        } catch (requestError) {
            console.log("ADMIN REVIEW DELETE ERROR:", requestError);

            setError(
                t(
                    "adminReviews.messages.deleteError",
                    "Не удалось удалить отзыв.",
                ),
            );
        } finally {
            setDeletingId(null);
        }
    };

    return {
        reviews,
        filteredReviews,

        loading,
        deletingId,

        search,
        ratingFilter,

        error,
        successMessage,

        setSearch,
        setRatingFilter,

        loadReviews,
        handleDelete,
    };
};