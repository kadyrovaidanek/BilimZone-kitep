from django.db import models

from users.models import User
from .publication import Publication


class PublicationReview(models.Model):
    publication = models.ForeignKey(
        Publication,
        on_delete=models.CASCADE,
        related_name="reviews",
    )

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="publication_reviews",
    )

    rating = models.PositiveSmallIntegerField()
    text = models.TextField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("publication", "user")
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.publication.title} - {self.user.username} - {self.rating}"