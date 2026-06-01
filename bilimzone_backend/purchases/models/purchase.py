from django.db import models

from users.models import User
from publications.models import Publication


class PublicationPurchase(models.Model):
    buyer = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="publication_purchases",
    )

    publication = models.ForeignKey(
        Publication,
        on_delete=models.CASCADE,
        related_name="purchases",
    )

    amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0,
    )

    owner_amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0,
    )

    system_amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0,
    )

    bank_response = models.JSONField(
        null=True,
        blank=True,
    )

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("buyer", "publication")
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.buyer.username} купил {self.publication.title}"