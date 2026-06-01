import { Link } from "react-router-dom";
import {
    AlertCircle,
    ArrowLeft,
    CheckCircle2,
    Loader2,
    MessageSquare,
    RefreshCcw,
    Search,
    Trash2,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import { useAdminReviews } from "../hooks/useAdminReviews";
import type { AdminPublicationReview } from "../model/types";
import { AdminReviewRating } from "./AdminReviewRating";

const formatDate = (value: string, language: string) => {
    if (!value) {
        return "";
    }

    try {
        return new Intl.DateTimeFormat(language === "kg" ? "ky-KG" : "ru-RU", {
            day: "2-digit",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }).format(new Date(value));
    } catch {
        return value;
    }
};

type ReviewCardProps = {
    review: AdminPublicationReview;
    deleting: boolean;
    onDelete: (review: AdminPublicationReview) => void;
};

const ReviewMobileCard = ({
    review,
    deleting,
    onDelete,
}: ReviewCardProps) => {
    const { t, i18n } = useTranslation();

    return (
        <article className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <h3 className="text-base font-black text-slate-900">
                        {review.publication_title}
                    </h3>

                    <p className="mt-1 text-xs font-semibold text-slate-400">
                        {formatDate(review.created_at, i18n.language)}
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => onDelete(review)}
                    disabled={deleting}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                    aria-label={t("adminReviews.actions.delete", "Удалить")}
                >
                    {deleting ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                        <Trash2 className="h-5 w-5" />
                    )}
                </button>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                    {review.username ||
                        t("adminReviews.unknownUser", "Пользователь")}
                </span>

                <AdminReviewRating rating={review.rating} />
            </div>

            <p className="mt-4 whitespace-pre-wrap rounded-2xl bg-slate-50 p-3 text-sm leading-6 text-slate-600">
                {review.text || t("adminReviews.emptyText", "Текст отсутствует")}
            </p>

            <Link
                to={`/publications/${review.publication_id}`}
                className="mt-4 inline-flex text-sm font-bold text-blue-600 transition hover:text-blue-700 hover:underline"
            >
                {t("adminReviews.actions.openPublication", "Открыть публикацию")}
            </Link>
        </article>
    );
};

