from rest_framework import serializers

from publications.serializers.publication import PublicationSerializer


class EditPublicationSerializer(PublicationSerializer):
    def validate(self, attrs):
        instance = getattr(self, "instance", None)

        title = attrs.get("title", getattr(instance, "title", None))
        category = attrs.get("category", getattr(instance, "category", None))
        direction = attrs.get("direction", getattr(instance, "direction", None))
        option = attrs.get("option", getattr(instance, "option", None))

        price_type = attrs.get(
            "price_type",
            getattr(instance, "price_type", None),
        )

        price = attrs.get(
            "price",
            getattr(instance, "price", None),
        )

        agreement_accepted = attrs.get(
            "agreement_accepted",
            getattr(instance, "agreement_accepted", False),
        )

        preview_start_page = attrs.get(
            "preview_start_page",
            getattr(instance, "preview_start_page", 1),
        )

        preview_end_page = attrs.get(
            "preview_end_page",
            getattr(instance, "preview_end_page", 3),
        )

        if not title:
            raise serializers.ValidationError({
                "title": "Введите название публикации"
            })

        if not category:
            raise serializers.ValidationError({
                "category": "Выберите категорию"
            })

        if not direction:
            raise serializers.ValidationError({
                "direction": "Выберите направление"
            })

        if direction and category and direction.category_id != category.id:
            raise serializers.ValidationError({
                "direction": "Направление не относится к выбранной категории"
            })

        if option and category and option.category_id != category.id:
            raise serializers.ValidationError({
                "option": "Класс/курс не относится к выбранной категории"
            })

        if preview_start_page < 1:
            raise serializers.ValidationError({
                "preview_start_page": "Начальная страница не может быть меньше 1"
            })

        if preview_end_page < preview_start_page:
            raise serializers.ValidationError({
                "preview_end_page": "Конечная страница не может быть меньше начальной"
            })

        if preview_end_page - preview_start_page + 1 > 5:
            raise serializers.ValidationError({
                "preview_end_page": "Предпросмотр может содержать максимум 5 страниц"
            })

        if price_type == "paid":
            if not price or price <= 0:
                raise serializers.ValidationError({
                    "price": "Для платной публикации укажите цену"
                })

            if not agreement_accepted:
                raise serializers.ValidationError({
                    "agreement_accepted": "Необходимо принять договор для платной публикации"
                })

        if price_type == "free":
            attrs["price"] = 0

        return attrs