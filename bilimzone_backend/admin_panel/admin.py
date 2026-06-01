from django.contrib import admin

from admin_panel.models import (
    AgreementTemplate,
    UserAgreementAcceptance,
    Category,
    CategoryDirection,
    CategoryOption,
    PlatformCommissionSetting,
)


@admin.register(AgreementTemplate)
class AgreementTemplateAdmin(admin.ModelAdmin):
    list_display = [
        "id",
        "title",
        "audience",
        "context",
        "is_active",
        "created_at",
        "updated_at",
    ]

    list_filter = [
        "audience",
        "context",
        "is_active",
        "created_at",
    ]

    search_fields = [
        "title",
        "text",
    ]


@admin.register(UserAgreementAcceptance)
class UserAgreementAcceptanceAdmin(admin.ModelAdmin):
    list_display = [
        "id",
        "user",
        "agreement",
        "audience",
        "context",
        "accepted_at",
    ]

    list_filter = [
        "audience",
        "context",
        "accepted_at",
    ]

    search_fields = [
        "user__username",
        "user__email",
        "agreement__title",
    ]


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = [
        "id",
        "name_ru",
        "name_kg",
        "is_active",
        "sort_order",
        "created_at",
    ]

    list_filter = [
        "is_active",
        "created_at",
    ]

    search_fields = [
        "name_ru",
        "name_kg",
    ]


@admin.register(CategoryDirection)
class CategoryDirectionAdmin(admin.ModelAdmin):
    list_display = [
        "id",
        "category",
        "name_ru",
        "name_kg",
        "is_active",
        "sort_order",
        "created_at",
    ]

    list_filter = [
        "category",
        "is_active",
        "created_at",
    ]

    search_fields = [
        "name_ru",
        "name_kg",
        "category__name_ru",
    ]


@admin.register(CategoryOption)
class CategoryOptionAdmin(admin.ModelAdmin):
    list_display = [
        "id",
        "category",
        "label_ru",
        "value",
        "is_active",
        "sort_order",
        "created_at",
    ]

    list_filter = [
        "category",
        "is_active",
        "created_at",
    ]

    search_fields = [
        "label_ru",
        "label_kg",
        "value",
        "category__name_ru",
    ]


@admin.register(PlatformCommissionSetting)
class PlatformCommissionSettingAdmin(admin.ModelAdmin):
    list_display = [
        "id",
        "title",
        "commission_percent",
        "is_active",
        "created_at",
        "updated_at",
    ]

    list_filter = [
        "is_active",
        "created_at",
    ]