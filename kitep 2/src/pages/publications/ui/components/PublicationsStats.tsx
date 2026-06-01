import {
    Download,
    Eye,
    FileText,
    MessageSquare,
    ShoppingBag,
    Star,
} from "lucide-react";
import { useTranslation } from "react-i18next";

type PublicationsStatsProps = {
    stats: {
        all: number;
        pending: number;
        published: number;
        rejected: number;
        totalViews?: number;
        totalDownloads?: number;
        totalReviews?: number;
        totalPurchases?: number;
        averageRating?: number;
    };
};

export const PublicationsStats = ({ stats }: PublicationsStatsProps) => {
    const { t } = useTranslation();

    const cards = [
        {
            key: "all",
            label: t("publications.stats.all"),
            value: stats.all,
            valueClass: "text-slate-900",
            icon: <FileText size={18} />,
        },
        {
            key: "pending",
            label: t("publications.stats.pending"),
            value: stats.pending,
            valueClass: "text-yellow-600",
            icon: <FileText size={18} />,
        },
        {
            key: "published",
            label: t("publications.stats.published"),
            value: stats.published,
            valueClass: "text-green-600",
            icon: <FileText size={18} />,
        },
        {
            key: "rejected",
            label: t("publications.stats.rejected"),
            value: stats.rejected,
            valueClass: "text-red-600",
            icon: <FileText size={18} />,
        },
        {
            key: "views",
            label: t("publications.stats.views", "Просмотры"),
            value: stats.totalViews || 0,
            valueClass: "text-blue-600",
            icon: <Eye size={18} />,
        },
        {
            key: "downloads",
            label: t("publications.stats.downloads", "Скачивания"),
            value: stats.totalDownloads || 0,
            valueClass: "text-indigo-600",
            icon: <Download size={18} />,
        },
        {
            key: "reviews",
            label: t("publications.stats.reviews", "Отзывы"),
            value: stats.totalReviews || 0,
            valueClass: "text-purple-600",
            icon: <MessageSquare size={18} />,
        },
        {
            key: "purchases",
            label: t("publications.stats.purchases", "Покупки"),
            value: stats.totalPurchases || 0,
            valueClass: "text-orange-600",
            icon: <ShoppingBag size={18} />,
        },
        {
            key: "rating",
            label: t("publications.stats.averageRating", "Средний рейтинг"),
            value: Number(stats.averageRating || 0).toFixed(1),
            valueClass: "text-yellow-600",
            icon: <Star size={18} />,
        },
    ];

    return (
        <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {cards.map((card) => (
                <div
                    key={card.key}
                    className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5"
                >
                    <div className="mb-3 flex items-center justify-between gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-50 text-slate-400">
                            {card.icon}
                        </div>

                        <p className={`text-xl font-black sm:text-2xl ${card.valueClass}`}>
                            {card.value}
                        </p>
                    </div>

                    <p className="text-sm font-semibold text-slate-500">
                        {card.label}
                    </p>
                </div>
            ))}
        </section>
    );
};