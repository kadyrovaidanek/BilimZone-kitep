import random
from datetime import timedelta

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from django.contrib.auth.hashers import check_password, make_password
from django.conf import settings
from .services.email_service import send_verification_email
from django.utils import timezone
from rest_framework_simplejwt.tokens import RefreshToken

from rest_framework.decorators import (
    api_view,
    authentication_classes,
    permission_classes,
)
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.permissions import AllowAny

from .models import (
    User,
    ReaderProfile,
    AuthorProfile,
    OrganizationProfile,
    EmailVerificationCode,
)

from .serializers import RegisterSerializer


def file_url(request, file_field):
    if not file_field:
        return None

    try:
        return request.build_absolute_uri(file_field.url)
    except Exception:
        return None


def normalize_name(value):
    if not value:
        return None
    return value.strip().title()


def normalize_text(value):
    if not value:
        return None
    return value.strip()


def get_profile_response(user, request):
    role = user.role.name

    base = {
        "id": user.id,
        "email": user.email,
        "username": user.username,
        "role": role,
        "status": user.status,
        "created_at": user.created_at,
        "profile": None,
    }

    if role == "reader":
        profile = ReaderProfile.objects.filter(user=user).first()

        if profile:
            base["profile"] = {
                "id": profile.id,
                "email": profile.email,
                "username": profile.username,
                "surname": profile.surname,
                "first_name": profile.first_name,
                "father_name": profile.father_name,
                "phone_number": profile.phone_number,
                "photo": file_url(request, profile.photo),
                "status": profile.status,
                "created_at": profile.created_at,
            }

    elif role == "author":
        profile = AuthorProfile.objects.filter(user=user).first()

        if profile:
            base["profile"] = {
                "id": profile.id,
                "email": profile.email,
                "username": profile.username,
                "surname": profile.surname,
                "first_name": profile.first_name,
                "father_name": profile.father_name,
                "phone_number": profile.phone_number,
                "photo": file_url(request, profile.photo),
                "bio": profile.bio,
                "specialization": profile.specialization,
                "rating": str(profile.rating),
                "total_sales": profile.total_sales,
                "status": profile.status,
                "created_at": profile.created_at,
            }

    elif role == "organization":
        profile = OrganizationProfile.objects.filter(user=user).first()

        if profile:
            base["profile"] = {
                "id": profile.id,
                "email": profile.email,
                "username": profile.username,
                "organization_name": profile.organization_name,
                "full_name": profile.full_name,
                "bio": profile.bio,
                "address": profile.address,
                "website": profile.website,
                "photo": file_url(request, profile.photo),
                "status": profile.status,
                "created_at": profile.created_at,
            }

    elif role == "manager_admin":
        base["profile"] = {
            "id": user.id,
            "email": user.email,
            "username": user.username,
            "status": user.status,
            "created_at": user.created_at,
        }

    return base


