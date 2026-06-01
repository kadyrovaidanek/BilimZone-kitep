import { useTranslation } from "react-i18next";

import type { CollectionFilterType } from "../../lib/collectionFilters";

type CollectionStatsProps = {
    stats: {
        all: number;
        free: number;
        paid: number;
    };
    filter: CollectionFilterType;
    onFilterChange: (filter: CollectionFilterType) => void;
};

export const CollectionStats = ({
    stats,
    filter,
    onFilterChange,
}: CollectionStatsProps) => {
    const { t } = useTranslation();

    const cards = [
        {
            key: "all" as const,
            label: t("collection.filters.all"),
            count: stats.all,
            activeClass: "border-blue-600 bg-blue-600 text-white",
        },
        {
            key: "free" as const,
            label: t("collection.filters.free"),
            count: stats.free,
            activeClass: "border-green-600 bg-green-600 text-white",
        },
        {
            key: "paid" as const,
            label: t("collection.filters.paid"),
            count: stats.paid,
            activeClass: "border-orange-500 bg-orange-500 text-white",
        },
    ];

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {cards.map((card) => (
                <button
                    key={card.key}
                    type="button"
                    onClick={() => onFilterChange(card.key)}
                    className={`rounded-3xl border p-5 text-left transition ${filter === card.key
                            ? card.activeClass
                            : "border-slate-200 bg-white text-slate-900 hover:bg-slate-50"
                        }`}
                >
                    <p className="text-sm opacity-80">{card.label}</p>
                    <p className="mt-1 text-2xl font-black">{card.count}</p>
                </button>
            ))}
        </div>
    );
};