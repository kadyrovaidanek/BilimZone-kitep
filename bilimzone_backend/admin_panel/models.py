from django.db import models
from users.models import User


class AgreementTemplate(models.Model):
    AUDIENCE_CHOICES = [
        ("all", "Все пользователи"),
        ("reader", "Читатель"),
        ("author", "Автор"),
        ("organization", "Организация"),
        ("author_organization", "Автор и организация"),
    ]

    CONTEXT_CHOICES = [
        ("registration", "Регистрация"),
        ("paid_material", "Платный материал"),
        ("publication", "Публикация материала"),
        ("all", "Везде"),
    ]

    title = models.CharField(max_length=255)

    audience = models.CharField(
        max_length=50,
        choices=AUDIENCE_CHOICES,
        default="all",
    )

    context = models.CharField(
        max_length=50,
        choices=CONTEXT_CHOICES,
        default="registration",
    )

    text = models.TextField(null=True, blank=True)
    file = models.FileField(upload_to="agreements/", null=True, blank=True)

    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.title


class UserAgreementAcceptance(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="agreement_acceptances",
    )

    agreement = models.ForeignKey(
        AgreementTemplate,
        on_delete=models.PROTECT,
        related_name="acceptances",
    )

    audience = models.CharField(max_length=50)
    context = models.CharField(max_length=50)

    accepted_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-accepted_at"]

    def __str__(self):
        return f"{self.user.username} accepted {self.agreement.title}"


class Category(models.Model):
    name_ru = models.CharField(max_length=255)
    name_kg = models.CharField(max_length=255, null=True, blank=True)

    is_active = models.BooleanField(default=True)
    sort_order = models.IntegerField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name_ru


class CategoryDirection(models.Model):
    category = models.ForeignKey(
        Category,
        on_delete=models.CASCADE,
        related_name="directions",
    )

    name_ru = models.CharField(max_length=255)
    name_kg = models.CharField(max_length=255, null=True, blank=True)

    is_active = models.BooleanField(default=True)
    sort_order = models.IntegerField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.category.name_ru} → {self.name_ru}"


class CategoryOption(models.Model):
    category = models.ForeignKey(
        Category,
        on_delete=models.CASCADE,
        related_name="options",
    )

    label_ru = models.CharField(max_length=255, default="Выберите класс")
    label_kg = models.CharField(max_length=255, null=True, blank=True)

    value = models.CharField(max_length=100)

    is_active = models.BooleanField(default=True)
    sort_order = models.IntegerField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.category.name_ru} → {self.value}"


class PlatformCommissionSetting(models.Model):
    title = models.CharField(
        max_length=255,
        default="Комиссия платформы",
    )

    commission_percent = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=20,
    )

    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.title}: {self.commission_percent}%"