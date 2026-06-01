import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AlertCircle, Bell } from "lucide-react";

import { useAuth } from "@/entities/user/model/useAuth";
import {
  deleteNotification,
  emitNotificationsUpdated,
  getNotifications,
  getNotificationsStats,
  markAllNotificationsRead,
  markNotificationRead,
  type NotificationItem,
  type NotificationStatus,
  type NotificationStats,
} from "@/shared/api/notifications";

import { NotificationsHeader } from "@/features/notifications/ui/NotificationsHeader";
import { NotificationFilters } from "@/features/notifications/ui/NotificationFilters";
import { NotificationCard } from "@/features/notifications/ui/NotificationCard";
import { NotificationEmptyState } from "@/features/notifications/ui/NotificationEmptyState";

const emptyStats: NotificationStats = {
  all: 0,
  unread: 0,
  read: 0,
};

export const NotificationsPage = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [stats, setStats] = useState<NotificationStats>(emptyStats);
  const [filter, setFilter] = useState<NotificationStatus>("all");

  const [loading, setLoading] = useState(false);
  const [isMarkingAllRead, setIsMarkingAllRead] = useState(false);

  const userId = useMemo(() => {
    if (!user) return "";

    const value = user as {
      id?: number | string;
      user_id?: number | string;
      pk?: number | string;
    };

    return String(value.id || value.user_id || value.pk || "");
  }, [user]);

  const loadNotifications = useCallback(async () => {
    if (!userId) return;

    try {
      setLoading(true);

      const [notificationsResponse, statsResponse] = await Promise.all([
        getNotifications(userId, filter),
        getNotificationsStats(userId),
      ]);

      setNotifications(notificationsResponse.data);
      setStats(statsResponse.data);
    } catch (error) {
      console.log("NOTIFICATIONS LOAD ERROR:", error);
      alert(
        t(
          "notifications.messages.loadError",
          "Ошибка загрузки уведомлений",
        ),
      );
    } finally {
      setLoading(false);
    }
  }, [userId, filter, t]);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const handleOpenNotification = async (notification: NotificationItem) => {
    try {
      if (!notification.is_read) {
        await markNotificationRead(notification.id);
        emitNotificationsUpdated();

        await loadNotifications();
      }

      if (notification.link) {
        navigate(notification.link);
      }
    } catch (error) {
      console.log("NOTIFICATION READ ERROR:", error);
    }
  };

  const handleMarkAllRead = async () => {
    if (!userId) return;

    try {
      setIsMarkingAllRead(true);

      await markAllNotificationsRead(userId);
      emitNotificationsUpdated();

      await loadNotifications();
    } catch (error) {
      console.log("NOTIFICATIONS READ ALL ERROR:", error);
      alert(
        t(
          "notifications.messages.readAllError",
          "Ошибка изменения уведомлений",
        ),
      );
    } finally {
      setIsMarkingAllRead(false);
    }
  };

  const handleDelete = async (id: number) => {
    const ok = window.confirm(
      t(
        "notifications.messages.deleteConfirm",
        "Удалить это уведомление?",
      ),
    );

    if (!ok) return;

    try {
      await deleteNotification(id);
      emitNotificationsUpdated();

      await loadNotifications();
    } catch (error) {
      console.log("NOTIFICATION DELETE ERROR:", error);
      alert(
        t(
          "notifications.messages.deleteError",
          "Ошибка удаления уведомления",
        ),
      );
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-10">
        <div className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-8 text-center">
          <AlertCircle className="mx-auto mb-4 h-12 w-12 text-orange-500" />

          <h1 className="text-2xl font-black text-slate-900">
            {t("notifications.notAuthorized", "Вы не авторизованы")}
          </h1>

          <Link
            to="/login"
            className="mt-5 inline-flex rounded-2xl bg-slate-900 px-5 py-3 font-bold text-white"
          >
            {t("login", "Войти")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 pb-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <NotificationsHeader
          unreadCount={stats.unread}
          totalCount={stats.all}
          onMarkAllRead={handleMarkAllRead}
          isMarkingAllRead={isMarkingAllRead}
        />

        <NotificationFilters
          value={filter}
          onChange={setFilter}
          counts={stats}
        />

        {loading ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-slate-500">
            {t("notifications.messages.loading", "Загрузка...")}
          </div>
        ) : notifications.length === 0 ? (
          <NotificationEmptyState filter={filter} />
        ) : (
          <div className="space-y-3">
            {notifications.map((notification) => (
              <NotificationCard
                key={notification.id}
                notification={notification}
                onOpen={handleOpenNotification}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}

        {!loading && notifications.length > 0 && (
          <div className="rounded-3xl border border-slate-200 bg-white p-4 text-center text-sm text-slate-500">
            <Bell className="mx-auto mb-2 h-5 w-5 text-slate-400" />
            {t(
              "notifications.footerHint",
              "Нажмите на уведомление, чтобы открыть связанный раздел.",
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;