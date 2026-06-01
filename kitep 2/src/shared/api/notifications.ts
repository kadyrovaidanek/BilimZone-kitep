import axios from "axios";

const API = axios.create({
    baseURL: "https://bilimzone-backend1.onrender.com/api",
});

API.interceptors.request.use((config) => {
    const token = localStorage.getItem("authToken");

    if (token && token !== "undefined" && token !== "null") {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export type NotificationStatus = "all" | "unread" | "read";

export type NotificationItem = {
    id: number;
    title: string;
    message: string;
    notification_type: string;
    link: string | null;
    is_read: boolean;
    created_at: string;
};

export type NotificationStats = {
    all: number;
    unread: number;
    read: number;
};

export const NOTIFICATIONS_EVENT_NAME = "bilimzone_notifications_updated";

export const emitNotificationsUpdated = () => {
    window.dispatchEvent(new CustomEvent(NOTIFICATIONS_EVENT_NAME));
};

export const getNotifications = (
    userId: number | string,
    status: NotificationStatus = "all",
) => {
    return API.get<NotificationItem[]>(`/notifications/${userId}/`, {
        params: {
            status,
        },
    });
};

export const getUserNotifications = (
    userId: number | string,
    status: NotificationStatus = "all",
) => {
    return getNotifications(userId, status);
};

export const getUnreadNotificationsCount = (userId: number | string) => {
    return API.get<{ count: number }>(`/notifications/${userId}/unread-count/`);
};

export const getNotificationsStats = (userId: number | string) => {
    return API.get<NotificationStats>(`/notifications/${userId}/stats/`);
};

export const markNotificationRead = (notificationId: number | string) => {
    return API.put(`/notifications/${notificationId}/read/`);
};

export const markNotificationAsRead = (notificationId: number | string) => {
    return markNotificationRead(notificationId);
};

export const markAllNotificationsRead = (userId: number | string) => {
    return API.put(`/notifications/read-all/${userId}/`);
};

export const markAllNotificationsAsRead = (userId: number | string) => {
    return markAllNotificationsRead(userId);
};

export const deleteNotification = (notificationId: number | string) => {
    return API.delete(`/notifications/${notificationId}/delete/`);
};