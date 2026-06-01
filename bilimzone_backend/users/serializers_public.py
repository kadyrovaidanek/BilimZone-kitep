from rest_framework import serializers

from users.models import (
    User,
    ReaderProfile,
    AuthorProfile,
    OrganizationProfile,
)
from publications.models import Publication

def get_role_name(user):
    role = getattr(user, "role", None)

    if not role:
        return None

    if hasattr(role, "name"):
        return role.name

    return str(role)


def get_file_url(request, file_field):
    if not file_field:
        return None

    try:
        return request.build_absolute_uri(file_field.url)
    except Exception:
        return None


def get_user_profile(user):
    role_name = get_role_name(user)

    if role_name == "reader":
        return ReaderProfile.objects.filter(user=user).first()

    if role_name == "author":
        return AuthorProfile.objects.filter(user=user).first()

    if role_name == "organization":
        return OrganizationProfile.objects.filter(user=user).first()

    return None


def build_full_name(profile):
    if not profile:
        return None

    if hasattr(profile, "full_name") and profile.full_name:
        return profile.full_name

    surname = getattr(profile, "surname", None) or ""
    first_name = getattr(profile, "first_name", None) or ""
    father_name = getattr(profile, "father_name", None) or ""

    full_name = f"{surname} {first_name} {father_name}".strip()

    return full_name or None


class PublicUserSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    username = serializers.CharField()
    role_name = serializers.SerializerMethodField()

    photo_url = serializers.SerializerMethodField()

    first_name = serializers.SerializerMethodField()
    surname = serializers.SerializerMethodField()
    father_name = serializers.SerializerMethodField()
    last_name = serializers.SerializerMethodField()
    full_name = serializers.SerializerMethodField()

    organization_name = serializers.SerializerMethodField()

    description = serializers.SerializerMethodField()
    bio = serializers.SerializerMethodField()
    specialization = serializers.SerializerMethodField()

    website = serializers.SerializerMethodField()
    address = serializers.SerializerMethodField()

    rating = serializers.SerializerMethodField()
    total_sales = serializers.SerializerMethodField()

    status = serializers.SerializerMethodField()
    materials_count = serializers.SerializerMethodField()
    created_at = serializers.SerializerMethodField()

    def get_role_name(self, obj):
        return get_role_name(obj)

    def get_photo_url(self, obj):
        request = self.context.get("request")
        profile = get_user_profile(obj)

        if profile and hasattr(profile, "photo"):
            return get_file_url(request, profile.photo)

        return None

    def get_first_name(self, obj):
        profile = get_user_profile(obj)
        return getattr(profile, "first_name", None) if profile else None

    def get_surname(self, obj):
        profile = get_user_profile(obj)
        return getattr(profile, "surname", None) if profile else None

    def get_father_name(self, obj):
        profile = get_user_profile(obj)
        return getattr(profile, "father_name", None) if profile else None

    def get_last_name(self, obj):
        profile = get_user_profile(obj)
        return getattr(profile, "surname", None) if profile else None

    def get_full_name(self, obj):
        profile = get_user_profile(obj)

        value = build_full_name(profile)

        if value:
            return value

        return obj.username

    def get_organization_name(self, obj):
        profile = get_user_profile(obj)

        if profile and hasattr(profile, "organization_name"):
            return profile.organization_name

        return None

    def get_description(self, obj):
        profile = get_user_profile(obj)

        if profile and hasattr(profile, "bio"):
            return profile.bio

        return None

    def get_bio(self, obj):
        profile = get_user_profile(obj)

        if profile and hasattr(profile, "bio"):
            return profile.bio

        return None

    def get_specialization(self, obj):
        profile = get_user_profile(obj)

        if profile and hasattr(profile, "specialization"):
            return profile.specialization

        return None

    def get_website(self, obj):
        profile = get_user_profile(obj)

        if profile and hasattr(profile, "website"):
            return profile.website

        return None

    def get_address(self, obj):
        profile = get_user_profile(obj)

        if profile and hasattr(profile, "address"):
            return profile.address

        return None

    def get_rating(self, obj):
        profile = get_user_profile(obj)

        if profile and hasattr(profile, "rating"):
            return str(profile.rating)

        return None

    def get_total_sales(self, obj):
        profile = get_user_profile(obj)

        if profile and hasattr(profile, "total_sales"):
            return profile.total_sales

        return None

    def get_status(self, obj):
        profile = get_user_profile(obj)

        if profile and getattr(profile, "status", None):
            return profile.status

        return getattr(obj, "status", None)

    def get_materials_count(self, obj):
        return Publication.objects.filter(
            author_user=obj,
            status="published",
        ).count()

    def get_created_at(self, obj):
        return getattr(obj, "created_at", None)


class AdminUserSerializer(PublicUserSerializer):
    email = serializers.SerializerMethodField()
    phone = serializers.SerializerMethodField()
    is_active = serializers.SerializerMethodField()
    all_materials_count = serializers.SerializerMethodField()
    updated_at = serializers.SerializerMethodField()

    def get_email(self, obj):
        return getattr(obj, "email", None)

    def get_phone(self, obj):
        profile = get_user_profile(obj)

        if profile and hasattr(profile, "phone_number"):
            return profile.phone_number

        return None

    def get_is_active(self, obj):
        status_value = getattr(obj, "status", None)

        if status_value == "active":
            return True

        if status_value in ["inactive", "blocked", "deleted"]:
            return False

        return None

    def get_all_materials_count(self, obj):
        return Publication.objects.filter(author_user=obj).count()

    def get_updated_at(self, obj):
        return getattr(obj, "updated_at", None)