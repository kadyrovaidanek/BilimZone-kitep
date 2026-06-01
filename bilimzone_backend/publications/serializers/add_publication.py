from rest_framework import serializers

from admin_panel.models import AgreementTemplate
from publications.serializers.publication import PublicationSerializer


def get_active_paid_material_agreement(audience, agreement_id=None):
    audience_values = [audience, "all"]

    if audience in ["author", "organization"]:
        audience_values.append("author_organization")

    agreements = AgreementTemplate.objects.filter(
        is_active=True,
        context__in=["paid_material", "all"],
        audience__in=audience_values,
    )

    if agreement_id:
        agreements = agreements.filter(id=agreement_id)

    return agreements.order_by("-updated_at", "-created_at").first()


class AddPublicationSerializer(PublicationSerializer):
    cover_page_number = serializers.IntegerField(
        required=False,
        default=1,
    )

    agreement_id = serializers.IntegerField(
        required=False,
        allow_null=True,
        write_only=True,
    )

    class Meta(PublicationSerializer.Meta):
        fields = list(PublicationSerializer.Meta.fields) + [
            "agreement_id",
        ]

        read_only_fields = list(PublicationSerializer.Meta.read_only_fields)

    def validate_cover_page_number(self, value):
        if value < 1:
            raise serializers.ValidationError(
                "Страница обложки не может быть меньше 1"
            )

        return value

    def validate(self, attrs):
        title = attrs.get("title")
        category = attrs.get("category")
        direction = attrs.get("direction")
        option = attrs.get("option")
        price_type = attrs.get("price_type")
        price = attrs.get("price")
        agreement_accepted = attrs.get("agreement_accepted", False)
        agreement_id = attrs.pop("agreement_id", None)

        preview_start_page = attrs.get("preview_start_page", 1)
        preview_end_page = attrs.get("preview_end_page", 3)
        cover_page_number = attrs.get("cover_page_number", 1)

        author_user = attrs.get("author_user")
        author_role = ""

        if author_user and getattr(author_user, "role", None):
            author_role = author_user.role.name

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
                "option": "Класс не относится к выбранной категории"
            })

        if option and category:
            category_name = (getattr(category, "name", "") or "").lower()
            category_name_ru = (getattr(category, "name_ru", "") or "").lower()
            category_name_kg = (getattr(category, "name_kg", "") or "").lower()
            category_name_en = (getattr(category, "name_en", "") or "").lower()

            is_school_category = (
                "школ" in category_name
                or "школ" in category_name_ru
                or "мектеп" in category_name
                or "мектеп" in category_name_kg
                or "school" in category_name
                or "school" in category_name_ru
                or "school" in category_name_kg
                or "school" in category_name_en
            )

            if not is_school_category:
                raise serializers.ValidationError({
                    "option": "Класс можно выбрать только для школьной категории"
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

        if cover_page_number < 1:
            raise serializers.ValidationError({
                "cover_page_number": "Страница обложки не может быть меньше 1"
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

            if author_role not in ["author", "organization"]:
                raise serializers.ValidationError({
                    "author_user": "Платные публикации могут добавлять только авторы и организации"
                })

            agreement = get_active_paid_material_agreement(
                audience=author_role,
                agreement_id=agreement_id,
            )

            if not agreement:
                raise serializers.ValidationError({
                    "agreement_id": "Активный договор для платного материала не найден"
                })

        if price_type == "free":
            attrs["price"] = 0
            attrs["agreement_accepted"] = False

        return attrs