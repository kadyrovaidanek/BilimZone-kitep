from django.core.management.base import BaseCommand

from categories.models import (
    CatalogCategory,
    CatalogDirection,
    CatalogClassOption,
)


CATALOG_DATA = [
    {
        "slug": "school",
        "name_ru": "Школьные",
        "name_kg": "Мектептик",
        "items": [
            "Кыргызский язык",
            "Русский язык",
            "Английский язык",
            "Математика",
            "Физика",
            "Химия",
            "История",
            "География",
            "Биология",
            "Литература",
            "Информатика",
            "Геометрия",
        ],
        "classes": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    },
    {
        "slug": "tests",
        "name_ru": "Подготовка к тестам",
        "name_kg": "Тесттерге даярдык",
        "items": [
            "ОРТ (ЖРТ)",
            "IELTS",
            "TOEFL",
            "НЦТ",
            "ЕГЭ",
            "ОГЭ",
            "SAT",
            "GRE",
        ],
    },
    {
        "slug": "university",
        "name_ru": "Вузовские",
        "name_kg": "ЖОЖ материалдары",
        "items": [
            "Экономика",
            "Юриспруденция",
            "Медицина",
            "Психология",
            "Архитектура",
            "IT технологии",
            "Философия",
        ],
    },
    {
        "slug": "diplomas",
        "name_ru": "Курсовые и Дипломы",
        "name_kg": "Курстук жана дипломдук иштер",
        "items": [
            "Дипломные работы",
            "Курсовые работы",
            "Магистерские диссертации",
            "Отчеты по практике",
            "Рефераты",
            "ВКР",
            "Чертежи и проекты",
        ],
    },
    {
        "slug": "science",
        "name_ru": "Научные",
        "name_kg": "Илимий",
        "items": [
            "Научные статьи",
            "Авторефераты",
            "Монографии",
            "Тезисы конференций",
            "Исследования",
            "Статьи ВАК / Scopus",
        ],
    },
    {
        "slug": "orgs",
        "name_ru": "Архив организаций",
        "name_kg": "Уюмдардын архиви",
        "items": [
            "Вестники ВУЗов",
            "Методические пособия",
            "Учебные планы",
            "Корпоративные кейсы",
            "Уставы и регламенты",
        ],
    },
    {
        "slug": "business",
        "name_ru": "Бизнес",
        "name_kg": "Бизнес",
        "items": [
            "Менеджмент",
            "Маркетинг",
            "Финансы",
            "Продажи",
            "HR",
            "Логистика",
        ],
    },
    {
        "slug": "fiction",
        "name_ru": "Художественные",
        "name_kg": "Көркөм адабият",
        "items": [
            "Классика",
            "Фантастика",
            "Детективы",
            "Исторические",
            "Поэзия",
            "Драматургия",
        ],
    },
    {
        "slug": "self",
        "name_ru": "Саморазвитие",
        "name_kg": "Өзүн-өзү өнүктүрүү",
        "items": [
            "Психология",
            "Дизайн",
            "Кулинария",
            "Фотография",
            "Тайм-менеджмент",
        ],
    },
]


class Command(BaseCommand):
    help = "Seed BilimZone catalog categories"

    def handle(self, *args, **options):
        for category_index, item in enumerate(CATALOG_DATA):
            category, _ = CatalogCategory.objects.update_or_create(
                slug=item["slug"],
                defaults={
                    "name_ru": item["name_ru"],
                    "name_kg": item["name_kg"],
                    "is_active": True,
                    "sort_order": category_index,
                }
            )

            current_direction_ids = []

            for direction_index, direction_name in enumerate(item["items"]):
                direction, _ = CatalogDirection.objects.update_or_create(
                    category=category,
                    name_ru=direction_name,
                    defaults={
                        "name_kg": direction_name,
                        "is_active": True,
                        "sort_order": direction_index,
                    }
                )

                current_direction_ids.append(direction.id)

            if category.slug == "school":
                current_class_ids = []

                for class_index, class_value in enumerate(item.get("classes", [])):
                    class_option, _ = CatalogClassOption.objects.update_or_create(
                        category=category,
                        value=str(class_value),
                        defaults={
                            "is_active": True,
                            "sort_order": class_index,
                        }
                    )

                    current_class_ids.append(class_option.id)

                CatalogClassOption.objects.filter(category=category).exclude(
                    id__in=current_class_ids
                ).delete()

            else:
                CatalogClassOption.objects.filter(category=category).delete()

        self.stdout.write(
            self.style.SUCCESS("Catalog categories seeded successfully")
        )