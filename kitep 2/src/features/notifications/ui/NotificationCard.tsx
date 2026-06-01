import {
    Clock,
    ExternalLink,
    FileText,
    Trash2,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import type { NotificationItem } from "@/shared/api/notifications";
import {
    getNotificationCardClass,
    getNotificationIconClass,
    getNotificationTypeLabel,
} from "../lib/notificationHelpers";

type NotificationCardProps = {
    notification: NotificationItem;
    onOpen: (notification: NotificationItem) => void;
    onDelete: (id: number) => void;
};

export const NotificationCard = ({
    notification,
    onOpen,
    onDelete,
}: NotificationCardProps) => {
    const { t } = useTranslation();

    return (
        <div
            className={`rounded-3xl border p-4 transition sm:p-6 ${getNotificationCardClass(
                notification.is_read,
            )}`}
        >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <button
                    type="button"
                    onClick={() => onOpen(notification)}
                    className="flex-1 text-left"
                >
                    <div className="flex items-start gap-4">
                        <div
                            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${getNotificationIconClass(
                                notification.is_read,
                            )}`}
                        >
                            <FileText size={22} />
                        </div>

                        <div className="min-w-0">
                            <div className="mb-2 flex flex-wrap items-center gap-2">
                                <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-bold text-slate-500">
                                    {getNotificationTypeLabel(
                                        notification.notification_type,
                                        t,
                                    )}
                                </span>

                                {!notification.is_read && (
                                    <span className="rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white">
                                        {t("notifications.status.new", "Новое")}
                                    </span>
                                )}

                                {notification.is_read && (
                                    <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-bold text-slate-600">
                                        {t("notifications.status.read", "Прочитано")}
                                    </span>
                                )}
                            </div>

                            <h2 className="break-words text-lg font-black text-slate-900">
                                {notification.title}
                            </h2>

                            <p className="mt-1 break-words text-sm leading-6 text-slate-600">
                                {notification.message}
                            </p>

                            <p className="mt-3 inline-flex items-center gap-1 text-xs text-slate-400">
                                <Clock size={14} />
                                {new Date(notification.created_at).toLocaleString()}
                            </p>
                        </div>
                    </div>
                </button>

                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:min-w-[220px] lg:grid-cols-1">
                    {notification.link && (
                        <button
                            type="button"
                            onClick={() => onOpen(notification)}
                            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50"
                        >
                            <ExternalLink size={16} />
                            {t("notifications.actions.open", "Открыть")}
                        </button>
                    )}

                    <button
                        type="button"
                        onClick={() => onDelete(notification.id)}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-red-50 px-4 py-2.5 text-sm font-bold text-red-600 hover:bg-red-100"
                    >
                        <Trash2 size={16} />
                        {t("notifications.actions.delete", "Удалить")}
                    </button>
                </div>
            </div>
        </div>
    );
};