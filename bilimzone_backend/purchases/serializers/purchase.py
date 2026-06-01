from rest_framework import serializers

from purchases.models import PublicationPurchase


class PublicationPurchaseSerializer(serializers.ModelSerializer):
    publication_title = serializers.CharField(
        source="publication.title",
        read_only=True,
    )

    publication_description = serializers.CharField(
        source="publication.description",
        read_only=True,
        allow_null=True,
    )

    publication_price = serializers.CharField(
        source="publication.price",
        read_only=True,
    )

    publication_price_type = serializers.CharField(
        source="publication.price_type",
        read_only=True,
    )

    publication_type = serializers.CharField(
        source="publication.publication_type",
        read_only=True,
    )

    publication_file_url = serializers.SerializerMethodField()
    publication_preview_file_url = serializers.SerializerMethodField()
    publication_pdf_file_url = serializers.SerializerMethodField()
    publication_cover_url = serializers.SerializerMethodField()

    author_user = serializers.IntegerField(
        source="publication.author_user.id",
        read_only=True,
    )

    author_username = serializers.CharField(
        source="publication.author_user.username",
        read_only=True,
    )

    category_name_ru = serializers.CharField(
        source="publication.category.name_ru",
        read_only=True,
        allow_null=True,
    )

    category_name_kg = serializers.CharField(
        source="publication.category.name_kg",
        read_only=True,
        allow_null=True,
    )

    direction_name_ru = serializers.CharField(
        source="publication.direction.name_ru",
        read_only=True,
        allow_null=True,
    )

    direction_name_kg = serializers.CharField(
        source="publication.direction.name_kg",
        read_only=True,
        allow_null=True,
    )

    option_value = serializers.CharField(
        source="publication.option.value",
        read_only=True,
        allow_null=True,
    )

    class Meta:
        model = PublicationPurchase
        fields = [
            "id",
            "buyer",
            "publication",

            "publication_title",
            "publication_description",
            "publication_price",
            "publication_price_type",
            "publication_type",

            "publication_file_url",
            "publication_preview_file_url",
            "publication_pdf_file_url",
            "publication_cover_url",

            "author_user",
            "author_username",

            "category_name_ru",
            "category_name_kg",
            "direction_name_ru",
            "direction_name_kg",
            "option_value",

            "amount",
            "owner_amount",
            "system_amount",
            "created_at",
        ]

        read_only_fields = fields

    def get_absolute_file_url(self, file_field):
        request = self.context.get("request")

        if file_field and request:
            return request.build_absolute_uri(file_field.url)

        return None

    def get_publication_file_url(self, obj):
        return self.get_absolute_file_url(obj.publication.file)

    def get_publication_preview_file_url(self, obj):
        return self.get_absolute_file_url(obj.publication.preview_file)

    def get_publication_pdf_file_url(self, obj):
        return self.get_absolute_file_url(obj.publication.pdf_file)

    def get_publication_cover_url(self, obj):
        return self.get_absolute_file_url(obj.publication.cover)