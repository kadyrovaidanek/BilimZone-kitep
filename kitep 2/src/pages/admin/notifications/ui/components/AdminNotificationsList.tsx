import {
    Bell,
    CheckCircle,
    ExternalLink,
    FileText,
    Trash2,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import type { NotificationItem } from "@/shared/api/notifications";
import { getNotificationTypeLabel } from "@/features/notifications/lib/notificationHelpers";

type AdminNotificationsListProps = {
    items: NotificationItem[];
    onOpen: (notification: NotificationItem) => void;
    onDelete: (id: number) => void;
};

export const AdminNotificationsList = ({
    items,
    onOpen,
    onDelete,
}: AdminNotificationsListProps) => {
    const { t } = useTranslation();

    if (items.length === 0) {
        return (
            <section className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
                <Bell className="mx-auto mb-3 h-12 w-12 text-slate-300" />
                {t("adminNotifications.empty", "Уведомлений пока нет")}
            </section>
        );
    }

    return (
        <section className="grid gap-4">
            {items.map((item) => {
                const Icon =
                    item.notification_type === "publication_request"
                        ? FileText
                        : item.is_read
                            ? CheckCircle
                            : Bell;

                return (
                    <article
                        key={item.id}
                        className={`rounded-3xl border p-4 shadow-sm transition sm:p-5 ${item.is_read
                                ? "border-slate-200 bg-white"
                                : "border-red-100 bg-red-50"
                            }`}
                    >
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                            <button
                                type="button"
                                onClick={() => onOpen(item)}
                                className="flex-1 text-left"
                            >
                                <div className="flex gap-4">
                                    <div
                                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${item.is_read
                                                ? "bg-slate-100 text-slate-500"
                                                : "bg-blue-50 text-blue-600"
                                            }`}
                                    >
                                        <Icon size={22} />
                                    </div>

                                    <div className="min-w-0">
                                        <div className="mb-2 flex flex-wrap items-center gap-2">
                                            <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-bold text-slate-500">
                                                {getNotificationTypeLabel(
                                                    item.notification_type,
                                                    t,
                                                )}
                                            </span>

                                            {!item.is_read && (
                                                <span className="rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white">
                                                    {t("notifications.status.new", "Новое")}
                                                </span>
                                            )}

                                            {item.is_read && (
                                                <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-bold text-slate-600">
                                                    {t("notifications.status.read", "Прочитано")}
                                                </span>
                                            )}
                                        </div>

                                        <h3 className="break-words font-black text-slate-900">
                                            {item.title}
                                        </h3>

                                        <p className="mt-1 break-words text-sm leading-6 text-slate-500">
                                            {item.message}
                                        </p>

                                        <p className="mt-2 text-xs font-semibold text-slate-400">
                                            {new Date(item.created_at).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            </button>

                            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:min-w-[220px] lg:grid-cols-1">
                                {item.link && (
                                    <button
                                        type="button"
                                        onClick={() => onOpen(item)}
                                        className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50"
                                    >
                                        <ExternalLink size={16} />
                                        {t("notifications.actions.open", "Открыть")}
                                    </button>
                                )}

                                <button
                                    type="button"
                                    onClick={() => onDelete(item.id)}
                                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-red-50 px-4 py-2.5 text-sm font-bold text-red-600 hover:bg-red-100"
                                >
                                    <Trash2 size={16} />
                                    {t("notifications.actions.delete", "Удалить")}
                                </button>
                            </div>
                        </div>
                    </article>
                );
            })}
        </section>
    );
};