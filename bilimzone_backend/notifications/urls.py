from django.urls import path

from .views import (
    NotificationListView,
    NotificationUnreadCountView,
    NotificationStatsView,
    NotificationReadView,
    NotificationReadAllView,
    NotificationDeleteView,
)

urlpatterns = [
    path(
        "notifications/",
        NotificationListView.as_view(),
        name="notifications",
    ),
    path(
        "notifications/<int:user_id>/",
        NotificationListView.as_view(),
        name="user_notifications",
    ),

    path(
        "notifications/unread-count/",
        NotificationUnreadCountView.as_view(),
        name="notifications_unread_count",
    ),
    path(
        "notifications/<int:user_id>/unread-count/",
        NotificationUnreadCountView.as_view(),
        name="user_notifications_unread_count",
    ),

    path(
        "notifications/stats/",
        NotificationStatsView.as_view(),
        name="notifications_stats",
    ),
    path(
        "notifications/<int:user_id>/stats/",
        NotificationStatsView.as_view(),
        name="user_notifications_stats",
    ),

    path(
        "notifications/<int:notification_id>/read/",
        NotificationReadView.as_view(),
        name="notification_read",
    ),
    path(
        "notifications/read/<int:notification_id>/",
        NotificationReadView.as_view(),
        name="notification_read_old",
    ),

    path(
        "notifications/read-all/",
        NotificationReadAllView.as_view(),
        name="notifications_read_all",
    ),
    path(
        "notifications/read-all/<int:user_id>/",
        NotificationReadAllView.as_view(),
        name="user_notifications_read_all",
    ),

    path(
        "notifications/<int:notification_id>/delete/",
        NotificationDeleteView.as_view(),
        name="notification_delete",
    ),
]