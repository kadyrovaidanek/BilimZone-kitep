from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny

from users.models import User
from .models import Notification
from .serializers import NotificationSerializer


def get_user_or_error(user_id):
    if not user_id:
        return None, Response(
            {"error": "user_id обязателен"},
            status=400,
        )

    try:
        user = User.objects.get(id=user_id)
        return user, None
    except User.DoesNotExist:
        return None, Response(
            {"error": "Пользователь не найден"},
            status=404,
        )


class NotificationListView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]

    def get(self, request, user_id=None):
        query_user_id = user_id or request.GET.get("user_id")

        user, error_response = get_user_or_error(query_user_id)

        if error_response:
            return error_response

        status_filter = request.GET.get("status", "all")
        unread_only = request.GET.get("unread")

        notifications = Notification.objects.filter(
            recipient=user,
        ).order_by("-created_at")

        if status_filter == "unread" or unread_only in ["1", "true", "True"]:
            notifications = notifications.filter(is_read=False)

        if status_filter == "read":
            notifications = notifications.filter(is_read=True)

        serializer = NotificationSerializer(notifications, many=True)

        return Response(serializer.data)


class NotificationUnreadCountView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]

    def get(self, request, user_id=None):
        query_user_id = user_id or request.GET.get("user_id")

        user, error_response = get_user_or_error(query_user_id)

        if error_response:
            return error_response

        count = Notification.objects.filter(
            recipient=user,
            is_read=False,
        ).count()

        return Response({
            "count": count,
        })


class NotificationStatsView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]

    def get(self, request, user_id=None):
        query_user_id = user_id or request.GET.get("user_id")

        user, error_response = get_user_or_error(query_user_id)

        if error_response:
            return error_response

        all_count = Notification.objects.filter(recipient=user).count()
        unread_count = Notification.objects.filter(
            recipient=user,
            is_read=False,
        ).count()
        read_count = Notification.objects.filter(
            recipient=user,
            is_read=True,
        ).count()

        return Response({
            "all": all_count,
            "unread": unread_count,
            "read": read_count,
        })


class NotificationReadView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]

    def put(self, request, notification_id):
        try:
            notification = Notification.objects.get(id=notification_id)
        except Notification.DoesNotExist:
            return Response(
                {"error": "Уведомление не найдено"},
                status=404,
            )

        notification.is_read = True
        notification.save(update_fields=["is_read"])

        return Response({
            "message": "Уведомление отмечено как прочитанное",
        })

    def post(self, request, notification_id):
        return self.put(request, notification_id)


class NotificationReadAllView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]

    def put(self, request, user_id=None):
        query_user_id = (
            user_id
            or request.GET.get("user_id")
            or request.data.get("user_id")
        )

        user, error_response = get_user_or_error(query_user_id)

        if error_response:
            return error_response

        updated_count = Notification.objects.filter(
            recipient=user,
            is_read=False,
        ).update(is_read=True)

        return Response({
            "message": "Все уведомления отмечены как прочитанные",
            "updated_count": updated_count,
        })

    def post(self, request, user_id=None):
        return self.put(request, user_id)


class NotificationDeleteView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]

    def delete(self, request, notification_id):
        try:
            notification = Notification.objects.get(id=notification_id)
        except Notification.DoesNotExist:
            return Response(
                {"error": "Уведомление не найдено"},
                status=404,
            )

        notification.delete()

        return Response({
            "message": "Уведомление удалено",
        })