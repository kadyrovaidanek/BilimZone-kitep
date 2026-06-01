from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny

from users.models import User
from publications.models import Publication
from publications.serializers import PublicationSerializer
from .serializers_public import (
    PublicUserSerializer,
    AdminUserSerializer,
)


class PublicUserListView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]

    def get(self, request):
        search = request.GET.get("search", "").strip()
        role = request.GET.get("role", "").strip()

        users = User.objects.all().order_by("-id")

        if search:
            users = users.filter(username__icontains=search)

        if role:
            users = users.filter(role__name=role)

        serializer = PublicUserSerializer(
            users,
            many=True,
            context={"request": request},
        )

        return Response(serializer.data)


class PublicUserDetailView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]

    def get(self, request, user_id):
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response(
                {"error": "Пользователь не найден"},
                status=status.HTTP_404_NOT_FOUND,
            )

        user_serializer = PublicUserSerializer(
            user,
            context={"request": request},
        )

        materials = Publication.objects.select_related(
            "author_user",
            "category",
            "direction",
            "option",
        ).filter(
            author_user=user,
            status="published",
        ).order_by("-published_at", "-created_at")

        materials_serializer = PublicationSerializer(
            materials,
            many=True,
            context={"request": request},
        )

        return Response({
            "user": user_serializer.data,
            "materials": materials_serializer.data,
        })


class AdminUserListView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]

    def get(self, request):
        search = request.GET.get("search", "").strip()
        role = request.GET.get("role", "").strip()

        users = User.objects.all().order_by("-id")

        if search:
            users = users.filter(username__icontains=search)

        if role:
            users = users.filter(role__name=role)

        serializer = AdminUserSerializer(
            users,
            many=True,
            context={"request": request},
        )

        return Response(serializer.data)


class AdminUserDetailView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]

    def get(self, request, user_id):
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response(
                {"error": "Пользователь не найден"},
                status=status.HTTP_404_NOT_FOUND,
            )

        user_serializer = AdminUserSerializer(
            user,
            context={"request": request},
        )

        materials = Publication.objects.select_related(
            "author_user",
            "category",
            "direction",
            "option",
        ).filter(
            author_user=user,
        ).order_by("-created_at")

        materials_serializer = PublicationSerializer(
            materials,
            many=True,
            context={"request": request},
        )

        return Response({
            "user": user_serializer.data,
            "materials": materials_serializer.data,
        })