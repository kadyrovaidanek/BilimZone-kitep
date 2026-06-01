from decimal import Decimal

from rest_framework import serializers

from .models import (
    BankCustomer,
    BankAccount,
    BankCard,
    BankTransaction,
    BankConfirmationCode,
)


class BankCardSerializer(serializers.ModelSerializer):
    masked_number = serializers.CharField(read_only=True)

    class Meta:
        model = BankCard
        fields = [
            "id",
            "card_number",
            "masked_number",
            "card_holder",
            "expiry_month",
            "expiry_year",
            "cvv",
            "is_active",
            "created_at",
        ]


class BankAccountSerializer(serializers.ModelSerializer):
    card = BankCardSerializer(read_only=True)

    class Meta:
        model = BankAccount
        fields = [
            "id",
            "account_number",
            "currency",
            "balance",
            "is_active",
            "created_at",
            "card",
        ]


class BankCustomerSerializer(serializers.ModelSerializer):
    accounts = BankAccountSerializer(many=True, read_only=True)

    class Meta:
        model = BankCustomer
        fields = [
            "id",
            "full_name",
            "phone",
            "email",
            "external_bilimzone_user_id",
            "is_active",
            "created_at",
            "accounts",
        ]


class BankTransactionSerializer(serializers.ModelSerializer):
    card_number = serializers.CharField(
        source="account.card.card_number", read_only=True
    )
    account_number = serializers.CharField(
        source="account.account_number", read_only=True
    )
    target_account_number = serializers.CharField(
        source="target_account.account_number", read_only=True
    )

    class Meta:
        model = BankTransaction
        fields = [
            "id",
            "transaction_id",
            "account",
            "account_number",
            "card_number",
            "target_account",
            "target_account_number",
            "transaction_type",
            "status",
            "amount",
            "currency",
            "description",
            "external_service",
            "external_user_id",
            "external_reference",
            "created_at",
        ]


class RegisterCustomerSerializer(serializers.Serializer):
    full_name = serializers.CharField(max_length=255)
    phone = serializers.CharField(max_length=30)
    email = serializers.EmailField(required=False, allow_blank=True)
    password = serializers.CharField(min_length=4, max_length=128)
    initial_balance = serializers.DecimalField(
        max_digits=14,
        decimal_places=2,
        min_value=Decimal("0.00"),
        required=False,
        default=Decimal("1000.00"),
    )
    external_bilimzone_user_id = serializers.CharField(
        max_length=100,
        required=False,
        allow_blank=True,
    )


class LoginSerializer(serializers.Serializer):
    phone = serializers.CharField(max_length=30)
    password = serializers.CharField(max_length=128)


class CardAmountSerializer(serializers.Serializer):
    card_number = serializers.CharField(max_length=16)
    amount = serializers.DecimalField(
        max_digits=14,
        decimal_places=2,
        min_value=Decimal("1.00"),
    )
    description = serializers.CharField(
        max_length=500,
        required=False,
        allow_blank=True,
    )


class TransferSerializer(serializers.Serializer):
    from_card = serializers.CharField(max_length=16)
    to_card = serializers.CharField(max_length=16)
    amount = serializers.DecimalField(
        max_digits=14,
        decimal_places=2,
        min_value=Decimal("1.00"),
    )
    description = serializers.CharField(
        max_length=500,
        required=False,
        allow_blank=True,
    )


class BilimZoneTopUpSerializer(serializers.Serializer):
    card_number = serializers.CharField(max_length=16)
    amount = serializers.DecimalField(
        max_digits=14,
        decimal_places=2,
        min_value=Decimal("1.00"),
    )
    bilimzone_user_id = serializers.CharField(max_length=100)
    description = serializers.CharField(
        max_length=500,
        required=False,
        allow_blank=True,
    )


class PaymentSerializer(serializers.Serializer):
    card_number = serializers.CharField(max_length=16)
    amount = serializers.DecimalField(
        max_digits=14,
        decimal_places=2,
        min_value=Decimal("1.00"),
    )
    merchant = serializers.CharField(
        max_length=255, required=False, default="BilimZone"
    )
    external_reference = serializers.CharField(
        max_length=100, required=False, allow_blank=True
    )


class BilimZoneUserSyncSerializer(serializers.Serializer):
    bilimzone_user_id = serializers.CharField(max_length=100)
    username = serializers.CharField(max_length=255, required=False, allow_blank=True)
    email = serializers.EmailField(required=False, allow_blank=True)
    role = serializers.CharField(max_length=50, required=False, allow_blank=True)


class CardVerifySerializer(serializers.Serializer):
    card_number = serializers.CharField(max_length=16)
    expiry_month = serializers.IntegerField(min_value=1, max_value=12)
    expiry_year = serializers.IntegerField()
    cvv = serializers.CharField(max_length=3)


class CardConfirmSerializer(serializers.Serializer):
    card_number = serializers.CharField(max_length=16)
    code = serializers.CharField(max_length=6)


