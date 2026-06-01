import { Bell, CheckCheck } from "lucide-react";
import { useTranslation } from "react-i18next";

type NotificationsHeaderProps = {
    title?: string;
    subtitle?: string;
    unreadCount: number;
    totalCount: number;
    onMarkAllRead: () => void;
    isMarkingAllRead?: boolean;
};

export const NotificationsHeader = ({
    title,
    subtitle,
    unreadCount,
    totalCount,
    onMarkAllRead,
    isMarkingAllRead = false,
}: NotificationsHeaderProps) => {
    const { t } = useTranslation();

    return (
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div className="min-w-0">
                    <h1 className="flex items-center gap-3 text-2xl font-black text-slate-900 sm:text-3xl">
                        <span className="relative inline-flex shrink-0">
                            <Bell className="text-blue-600" size={28} />

                            {unreadCount > 0 && (
                                <span className="absolute -right-3 -top-3 inline-flex min-h-[24px] min-w-[24px] items-center justify-center rounded-full border-2 border-white bg-red-500 px-1 text-xs font-black text-white">
                                    {unreadCount > 99 ? "99+" : unreadCount}
                                </span>
                            )}
                        </span>

                        <span className="truncate">
                            {title || t("notifications.title", "Уведомления")}
                        </span>
                    </h1>

                    <p className="mt-2 text-sm text-slate-500">
                        {subtitle ||
                            (unreadCount > 0
                                ? t("notifications.unreadCount", "Непрочитанных: {{count}}", {
                                    count: unreadCount,
                                })
                                : t("notifications.noUnread", "Все уведомления прочитаны"))}
                    </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <div className="rounded-2xl bg-slate-100 px-4 py-3 text-center sm:min-w-[120px]">
                        <p className="text-xs font-bold uppercase text-slate-500">
                            {t("notifications.total", "Всего")}
                        </p>
                        <p className="text-2xl font-black text-slate-900">
                            {totalCount}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onMarkAllRead}
                        disabled={unreadCount === 0 || isMarkingAllRead}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 font-bold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300 sm:w-auto"
                    >
                        <CheckCheck size={20} />
                        {isMarkingAllRead
                            ? t("notifications.actions.processing", "Выполняется...")
                            : t("notifications.actions.readAll", "Прочитать все")}
                    </button>
                </div>
            </div>
        </div>
    );
};