class SendRegistrationCodeView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email", "").strip().lower()

        if not email or "@" not in email:
            return Response(
                {"email": "Введите корректный email"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if User.objects.filter(email=email).exists():
            return Response(
                {"email": "Пользователь с таким email уже существует"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        code = str(random.randint(1000, 9999))

        EmailVerificationCode.objects.update_or_create(
            email=email,
            purpose="registration",
            defaults={
                "code": code,
                "attempts": 0,
                "expires_at": timezone.now() + timedelta(minutes=10),
            },
        )

        try:
            send_verification_email(email, code)
        except Exception as exc:
            return Response(
                {
                    "email": f"Не удалось отправить код подтверждения: {type(exc).__name__}: {str(exc)}"
                },
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )
        except Exception as exc:
            return Response(
                {
                    "email": f"Не удалось отправить код подтверждения: {type(exc).__name__}: {str(exc)}"
                },
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )

        return Response(
            {"message": "Код подтверждения отправлен на email"},
            status=status.HTTP_200_OK,
        )


class VerifyRegistrationCodeView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email", "").strip().lower()
        code = request.data.get("code", "").strip()

        if not email or "@" not in email:
            return Response(
                {"email": "Введите корректный email"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not code:
            return Response(
                {"verification_code": "Введите код подтверждения"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        verification = EmailVerificationCode.objects.filter(
            email=email,
            purpose="registration",
        ).first()

        if not verification:
            return Response(
                {"verification_code": "Сначала запросите код подтверждения"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if verification.expires_at < timezone.now():
            verification.delete()
            return Response(
                {"verification_code": "Код истёк. Запросите новый код"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if verification.code != code:
            verification.attempts += 1
            verification.save(update_fields=["attempts"])

            return Response(
                {"verification_code": "Неверный код подтверждения"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response(
            {"message": "Код подтверждён"},
            status=status.HTTP_200_OK,
        )


class RegisterView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def post(self, request):
        email = request.data.get("email", "").strip().lower()
        verification_code = request.data.get("verification_code", "").strip()

        if not verification_code:
            return Response(
                {"verification_code": "Введите код подтверждения"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        verification = EmailVerificationCode.objects.filter(
            email=email,
            purpose="registration",
        ).first()

        if not verification:
            return Response(
                {"verification_code": "Сначала запросите код подтверждения"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if verification.expires_at < timezone.now():
            verification.delete()
            return Response(
                {"verification_code": "Код истёк. Запросите новый код"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if verification.code != verification_code:
            verification.attempts += 1
            verification.save(update_fields=["attempts"])

            return Response(
                {"verification_code": "Неверный код подтверждения"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer = RegisterSerializer(
            data=request.data,
            context={"request": request},
        )

        if serializer.is_valid():
            user = serializer.save()
            verification.delete()

            return Response(
                {
                    "message": "User created successfully",
                    "user": {
                        "id": user.id,
                        "email": user.email,
                        "username": user.username,
                        "role": user.role.name,
                    },
                },
                status=status.HTTP_201_CREATED,
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]

    def post(self, request):
        identifier = request.data.get("identifier")
        password = request.data.get("password")

        if not identifier or not password:
            return Response(
                {"error": "Введите логин/email и пароль"},
                status=400,
            )

        try:
            if "@" in identifier:
                user = User.objects.get(email=identifier)
            else:
                user = User.objects.get(username=identifier)
        except User.DoesNotExist:
            return Response({"error": "Пользователь не найден"}, status=400)

        if not check_password(password, user.password):
            return Response({"error": "Неверный пароль"}, status=400)

        refresh = RefreshToken.for_user(user)

        return Response(
            {
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "user": {
                    "id": user.id,
                    "email": user.email,
                    "username": user.username,
                    "role": user.role.name,
                },
            }
        )


class ProfileView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get(self, request):
        user_id = request.GET.get("user_id")

        if not user_id:
            return Response({"error": "user_id is required"}, status=400)

        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=404)

        return Response(get_profile_response(user, request))

    def put(self, request):
        user_id = request.GET.get("user_id")

        if not user_id:
            return Response({"error": "user_id is required"}, status=400)

        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=404)

        role = user.role.name

        username = request.data.get("username")
        email = request.data.get("email")

        if username and username != user.username:
            if User.objects.filter(username=username).exclude(id=user.id).exists():
                return Response(
                    {"username": "Такой логин уже существует"},
                    status=400,
                )

            user.username = normalize_text(username)

        if email and email != user.email:
            if User.objects.filter(email=email).exclude(id=user.id).exists():
                return Response(
                    {"email": "Такой email уже существует"},
                    status=400,
                )

            user.email = normalize_text(email).lower()

        old_password = request.data.get("old_password")
        new_password = request.data.get("new_password")

        if new_password:
            if not old_password:
                return Response({"password": "Введите старый пароль"}, status=400)

            if not check_password(old_password, user.password):
                return Response({"password": "Старый пароль неверный"}, status=400)

            user.password = make_password(new_password)

        user.save()

        photo = request.FILES.get("photo")

        if role == "reader":
            profile = ReaderProfile.objects.filter(user=user).first()

            if profile:
                profile.username = user.username
                profile.email = user.email
                profile.password = user.password
                profile.surname = normalize_name(request.data.get("surname"))
                profile.first_name = normalize_name(request.data.get("first_name"))
                profile.father_name = normalize_name(request.data.get("father_name"))
                profile.phone_number = normalize_text(request.data.get("phone_number"))

                if photo:
                    profile.photo = photo

                profile.save()

        elif role == "author":
            profile = AuthorProfile.objects.filter(user=user).first()

            if profile:
                profile.username = user.username
                profile.email = user.email
                profile.password = user.password
                profile.surname = normalize_name(request.data.get("surname"))
                profile.first_name = normalize_name(request.data.get("first_name"))
                profile.father_name = normalize_name(request.data.get("father_name"))
                profile.phone_number = normalize_text(request.data.get("phone_number"))
                profile.specialization = normalize_text(
                    request.data.get("specialization")
                )
                profile.bio = normalize_text(request.data.get("bio"))

                if photo:
                    profile.photo = photo

                profile.save()

        elif role == "organization":
            profile = OrganizationProfile.objects.filter(user=user).first()

            if profile:
                profile.username = user.username
                profile.email = user.email
                profile.password = user.password
                profile.organization_name = normalize_text(
                    request.data.get("organization_name")
                )
                profile.full_name = normalize_text(request.data.get("full_name"))
                profile.bio = normalize_text(request.data.get("bio"))
                profile.address = normalize_text(request.data.get("address"))
                profile.website = normalize_text(request.data.get("website"))

                if photo:
                    profile.photo = photo

                profile.save()

        return Response(get_profile_response(user, request))


@api_view(["GET"])
@authentication_classes([])
@permission_classes([AllowAny])
def check_username(request):
    username = request.GET.get("username", "").strip()

    if not username:
        return Response({"exists": False})

    exists = User.objects.filter(username=username).exists()

    return Response(
        {
            "exists": exists,
            "message": (
                "Такой пользователь с таким логином уже существует" if exists else ""
            ),
        }
    )


@api_view(["GET"])
@authentication_classes([])
@permission_classes([AllowAny])
def check_email(request):
    email = request.GET.get("email", "").strip().lower()

    if not email:
        return Response({"exists": False})

    exists = User.objects.filter(email=email).exists()

    return Response(
        {
            "exists": exists,
            "message": (
                "Такой пользователь с таким email уже существует" if exists else ""
            ),
        }
    )
