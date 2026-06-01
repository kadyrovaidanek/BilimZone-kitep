from rest_framework import serializers

from publications.models import Publication


class PublicationModerationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Publication
        fields = [
            "status",
            "reject_reason",
        ]

    def validate_status(self, value):
        if value not in ["published", "rejected", "pending"]:
            raise serializers.ValidationError(
                "Можно поставить только published, rejected или pending"
            )

        return value

    def validate(self, attrs):
        status_value = attrs.get("status")
        reject_reason = attrs.get("reject_reason")

        if status_value == "rejected" and not reject_reason:
            raise serializers.ValidationError({
                "reject_reason": "Укажите причину отклонения"
            })

        return attrs