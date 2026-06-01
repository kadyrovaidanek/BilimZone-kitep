import type { ReactNode } from "react";
import {
    Download,
    Eye,
    FileText,
    MessageSquare,
    Pencil,
    ShoppingBag,
    Star,
    Trash2,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import type { Publication } from "@/shared/api/publications";
import {
    statusIcons,
    statusStyles,
} from "../../lib/publicationStyles";
import {
    getCategoryName,
    getDirectionName,
} from "../../lib/publicationFilters";

type BackendPublicationCardProps = {
    publication: Publication;
    language: "ru" | "kg";
    onDelete: (id: number) => void;
};

export const BackendPublicationCard = ({
    publication,
    language,
    onDelete,
}: BackendPublicationCardProps) => {
    const { t } = useTranslation();

    const StatusIcon = statusIcons[publication.status];

    const rating = Number(publication.average_rating || 0);
    const reviewsCount = Number(publication.reviews_count || 0);
    const purchasesCount = Number(publication.purchases_count || 0);

    return (
        <article className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
            <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                            <FileText size={26} />
                        </div>

                        <div className="min-w-0 flex-1">
                            <div className="mb-2 flex flex-wrap items-center gap-2">
                                <span
                                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${statusStyles[publication.status]}`}
                                >
                                    <StatusIcon size={14} />
                                    {t(`publications.status.${publication.status}`)}
                                </span>

                                <span
                                    className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${publication.price_type === "free"
                                            ? "bg-emerald-50 text-emerald-700"
                                            : "bg-orange-50 text-orange-700"
                                        }`}
                                >
                                    {publication.price_type === "free"
                                        ? t("publications.price.free")
                                        : `${publication.price} ${t("publication.price.currency")}`}
                                </span>
                            </div>

                            <Link to={`/publications/${publication.id}`}>
                                <h3 className="text-lg font-black leading-snug text-slate-900 transition hover:text-blue-600 sm:text-xl">
                                    {publication.title}
                                </h3>
                            </Link>

                            {publication.description && (
                                <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
                                    {publication.description}
                                </p>
                            )}

                            <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold">
                                {getCategoryName(publication, language) && (
                                    <span className="rounded-full bg-blue-50 px-3 py-1 text-blue-600">
                                        {getCategoryName(publication, language)}
                                    </span>
                                )}

                                {getDirectionName(publication, language) && (
                                    <span className="rounded-full bg-purple-50 px-3 py-1 text-purple-600">
                                        {getDirectionName(publication, language)}
                                    </span>
                                )}

                                {publication.option_value && (
                                    <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-600">
                                        {publication.option_value}
                                    </span>
                                )}
                            </div>

                            {publication.status === "rejected" &&
                                publication.reject_reason && (
                                    <div className="mt-4 rounded-2xl border border-red-100 bg-red-50 p-3 text-sm text-red-700">
                                        <span className="font-bold">
                                            {t("publications.rejectReason")}:
                                        </span>{" "}
                                        {publication.reject_reason}
                                    </div>
                                )}

                            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
                                <MetricBadge
                                    icon={<Eye size={15} />}
                                    label={t("publications.metrics.views", "Просмотры")}
                                    value={publication.views_count || 0}
                                />

                                <MetricBadge
                                    icon={<Download size={15} />}
                                    label={t("publications.metrics.downloads", "Скачивания")}
                                    value={publication.downloads_count || 0}
                                />

                                <MetricBadge
                                    icon={
                                        <Star
                                            size={15}
                                            className="fill-yellow-400 text-yellow-500"
                                        />
                                    }
                                    label={t("publications.metrics.rating", "Рейтинг")}
                                    value={rating.toFixed(1)}
                                />

                                <MetricBadge
                                    icon={<MessageSquare size={15} />}
                                    label={t("publications.metrics.reviews", "Отзывы")}
                                    value={reviewsCount}
                                />

                                <MetricBadge
                                    icon={<ShoppingBag size={15} />}
                                    label={t("publications.metrics.purchases", "Покупки")}
                                    value={purchasesCount}
                                />
                            </div>

                            {publication.created_at && (
                                <p className="mt-4 text-xs font-medium text-slate-400">
                                    {t("publications.createdAt")}:{" "}
                                    {new Date(publication.created_at).toLocaleDateString()}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:w-[170px] xl:grid-cols-1">
                    <Link
                        to={`/publications/edit/${publication.id}`}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                    >
                        <Pencil size={16} />
                        {t("publications.actions.edit")}
                    </Link>

                    <button
                        type="button"
                        onClick={() => onDelete(publication.id)}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-red-50 px-4 py-2.5 text-sm font-bold text-red-600 transition hover:bg-red-100"
                    >
                        <Trash2 size={16} />
                        {t("publications.actions.delete")}
                    </button>
                </div>
            </div>
        </article>
    );
};

function MetricBadge({
    icon,
    label,
    value,
}: {
    icon: ReactNode;
    label: string;
    value: string | number;
}) {
    return (
        <div className="rounded-2xl bg-slate-50 px-3 py-3">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
                {icon}
                <span className="truncate">{label}</span>
            </div>

            <p className="mt-1 text-lg font-black text-slate-900">
                {value}
            </p>
        </div>
    );
}