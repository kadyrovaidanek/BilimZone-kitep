from django.contrib import admin

from purchases.models import PublicationPurchase


@admin.register(PublicationPurchase)
class PublicationPurchaseAdmin(admin.ModelAdmin):
    list_display = [
        "id",
        "buyer",
        "publication",
        "amount",
        "owner_amount",
        "system_amount",
        "created_at",
    ]

    list_filter = [
        "created_at",
    ]

    search_fields = [
        "buyer__username",
        "publication__title",
    ]

    readonly_fields = [
        "created_at",
    ]