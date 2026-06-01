from django.db import models


class CatalogCategory(models.Model):
    slug = models.CharField(max_length=100, unique=True, null=True, blank=True)

    name_ru = models.CharField(max_length=255)
    name_kg = models.CharField(max_length=255, null=True, blank=True)

    description_ru = models.TextField(null=True, blank=True)
    description_kg = models.TextField(null=True, blank=True)

    is_active = models.BooleanField(default=True)
    sort_order = models.PositiveIntegerField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["sort_order", "id"]

    def __str__(self):
        return self.name_ru


class CatalogDirection(models.Model):
    category = models.ForeignKey(
        CatalogCategory,
        on_delete=models.CASCADE,
        related_name="directions"
    )

    name_ru = models.CharField(max_length=255)
    name_kg = models.CharField(max_length=255, null=True, blank=True)

    is_active = models.BooleanField(default=True)
    sort_order = models.PositiveIntegerField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["sort_order", "id"]

    def __str__(self):
        return self.name_ru


class CatalogClassOption(models.Model):
    category = models.ForeignKey(
        CatalogCategory,
        on_delete=models.CASCADE,
        related_name="class_options"
    )

    value = models.CharField(max_length=50)

    is_active = models.BooleanField(default=True)
    sort_order = models.PositiveIntegerField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["sort_order", "id"]

    def __str__(self):
        return self.value