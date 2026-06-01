import { useTranslation } from "react-i18next";

import type { NotificationStatus } from "@/shared/api/notifications";

type NotificationFiltersProps = {
    value: NotificationStatus;
    onChange: (value: NotificationStatus) => void;
    counts: {
        all: number;
        unread: number;
        read: number;
    };
};

const filters: NotificationStatus[] = ["all", "unread", "read"];

export const NotificationFilters = ({
    value,
    onChange,
    counts,
}: NotificationFiltersProps) => {
    const { t } = useTranslation();

    const getLabel = (filter: NotificationStatus) => {
        if (filter === "all") {
            return t("notifications.filters.all", "Все");
        }

        if (filter === "unread") {
            return t("notifications.filters.unread", "Непрочитанные");
        }

        return t("notifications.filters.read", "Прочитанные");
    };

    const getCount = (filter: NotificationStatus) => {
        if (filter === "all") return counts.all;
        if (filter === "unread") return counts.unread;
        return counts.read;
    };

    return (
        <div className="rounded-3xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                {filters.map((filter) => {
                    const isActive = value === filter;

                    return (
                        <button
                            key={filter}
                            type="button"
                            onClick={() => onChange(filter)}
                            className={`flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-bold transition ${isActive
                                    ? "bg-slate-900 text-white"
                                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                                }`}
                        >
                            <span>{getLabel(filter)}</span>

                            <span
                                className={`rounded-full px-2 py-0.5 text-xs ${isActive
                                        ? "bg-white/20 text-white"
                                        : "bg-white text-slate-500"
                                    }`}
                            >
                                {getCount(filter)}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};