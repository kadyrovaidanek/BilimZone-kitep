from rest_framework import serializers

from .models import (
    CatalogCategory,
    CatalogDirection,
    CatalogClassOption,
)


class CatalogDirectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = CatalogDirection
        fields = [
            "id",
            "category",
            "name_ru",
            "name_kg",
            "is_active",
            "sort_order",
            "created_at",
        ]
        read_only_fields = ["category", "created_at"]


class CatalogClassOptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = CatalogClassOption
        fields = [
            "id",
            "category",
            "value",
            "is_active",
            "sort_order",
            "created_at",
        ]
        read_only_fields = ["category", "created_at"]


class CatalogCategorySerializer(serializers.ModelSerializer):
    directions = CatalogDirectionSerializer(many=True, read_only=True)
    class_options = CatalogClassOptionSerializer(many=True, read_only=True)

    directions_count = serializers.SerializerMethodField()
    active_directions_count = serializers.SerializerMethodField()

    class Meta:
        model = CatalogCategory
        fields = [
            "id",
            "slug",
            "name_ru",
            "name_kg",
            "description_ru",
            "description_kg",
            "is_active",
            "sort_order",
            "created_at",
            "directions",
            "class_options",
            "directions_count",
            "active_directions_count",
        ]

    def get_directions_count(self, obj):
        return obj.directions.count()

    def get_active_directions_count(self, obj):
        return obj.directions.filter(is_active=True).count()

    def validate_name_ru(self, value):
        value = value.strip()

        if not value:
            raise serializers.ValidationError("Введите название категории на русском")

        return value

    def validate_name_kg(self, value):
        if not value:
            return value

        return value.strip()

    def validate_description_ru(self, value):
        if not value:
            return value

        return value.strip()

    def validate_description_kg(self, value):
        if not value:
            return value

        return value.strip()


class CatalogCategoryCreateUpdateSerializer(serializers.ModelSerializer):
    directions = serializers.ListField(
        child=serializers.DictField(),
        required=False
    )

    class_options = serializers.ListField(
        child=serializers.DictField(),
        required=False
    )

    class Meta:
        model = CatalogCategory
        fields = [
            "slug",
            "name_ru",
            "name_kg",
            "description_ru",
            "description_kg",
            "is_active",
            "sort_order",
            "directions",
            "class_options",
        ]

    def validate_name_ru(self, value):
        value = value.strip()

        if not value:
            raise serializers.ValidationError("Введите название категории")

        return value

    def create(self, validated_data):
        directions_data = validated_data.pop("directions", [])
        class_options_data = validated_data.pop("class_options", [])

        category = CatalogCategory.objects.create(**validated_data)

        for index, direction in enumerate(directions_data):
            name_ru = str(direction.get("name_ru", "")).strip()
            name_kg = str(direction.get("name_kg", "")).strip()

            if name_ru:
                CatalogDirection.objects.create(
                    category=category,
                    name_ru=name_ru,
                    name_kg=name_kg or name_ru,
                    is_active=direction.get("is_active", True),
                    sort_order=direction.get("sort_order", index),
                )

        if category.slug == "school":
            for index, option in enumerate(class_options_data):
                value = str(option.get("value", "")).strip()

                if value:
                    CatalogClassOption.objects.create(
                        category=category,
                        value=value,
                        is_active=option.get("is_active", True),
                        sort_order=option.get("sort_order", index),
                    )

        return category

    def update(self, instance, validated_data):
        directions_data = validated_data.pop("directions", None)
        class_options_data = validated_data.pop("class_options", None)

        for field, value in validated_data.items():
            setattr(instance, field, value)

        instance.save()

        if directions_data is not None:
            current_direction_ids = []

            for index, direction in enumerate(directions_data):
                direction_id = direction.get("id")
                name_ru = str(direction.get("name_ru", "")).strip()
                name_kg = str(direction.get("name_kg", "")).strip()

                if not name_ru:
                    continue

                if direction_id:
                    obj, _ = CatalogDirection.objects.update_or_create(
                        id=direction_id,
                        category=instance,
                        defaults={
                            "name_ru": name_ru,
                            "name_kg": name_kg or name_ru,
                            "is_active": direction.get("is_active", True),
                            "sort_order": direction.get("sort_order", index),
                        }
                    )
                else:
                    obj = CatalogDirection.objects.create(
                        category=instance,
                        name_ru=name_ru,
                        name_kg=name_kg or name_ru,
                        is_active=direction.get("is_active", True),
                        sort_order=direction.get("sort_order", index),
                    )

                current_direction_ids.append(obj.id)

            CatalogDirection.objects.filter(category=instance).exclude(
                id__in=current_direction_ids
            ).delete()

        if class_options_data is not None:
            if instance.slug == "school":
                current_class_ids = []

                for index, option in enumerate(class_options_data):
                    option_id = option.get("id")
                    value = str(option.get("value", "")).strip()

                    if not value:
                        continue

                    if option_id:
                        obj, _ = CatalogClassOption.objects.update_or_create(
                            id=option_id,
                            category=instance,
                            defaults={
                                "value": value,
                                "is_active": option.get("is_active", True),
                                "sort_order": option.get("sort_order", index),
                            }
                        )
                    else:
                        obj = CatalogClassOption.objects.create(
                            category=instance,
                            value=value,
                            is_active=option.get("is_active", True),
                            sort_order=option.get("sort_order", index),
                        )

                    current_class_ids.append(obj.id)

                CatalogClassOption.objects.filter(category=instance).exclude(
                    id__in=current_class_ids
                ).delete()

            else:
                CatalogClassOption.objects.filter(category=instance).delete()

        return instance