from rest_framework import serializers

from publications.models import PublicationReview


class PublicationReviewSerializer(serializers.ModelSerializer):
    username = serializers.CharField(
        source="user.username",
        read_only=True,
    )

    class Meta:
        model = PublicationReview
        fields = [
            "id",
            "publication",
            "user",
            "username",
            "rating",
            "text",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "publication",
            "username",
            "created_at",
            "updated_at",
        ]

   
    def validate_rating(self, value):
        if value < 1 or value > 5:
            raise serializers.ValidationError("Рейтинг должен быть от 1 до 5")

        return value