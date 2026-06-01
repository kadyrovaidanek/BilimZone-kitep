import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

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

import { NotificationFilters } from "@/features/notifications/ui/NotificationFilters";
import { NotificationEmptyState } from "@/features/notifications/ui/NotificationEmptyState";
import { AdminNotificationsHeader } from "./notifications/ui/components/AdminNotificationsHeader";
import { AdminNotificationsList } from "./notifications/ui/components/AdminNotificationsList";

const emptyStats: NotificationStats = {
  all: 0,
  unread: 0,
  read: 0,
};

const normalizeNotificationLink = (link: string | null | undefined) => {
  if (!link) return "";

  const legacyLinks: Record<string, string> = {
    "/admin/reports": "/reports",
    "/admin/publications": "/admin/materials",
  };

  if (legacyLinks[link]) {
    return legacyLinks[link];
  }

  if (link.startsWith("/publication/")) {
    return link.replace("/publication/", "/publications/");
  }

  if (link.startsWith("/materials/")) {
    return link.replace("/materials/", "/publications/");
  }

  return link;
};

export const AdminNotificationsPage = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [items, setItems] = useState<NotificationItem[]>([]);
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

      setItems(notificationsResponse.data);
      setStats(statsResponse.data);
    } catch (error) {
      console.log("ADMIN NOTIFICATIONS LOAD ERROR:", error);
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

  const handleOpen = async (notification: NotificationItem) => {
    try {
      if (!notification.is_read) {
        await markNotificationRead(notification.id);
        emitNotificationsUpdated();

        await loadNotifications();
      }

      const targetLink = normalizeNotificationLink(notification.link);

      if (targetLink) {
        navigate(targetLink);
      }
    } catch (error) {
      console.log("ADMIN NOTIFICATION OPEN ERROR:", error);
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
      console.log("ADMIN NOTIFICATION DELETE ERROR:", error);
      alert(
        t(
          "notifications.messages.deleteError",
          "Ошибка удаления уведомления",
        ),
      );
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
      console.log("ADMIN NOTIFICATIONS READ ALL ERROR:", error);
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

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <AdminNotificationsHeader
          count={stats.all}
          unreadCount={stats.unread}
          onMarkAllRead={handleMarkAllRead}
          isMarkingAllRead={isMarkingAllRead}
        />

        <NotificationFilters
          value={filter}
          onChange={setFilter}
          counts={stats}
        />

        {loading ? (
          <section className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-slate-500">
            {t("notifications.messages.loading", "Загрузка...")}
          </section>
        ) : items.length === 0 ? (
          <NotificationEmptyState filter={filter} />
        ) : (
          <AdminNotificationsList
            items={items}
            onOpen={handleOpen}
            onDelete={handleDelete}
          />
        )}
      </div>
    </main>
  );
};

export default AdminNotificationsPage;