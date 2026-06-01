import { Bell, CheckCheck } from "lucide-react";
import { useTranslation } from "react-i18next";
import { AdminPageHeader } from "../../../shared/ui/AdminPageHeader";

type AdminNotificationsHeaderProps = {
    count: number;
    unreadCount: number;
    onMarkAllRead: () => void;
    isMarkingAllRead?: boolean;
};

export const AdminNotificationsHeader = ({
    count,
    unreadCount,
    onMarkAllRead,
    isMarkingAllRead = false,
}: AdminNotificationsHeaderProps) => {
    const { t } = useTranslation();

    return (
        <AdminPageHeader
            badge={t("adminNotifications.badge", "Уведомления")}
            icon={<Bell size={20} />}
            title={t("adminNotifications.title", "Уведомления администратора")}
            subtitle={t(
                "adminNotifications.subtitle",
                "Заявки, системные события и важные сообщения платформы.",
            )}
            rightSlot={
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <div className="rounded-2xl bg-slate-900 px-5 py-4 text-white">
                        <p className="text-sm text-slate-300">
                            {t("adminNotifications.total", "Всего")}
                        </p>
                        <p className="text-3xl font-black">{count}</p>
                    </div>

                    <div className="rounded-2xl bg-red-50 px-5 py-4 text-red-700">
                        <p className="text-sm font-bold text-red-400">
                            {t("notifications.filters.unread", "Непрочитанные")}
                        </p>
                        <p className="text-3xl font-black">{unreadCount}</p>
                    </div>

                    <button
                        type="button"
                        onClick={onMarkAllRead}
                        disabled={unreadCount === 0 || isMarkingAllRead}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-4 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
                    >
                        <CheckCheck size={18} />
                        {isMarkingAllRead
                            ? t("notifications.actions.processing", "Выполняется...")
                            : t("notifications.actions.readAll", "Прочитать все")}
                    </button>
                </div>
            }
        />
    );
};