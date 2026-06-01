from rest_framework import serializers

from publications.models import PublicationReview


class AdminPublicationReviewSerializer(serializers.ModelSerializer):
    username = serializers.CharField(
        source="user.username",
        read_only=True,
    )

    publication_title = serializers.CharField(
        source="publication.title",
        read_only=True,
    )

    publication_id = serializers.IntegerField(
        source="publication.id",
        read_only=True,
    )

    class Meta:
        model = PublicationReview
        fields = [
            "id",
            "publication_id",
            "publication_title",
            "user",
            "username",
            "rating",
            "text",
            "created_at",
            "updated_at",
        ]