export const AdminReviewsPage = () => {
    const { t, i18n } = useTranslation();

    const {
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
    } = useAdminReviews();

    return (
        <main className="min-h-screen bg-slate-50 px-3 py-5 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl space-y-5">
                <Link
                    to="/admin"
                    className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 transition hover:text-blue-600"
                >
                    <ArrowLeft className="h-4 w-4" />
                    {t("adminReviews.back", "Назад в админ-панель")}
                </Link>

                <section className="rounded-3xl bg-gradient-to-r from-slate-900 to-blue-900 p-5 text-white shadow-sm sm:p-7">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-200">
                                BilimZone Admin
                            </p>

                            <h1 className="mt-2 text-2xl font-black sm:text-3xl">
                                {t("adminReviews.title", "Управление отзывами")}
                            </h1>

                            <p className="mt-2 max-w-2xl text-sm leading-6 text-blue-100">
                                {t(
                                    "adminReviews.subtitle",
                                    "Просматривайте отзывы пользователей и удаляйте неподходящие комментарии.",
                                )}
                            </p>
                        </div>

                        <div className="rounded-3xl bg-white/10 px-5 py-4 text-center">
                            <p className="text-3xl font-black">
                                {reviews.length}
                            </p>

                            <p className="text-xs font-bold uppercase tracking-wide text-blue-100">
                                {t("adminReviews.total", "Всего отзывов")}
                            </p>
                        </div>
                    </div>
                </section>

                {(error || successMessage) && (
                    <section className="grid gap-3">
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
                    </section>
                )}

                <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                    <div className="grid gap-3 md:grid-cols-[1fr_220px_auto]">
                        <label className="relative block">
                            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                            <input
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                                placeholder={t(
                                    "adminReviews.filters.search",
                                    "Поиск по публикации, пользователю или тексту",
                                )}
                                className="w-full rounded-2xl border border-slate-200 py-3 pl-11 pr-4 text-sm font-semibold outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                            />
                        </label>

                        <select
                            value={ratingFilter}
                            onChange={(event) => setRatingFilter(event.target.value)}
                            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                        >
                            <option value="all">
                                {t("adminReviews.filters.allRatings", "Все оценки")}
                            </option>
                            <option value="5">5 ★</option>
                            <option value="4">4 ★</option>
                            <option value="3">3 ★</option>
                            <option value="2">2 ★</option>
                            <option value="1">1 ★</option>
                        </select>

                        <button
                            type="button"
                            onClick={loadReviews}
                            disabled={loading}
                            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
                        >
                            {loading ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                                <RefreshCcw className="h-5 w-5" />
                            )}
                            {t("adminReviews.actions.refresh", "Обновить")}
                        </button>
                    </div>
                </section>

                {loading ? (
                    <section className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-sm font-semibold text-slate-500">
                        <Loader2 className="mx-auto mb-3 h-7 w-7 animate-spin text-blue-600" />
                        {t("adminReviews.messages.loading", "Отзывы загружаются...")}
                    </section>
                ) : filteredReviews.length === 0 ? (
                    <section className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center">
                        <MessageSquare className="mx-auto h-12 w-12 text-slate-300" />

                        <h2 className="mt-3 text-xl font-black text-slate-900">
                            {t("adminReviews.empty.title", "Отзывы не найдены")}
                        </h2>

                        <p className="mt-1 text-sm font-semibold text-slate-500">
                            {t(
                                "adminReviews.empty.description",
                                "Попробуйте изменить фильтры или обновить список.",
                            )}
                        </p>
                    </section>
                ) : (
                    <>
                        <section className="grid gap-4 lg:hidden">
                            {filteredReviews.map((review) => (
                                <ReviewMobileCard
                                    key={review.id}
                                    review={review}
                                    deleting={deletingId === review.id}
                                    onDelete={handleDelete}
                                />
                            ))}
                        </section>

                        <section className="hidden overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm lg:block">
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[980px] text-left text-sm">
                                    <thead className="bg-slate-50 text-xs font-black uppercase tracking-wide text-slate-500">
                                        <tr>
                                            <th className="px-5 py-4">
                                                {t(
                                                    "adminReviews.table.publication",
                                                    "Публикация",
                                                )}
                                            </th>
                                            <th className="px-5 py-4">
                                                {t(
                                                    "adminReviews.table.user",
                                                    "Пользователь",
                                                )}
                                            </th>
                                            <th className="px-5 py-4">
                                                {t(
                                                    "adminReviews.table.rating",
                                                    "Оценка",
                                                )}
                                            </th>
                                            <th className="px-5 py-4">
                                                {t(
                                                    "adminReviews.table.text",
                                                    "Отзыв",
                                                )}
                                            </th>
                                            <th className="px-5 py-4">
                                                {t(
                                                    "adminReviews.table.date",
                                                    "Дата",
                                                )}
                                            </th>
                                            <th className="px-5 py-4 text-right">
                                                {t(
                                                    "adminReviews.table.actions",
                                                    "Действия",
                                                )}
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody className="divide-y divide-slate-100">
                                        {filteredReviews.map((review) => (
                                            <tr
                                                key={review.id}
                                                className="align-top transition hover:bg-slate-50/70"
                                            >
                                                <td className="px-5 py-4">
                                                    <Link
                                                        to={`/publications/${review.publication_id}`}
                                                        className="font-black text-slate-900 transition hover:text-blue-600 hover:underline"
                                                    >
                                                        {review.publication_title}
                                                    </Link>
                                                </td>

                                                <td className="px-5 py-4 font-semibold text-slate-600">
                                                    {review.username ||
                                                        t(
                                                            "adminReviews.unknownUser",
                                                            "Пользователь",
                                                        )}
                                                </td>

                                                <td className="px-5 py-4">
                                                    <AdminReviewRating
                                                        rating={review.rating}
                                                    />
                                                </td>

                                                <td className="max-w-[320px] px-5 py-4">
                                                    <p className="line-clamp-4 whitespace-pre-wrap text-sm leading-6 text-slate-600">
                                                        {review.text ||
                                                            t(
                                                                "adminReviews.emptyText",
                                                                "Текст отсутствует",
                                                            )}
                                                    </p>
                                                </td>

                                                <td className="px-5 py-4 text-slate-500">
                                                    {formatDate(
                                                        review.created_at,
                                                        i18n.language,
                                                    )}
                                                </td>

                                                <td className="px-5 py-4 text-right">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleDelete(review)
                                                        }
                                                        disabled={
                                                            deletingId === review.id
                                                        }
                                                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-red-50 px-4 py-2 text-sm font-bold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                                                    >
                                                        {deletingId === review.id ? (
                                                            <Loader2 className="h-4 w-4 animate-spin" />
                                                        ) : (
                                                            <Trash2 className="h-4 w-4" />
                                                        )}
                                                        {t(
                                                            "adminReviews.actions.delete",
                                                            "Удалить",
                                                        )}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    </>
                )}
            </div>
        </main>
    );
};

export default AdminReviewsPage;