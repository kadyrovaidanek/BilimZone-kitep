import os

from django.db.models import Avg
from rest_framework import serializers
from publications.serializers.similarity import PublicationSimilarityMatchSerializer

from publications.constants import (
    ALLOWED_DOCUMENT_EXTENSIONS,
    ALLOWED_IMAGE_EXTENSIONS,
)
from publications.models import Publication


class PublicationSerializer(serializers.ModelSerializer):
    author_username = serializers.CharField(
        source="author_user.username",
        read_only=True,
    )

    author_role = serializers.CharField(
        source="author_user.role.name",
        read_only=True,
    )

    category_name_ru = serializers.CharField(
        source="category.name_ru",
        read_only=True,
        allow_null=True,
    )

    category_name_kg = serializers.CharField(
        source="category.name_kg",
        read_only=True,
        allow_null=True,
    )

    direction_name_ru = serializers.CharField(
        source="direction.name_ru",
        read_only=True,
        allow_null=True,
    )

    direction_name_kg = serializers.CharField(
        source="direction.name_kg",
        read_only=True,
        allow_null=True,
    )

    option_value = serializers.CharField(
        source="option.value",
        read_only=True,
        allow_null=True,
    )

    similarity_matches = PublicationSimilarityMatchSerializer(
        many=True,
        read_only=True,
    )

    file_url = serializers.SerializerMethodField()
    preview_file_url = serializers.SerializerMethodField()
    pdf_file_url = serializers.SerializerMethodField()
    cover_url = serializers.SerializerMethodField()

    views_count = serializers.SerializerMethodField()
    downloads_count = serializers.SerializerMethodField()

    average_rating = serializers.SerializerMethodField()
    reviews_count = serializers.SerializerMethodField()
    purchases_count = serializers.SerializerMethodField()

    class Meta:
        model = Publication
        fields = [
            "id",
            "author_user",
            "author_username",
            "author_role",

            "category",
            "category_name_ru",
            "category_name_kg",

            "direction",
            "direction_name_ru",
            "direction_name_kg",

            "option",
            "option_value",

            "title",
            "description",
            "publication_type",

            "price_type",
            "price",

            "file",
            "file_url",

            "preview_file",
            "preview_file_url",

            "pdf_file",
            "pdf_file_url",

            "cover",
            "cover_url",

            "file_sha256",
            "cover_page_number",

            "text_sha256",
            "similarity_checked_at",

            "preview_start_page",
            "preview_end_page",

            "status",
            "reject_reason",
            "agreement_accepted",

            "views_count",
            "downloads_count",

            "average_rating",
            "reviews_count",
            "purchases_count",

            "created_at",
            "updated_at",
            "published_at",
            "similarity_matches",
        ]

        read_only_fields = [
            "status",
            "reject_reason",
            "views_count",
            "downloads_count",
            "average_rating",
            "reviews_count",
            "purchases_count",
            "preview_file",
            "pdf_file",
            "file_sha256",
            "published_at",
            "text_sha256",
            "similarity_checked_at",
            "similarity_matches",
        ]

    def get_absolute_file_url(self, file_field):
        request = self.context.get("request")

        if file_field and request:
            return request.build_absolute_uri(file_field.url)

        return None

    def get_file_url(self, obj):
        return self.get_absolute_file_url(obj.file)

    def get_preview_file_url(self, obj):
        if obj.preview_file:
            return self.get_absolute_file_url(obj.preview_file)

        if obj.file:
            ext = os.path.splitext(obj.file.name)[1].lower()

            if ext == ".pdf":
                return self.get_absolute_file_url(obj.file)

        return None

    def get_pdf_file_url(self, obj):
        return self.get_absolute_file_url(obj.pdf_file)

    def get_cover_url(self, obj):
        return self.get_absolute_file_url(obj.cover)

    def get_purchases_count(self, obj):
        return obj.purchases.count()

    def get_views_count(self, obj):
        purchases_count = self.get_purchases_count(obj)
        model_views_count = obj.views_count or 0

        return model_views_count + purchases_count

    def get_downloads_count(self, obj):
        purchases_count = self.get_purchases_count(obj)
        model_downloads_count = obj.downloads_count or 0

        return model_downloads_count + purchases_count

    def get_average_rating(self, obj):
        result = obj.reviews.aggregate(avg=Avg("rating"))
        avg = result.get("avg")

        if avg is None:
            return 0

        return round(avg, 1)

    def get_reviews_count(self, obj):
        return obj.reviews.count()

    def validate_file(self, value):
        if not value:
            return value

        ext = os.path.splitext(value.name)[1].lower()

        if ext not in ALLOWED_DOCUMENT_EXTENSIONS:
            raise serializers.ValidationError(
                "Формат файла не поддерживается. Можно загрузить PDF, DOC, DOCX, PPT или PPTX."
            )

        return value

    def validate_cover(self, value):
        if not value:
            return value

        ext = os.path.splitext(value.name)[1].lower()

        if ext not in ALLOWED_IMAGE_EXTENSIONS:
            raise serializers.ValidationError(
                "Формат обложки не поддерживается. Можно загрузить JPG, JPEG или PNG."
            )

        return value