class CardVerifySerializer(serializers.Serializer):
    card_number = serializers.CharField(max_length=16)
    expiry_month = serializers.IntegerField(min_value=1, max_value=12)
    expiry_year = serializers.IntegerField()
    cvv = serializers.CharField(max_length=3)


class CardConfirmSerializer(serializers.Serializer):
    card_number = serializers.CharField(max_length=16)
    code = serializers.CharField(max_length=6)


class BankConfirmationCodeSerializer(serializers.ModelSerializer):
    customer_name = serializers.CharField(
        source="customer.full_name",
        read_only=True,
    )

    masked_card = serializers.SerializerMethodField()

    class Meta:
        model = BankConfirmationCode
        fields = [
            "id",
            "customer",
            "customer_name",
            "code",
            "purpose",
            "status",
            "amount",
            "currency",
            "external_reference",
            "description",
            "payload",
            "masked_card",
            "created_at",
            "used_at",
        ]

    def get_masked_card(self, obj):
        account = obj.customer.accounts.filter(is_active=True).first()

        if account and hasattr(account, "card"):
            return account.card.masked_number()

        return None


class BilimZoneCreatePurchaseCodeSerializer(serializers.Serializer):
    buyer_bilimzone_user_id = serializers.CharField(max_length=100)
    owner_bilimzone_user_id = serializers.CharField(max_length=100)
    system_bilimzone_user_id = serializers.CharField(
        max_length=100,
        required=False,
        default="bilimzone_system",
    )

    amount = serializers.DecimalField(max_digits=14, decimal_places=2)
    owner_amount = serializers.DecimalField(max_digits=14, decimal_places=2)
    system_amount = serializers.DecimalField(max_digits=14, decimal_places=2)

    publication_id = serializers.CharField(max_length=100)
    publication_title = serializers.CharField(max_length=255)
    description = serializers.CharField(
        max_length=500,
        required=False,
        allow_blank=True,
    )


class BankConfirmationCodeSerializer(serializers.ModelSerializer):
    customer_name = serializers.CharField(
        source="customer.full_name",
        read_only=True,
    )

    masked_card = serializers.SerializerMethodField()

    class Meta:
        model = BankConfirmationCode
        fields = [
            "id",
            "customer",
            "customer_name",
            "code",
            "purpose",
            "status",
            "amount",
            "currency",
            "external_reference",
            "description",
            "payload",
            "masked_card",
            "created_at",
            "used_at",
        ]

    def get_masked_card(self, obj):
        account = obj.customer.accounts.filter(is_active=True).first()

        if account and hasattr(account, "card"):
            return account.card.masked_number()

        return None


class BilimZoneCreatePurchaseCodeSerializer(serializers.Serializer):
    buyer_bilimzone_user_id = serializers.CharField(max_length=100)
    owner_bilimzone_user_id = serializers.CharField(max_length=100)
    system_bilimzone_user_id = serializers.CharField(
        max_length=100,
        required=False,
        default="bilimzone_system",
    )

    amount = serializers.DecimalField(max_digits=14, decimal_places=2)
    owner_amount = serializers.DecimalField(max_digits=14, decimal_places=2)
    system_amount = serializers.DecimalField(max_digits=14, decimal_places=2)

    publication_id = serializers.CharField(max_length=100)
    publication_title = serializers.CharField(max_length=255)
    description = serializers.CharField(
        max_length=500,
        required=False,
        allow_blank=True,
    )


class BilimZoneConfirmPurchaseCodeSerializer(serializers.Serializer):
    confirmation_id = serializers.IntegerField(required=False)
    external_reference = serializers.CharField(
        max_length=100,
        required=False,
        allow_blank=True,
    )
    code = serializers.CharField(max_length=6)


class BilimZoneWalletCreateCodeSerializer(serializers.Serializer):
    ACTION_DEPOSIT = "deposit"
    ACTION_WITHDRAW = "withdraw"

    ACTION_CHOICES = [
        (ACTION_DEPOSIT, "Пополнение"),
        (ACTION_WITHDRAW, "Вывод"),
    ]

    action = serializers.ChoiceField(choices=ACTION_CHOICES)

    bilimzone_user_id = serializers.CharField(max_length=100)

    card_number = serializers.CharField(max_length=16)
    expiry_month = serializers.IntegerField(min_value=1, max_value=12)
    expiry_year = serializers.IntegerField()
    cvv = serializers.CharField(max_length=4)

    amount = serializers.DecimalField(
        max_digits=14,
        decimal_places=2,
        min_value=Decimal("1.00"),
    )

    description = serializers.CharField(
        max_length=500,
        required=False,
        allow_blank=True,
    )


class BilimZoneWalletConfirmCodeSerializer(serializers.Serializer):
    confirmation_id = serializers.IntegerField(required=False)
    external_reference = serializers.CharField(
        max_length=100,
        required=False,
        allow_blank=True,
    )
    code = serializers.CharField(max_length=6)
