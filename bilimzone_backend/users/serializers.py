import json
import os

from rest_framework import serializers

from admin_panel.models import AgreementTemplate, UserAgreementAcceptance

from .models import (
    User,
    Role,
    ReaderProfile,
    AuthorProfile,
    OrganizationProfile,
    ManagerProfile,
)


ALLOWED_IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png"]


def normalize_name(value):
    if not value:
        return None

    return value.strip().title()


def normalize_text(value):
    if not value:
        return None

    return value.strip()


def parse_json_field(value):
    if not value:
        return {}

    if isinstance(value, dict):
        return value

    if isinstance(value, str):
        try:
            return json.loads(value)
        except json.JSONDecodeError:
            return {}

    return {}


def get_active_registration_agreement(role_name, agreement_id):
    audience_values = [role_name, "all"]

    if role_name in ["author", "organization"]:
        audience_values.append("author_organization")

    agreements = AgreementTemplate.objects.filter(
        is_active=True,
        context__in=["registration", "all"],
        audience__in=audience_values,
    )

    if agreement_id:
        agreements = agreements.filter(id=agreement_id)

    return agreements.order_by("-updated_at", "-created_at").first()


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    role = serializers.CharField(write_only=True)

    reader = serializers.CharField(write_only=True, required=False)
    author = serializers.CharField(write_only=True, required=False)
    organization = serializers.CharField(write_only=True, required=False)

    photo = serializers.ImageField(write_only=True, required=False, allow_null=True)

    agreement_accepted = serializers.BooleanField(
        write_only=True,
        required=False,
        default=False,
    )

    agreement_id = serializers.IntegerField(
        write_only=True,
        required=False,
        allow_null=True,
    )

    class Meta:
        model = User
        fields = [
            "email",
            "password",
            "username",
            "role",
            "reader",
            "author",
            "organization",
            "photo",
            "agreement_accepted",
            "agreement_id",
        ]

    def validate_username(self, value):
        value = value.strip()

        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError(
                "Такой пользователь с таким логином уже существует"
            )

        return value

    def validate_email(self, value):
        value = value.strip().lower()

        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError(
                "Такой пользователь с таким email уже существует"
            )

        return value

    def validate_photo(self, value):
        if not value:
            return value

        ext = os.path.splitext(value.name)[1].lower()

        if ext not in ALLOWED_IMAGE_EXTENSIONS:
            raise serializers.ValidationError(
                "Формат изображения не поддерживается. Можно загрузить только JPG, JPEG или PNG."
            )

        return value

    def validate(self, attrs):
        role_name = attrs.get("role", "").strip().lower()
        agreement_accepted = attrs.get("agreement_accepted", False)
        agreement_id = attrs.get("agreement_id")

        allowed_roles = [
            "reader",
            "author",
            "organization",
            "manager_admin",
        ]

        if role_name not in allowed_roles:
            raise serializers.ValidationError({
                "role": "Неверный тип пользователя"
            })

        if role_name != "manager_admin":
            if not agreement_accepted:
                raise serializers.ValidationError({
                    "agreement_accepted": "Необходимо принять пользовательское соглашение"
                })

            agreement = get_active_registration_agreement(
                role_name=role_name,
                agreement_id=agreement_id,
            )

            if not agreement:
                raise serializers.ValidationError({
                    "agreement_id": "Активный договор для регистрации не найден"
                })

            attrs["_agreement"] = agreement

        return attrs

    def create(self, validated_data):
        reader_data = parse_json_field(validated_data.pop("reader", None))
        author_data = parse_json_field(validated_data.pop("author", None))
        organization_data = parse_json_field(validated_data.pop("organization", None))

        photo = validated_data.pop("photo", None)
        role_name = validated_data.pop("role").strip().lower()

        validated_data.pop("agreement_accepted", None)
        validated_data.pop("agreement_id", None)
        agreement = validated_data.pop("_agreement", None)

        role_obj, _ = Role.objects.get_or_create(name=role_name)

        user = User.create_user(
            email=validated_data["email"],
            password=validated_data["password"],
            username=validated_data["username"],
            role=role_obj,
        )

        if role_name == "reader":
            ReaderProfile.objects.create(
                user=user,
                username=user.username,
                email=user.email,
                password=user.password,
                first_name=normalize_name(reader_data.get("first_name")),
                surname=normalize_name(reader_data.get("surname")),
                father_name=normalize_name(reader_data.get("father_name")),
                phone_number=normalize_text(reader_data.get("phone_number")),
                photo=photo,
                status=user.status,
            )

        elif role_name == "author":
            AuthorProfile.objects.create(
                user=user,
                username=user.username,
                email=user.email,
                password=user.password,
                first_name=normalize_name(author_data.get("first_name")),
                surname=normalize_name(author_data.get("surname")),
                father_name=normalize_name(author_data.get("father_name")),
                phone_number=normalize_text(author_data.get("phone_number")),
                bio=normalize_text(author_data.get("bio")),
                specialization=normalize_text(author_data.get("specialization")),
                photo=photo,
                status=user.status,
            )

        elif role_name == "organization":
            OrganizationProfile.objects.create(
                user=user,
                username=user.username,
                email=user.email,
                password=user.password,
                organization_name=normalize_text(
                    organization_data.get("organization_name")
                ),
                full_name=normalize_text(organization_data.get("full_name")),
                bio=normalize_text(organization_data.get("bio")),
                address=normalize_text(organization_data.get("address")),
                website=normalize_text(organization_data.get("website")),
                photo=photo,
                status=user.status,
            )

        elif role_name == "manager_admin":
            ManagerProfile.objects.create(user=user)

        if agreement:
            UserAgreementAcceptance.objects.create(
                user=user,
                agreement=agreement,
                audience=role_name,
                context="registration",
            )

        return user