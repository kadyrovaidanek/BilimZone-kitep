from decimal import Decimal
import random
import uuid

from django.contrib.auth.hashers import make_password, check_password
from django.db import models


def generate_card_number():
    prefix = "9964"
    while True:
        number = prefix + "".join(str(random.randint(0, 9)) for _ in range(12))
        if not BankCard.objects.filter(card_number=number).exists():
            return number


def generate_iban():
    while True:
        iban = "KG" + "".join(str(random.randint(0, 9)) for _ in range(18))
        if not BankAccount.objects.filter(account_number=iban).exists():
            return iban


class BankCustomer(models.Model):
    full_name = models.CharField(max_length=255)
    phone = models.CharField(max_length=30, unique=True)
    email = models.EmailField(unique=True, blank=True, null=True)
    password_hash = models.CharField(max_length=255)
    external_bilimzone_user_id = models.CharField(
        max_length=100,
        blank=True,
        db_index=True,
        help_text="ID пользователя в BilimZone",
    )
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def set_password(self, raw_password):
        self.password_hash = make_password(raw_password)

    def check_password(self, raw_password):
        return check_password(raw_password, self.password_hash)

    def __str__(self):
        return f"{self.full_name} — {self.phone}"


class BankAccount(models.Model):
    CURRENCY_KGS = "KGS"

    customer = models.ForeignKey(
        BankCustomer,
        on_delete=models.CASCADE,
        related_name="accounts",
    )
    account_number = models.CharField(
        max_length=30,
        unique=True,
        default=generate_iban,
    )
    currency = models.CharField(max_length=3, default=CURRENCY_KGS)
    balance = models.DecimalField(
        max_digits=14,
        decimal_places=2,
        default=Decimal("0.00"),
    )
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.customer.full_name} — {self.account_number} — {self.balance} {self.currency}"


class BankCard(models.Model):
    account = models.OneToOneField(
        BankAccount,
        on_delete=models.CASCADE,
        related_name="card",
    )
    card_number = models.CharField(
        max_length=16,
        unique=True,
        default=generate_card_number,
    )
    card_holder = models.CharField(max_length=255)
    expiry_month = models.PositiveSmallIntegerField(default=12)
    expiry_year = models.PositiveSmallIntegerField(default=2030)
    cvv = models.CharField(max_length=3, default="111")
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def masked_number(self):
        return f"{self.card_number[:4]} **** **** {self.card_number[-4:]}"

    def __str__(self):
        return f"{self.card_holder} — {self.masked_number()}"


class BankTransaction(models.Model):
    TYPE_INITIAL = "INITIAL"
    TYPE_CASH_IN = "CASH_IN"
    TYPE_CASH_OUT = "CASH_OUT"
    TYPE_TRANSFER_IN = "TRANSFER_IN"
    TYPE_TRANSFER_OUT = "TRANSFER_OUT"
    TYPE_BILIMZONE_TOP_UP = "BILIMZONE_TOP_UP"
    TYPE_PAYMENT = "PAYMENT"
    TYPE_INCOME = "INCOME"
    TYPE_COMMISSION = "COMMISSION"

    TRANSACTION_TYPES = [
        (TYPE_INITIAL, "Начальный баланс"),
        (TYPE_CASH_IN, "Пополнение"),
        (TYPE_CASH_OUT, "Снятие"),
        (TYPE_TRANSFER_IN, "Входящий перевод"),
        (TYPE_TRANSFER_OUT, "Исходящий перевод"),
        (TYPE_BILIMZONE_TOP_UP, "Пополнение BilimZone"),
        (TYPE_PAYMENT, "Оплата"),
        (TYPE_INCOME, "Доход владельца"),
        (TYPE_COMMISSION, "Комиссия системы"),
    ]

    STATUS_SUCCESS = "SUCCESS"
    STATUS_FAILED = "FAILED"

    STATUSES = [
        (STATUS_SUCCESS, "Успешно"),
        (STATUS_FAILED, "Ошибка"),
    ]

    transaction_id = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    account = models.ForeignKey(
        BankAccount,
        on_delete=models.CASCADE,
        related_name="transactions",
    )
    target_account = models.ForeignKey(
        BankAccount,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="incoming_transactions",
    )
    transaction_type = models.CharField(max_length=40, choices=TRANSACTION_TYPES)
    status = models.CharField(max_length=20, choices=STATUSES, default=STATUS_SUCCESS)
    amount = models.DecimalField(max_digits=14, decimal_places=2)
    currency = models.CharField(max_length=3, default=BankAccount.CURRENCY_KGS)
    description = models.CharField(max_length=500, blank=True)
    external_service = models.CharField(max_length=100, blank=True)
    external_user_id = models.CharField(max_length=100, blank=True)
    external_reference = models.CharField(max_length=100, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return (
            f"{self.transaction_type} — {self.amount} {self.currency} — {self.status}"
        )


class BankConfirmationCode(models.Model):
    PURPOSE_PURCHASE = "PURCHASE"
    PURPOSE_TOP_UP = "TOP_UP"

    PURPOSE_CHOICES = [
        (PURPOSE_PURCHASE, "Покупка BilimZone"),
        (PURPOSE_TOP_UP, "Пополнение BilimZone"),
    ]

    STATUS_PENDING = "PENDING"
    STATUS_USED = "USED"
    STATUS_EXPIRED = "EXPIRED"

    STATUS_CHOICES = [
        (STATUS_PENDING, "Ожидает подтверждения"),
        (STATUS_USED, "Использован"),
        (STATUS_EXPIRED, "Истёк"),
    ]

    customer = models.ForeignKey(
        BankCustomer,
        on_delete=models.CASCADE,
        related_name="confirmation_codes",
    )

    code = models.CharField(max_length=6)
    purpose = models.CharField(max_length=30, choices=PURPOSE_CHOICES)
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default=STATUS_PENDING,
    )

    amount = models.DecimalField(max_digits=14, decimal_places=2)
    currency = models.CharField(max_length=3, default=BankAccount.CURRENCY_KGS)

    external_reference = models.CharField(max_length=100, db_index=True)
    description = models.CharField(max_length=500, blank=True)

    payload = models.JSONField(default=dict, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    used_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return (
            f"{self.customer.full_name} — {self.purpose} — {self.code} — {self.status}"
        )
