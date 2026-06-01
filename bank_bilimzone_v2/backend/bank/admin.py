from django.contrib import admin

from .models import BankCustomer, BankAccount, BankCard, BankTransaction


@admin.register(BankCustomer)
class BankCustomerAdmin(admin.ModelAdmin):
    list_display = ("id", "full_name", "phone", "email", "external_bilimzone_user_id", "is_active", "created_at")
    search_fields = ("full_name", "phone", "email", "external_bilimzone_user_id")
    list_filter = ("is_active", "created_at")


@admin.register(BankAccount)
class BankAccountAdmin(admin.ModelAdmin):
    list_display = ("id", "customer", "account_number", "currency", "balance", "is_active", "created_at")
    search_fields = ("customer__full_name", "account_number")
    list_filter = ("currency", "is_active", "created_at")


@admin.register(BankCard)
class BankCardAdmin(admin.ModelAdmin):
    list_display = ("id", "card_holder", "card_number", "account", "is_active", "created_at")
    search_fields = ("card_holder", "card_number", "account__account_number")
    list_filter = ("is_active", "created_at")


@admin.register(BankTransaction)
class BankTransactionAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "transaction_id",
        "account",
        "transaction_type",
        "status",
        "amount",
        "currency",
        "external_service",
        "external_user_id",
        "created_at",
    )
    search_fields = (
        "transaction_id",
        "account__account_number",
        "account__card__card_number",
        "description",
        "external_service",
        "external_user_id",
        "external_reference",
    )
    list_filter = ("transaction_type", "status", "currency", "external_service", "created_at")
