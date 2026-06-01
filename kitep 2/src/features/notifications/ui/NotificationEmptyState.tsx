import { Bell } from "lucide-react";
import { useTranslation } from "react-i18next";

import type { NotificationStatus } from "@/shared/api/notifications";

type NotificationEmptyStateProps = {
    filter: NotificationStatus;
};

export const NotificationEmptyState = ({ filter }: NotificationEmptyStateProps) => {
    const { t } = useTranslation();

    const title =
        filter === "unread"
            ? t("notifications.empty.unreadTitle", "Непрочитанных уведомлений нет")
            : filter === "read"
                ? t("notifications.empty.readTitle", "Прочитанных уведомлений нет")
                : t("notifications.empty.title", "Уведомлений пока нет");

    return (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center sm:p-10">
            <Bell className="mx-auto mb-4 h-14 w-14 text-slate-300" />

            <h2 className="text-xl font-black text-slate-900">
                {title}
            </h2>

            <p className="mt-2 text-slate-500">
                {t(
                    "notifications.empty.text",
                    "Здесь будут появляться важные сообщения.",
                )}
            </p>
        </div>
    );
};