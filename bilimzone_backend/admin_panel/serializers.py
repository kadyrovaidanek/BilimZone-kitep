from rest_framework import serializers

from .models import (
    AgreementTemplate,
    Category,
    CategoryDirection,
    CategoryOption,
    PlatformCommissionSetting,
)


class AgreementTemplateSerializer(serializers.ModelSerializer):
    file_url = serializers.SerializerMethodField()

    class Meta:
        model = AgreementTemplate
        fields = [
            "id",
            "title",
            "audience",
            "context",
            "text",
            "file",
            "file_url",
            "is_active",
            "created_at",
            "updated_at",
        ]

    def get_file_url(self, obj):
        request = self.context.get("request")

        if obj.file and request:
            return request.build_absolute_uri(obj.file.url)

        return None


class CategoryOptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = CategoryOption
        fields = [
            "id",
            "label_ru",
            "label_kg",
            "value",
            "is_active",
            "sort_order",
            "created_at",
        ]


class CategoryDirectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = CategoryDirection
        fields = [
            "id",
            "name_ru",
            "name_kg",
            "is_active",
            "sort_order",
            "created_at",
        ]


class CategorySerializer(serializers.ModelSerializer):
    directions = CategoryDirectionSerializer(many=True, required=False)
    options = CategoryOptionSerializer(many=True, required=False)

    class Meta:
        model = Category
        fields = [
            "id",
            "name_ru",
            "name_kg",
            "is_active",
            "sort_order",
            "created_at",
            "directions",
            "options",
        ]

    def validate_name_ru(self, value):
        value = value.strip()

        if not value:
            raise serializers.ValidationError("Введите название категории")

        return value

    def create(self, validated_data):
        directions_data = validated_data.pop("directions", [])
        options_data = validated_data.pop("options", [])

        category = Category.objects.create(**validated_data)

        for direction_data in directions_data:
            CategoryDirection.objects.create(
                category=category,
                **direction_data,
            )

        for option_data in options_data:
            CategoryOption.objects.create(
                category=category,
                **option_data,
            )

        return category

    def update(self, instance, validated_data):
        directions_data = validated_data.pop("directions", None)
        options_data = validated_data.pop("options", None)

        instance.name_ru = validated_data.get("name_ru", instance.name_ru)
        instance.name_kg = validated_data.get("name_kg", instance.name_kg)
        instance.is_active = validated_data.get("is_active", instance.is_active)
        instance.sort_order = validated_data.get("sort_order", instance.sort_order)
        instance.save()

        if directions_data is not None:
            instance.directions.all().delete()

            for direction_data in directions_data:
                CategoryDirection.objects.create(
                    category=instance,
                    **direction_data,
                )

        if options_data is not None:
            instance.options.all().delete()

            for option_data in options_data:
                CategoryOption.objects.create(
                    category=instance,
                    **option_data,
                )

        return instance


class PlatformCommissionSettingSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlatformCommissionSetting
        fields = [
            "id",
            "title",
            "commission_percent",
            "is_active",
            "created_at",
            "updated_at",
        ]

    def validate_commission_percent(self, value):
        if value < 0:
            raise serializers.ValidationError(
                "Комиссия не может быть меньше 0%"
            )

        if value > 100:
            raise serializers.ValidationError(
                "Комиссия не может быть больше 100%"
            )

        return value