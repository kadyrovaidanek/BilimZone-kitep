from rest_framework import serializers

from publications.models import PublicationSimilarityMatch


class PublicationSimilarityMatchSerializer(serializers.ModelSerializer):
    matched_publication_title = serializers.CharField(
        source="matched_publication.title",
        read_only=True,
    )

    matched_publication_status = serializers.CharField(
        source="matched_publication.status",
        read_only=True,
    )

    matched_publication_author = serializers.CharField(
        source="matched_publication.author_user.username",
        read_only=True,
    )

    matched_publication_url = serializers.SerializerMethodField()

    class Meta:
        model = PublicationSimilarityMatch
        fields = [
            "id",
            "publication",
            "matched_publication",
            "matched_publication_title",
            "matched_publication_status",
            "matched_publication_author",
            "matched_publication_url",
            "match_type",
            "similarity_percent",
            "matched_status",
            "detail",
            "created_at",
        ]

    def get_matched_publication_url(self, obj):
        return f"/publications/{obj.matched_publication_id}"