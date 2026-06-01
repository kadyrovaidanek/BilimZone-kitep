from django.db.models import Count, Avg
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from users.models import User
from publications.models import Publication
from publications.selectors import get_all_publications


def format_number(value):
    value = int(value or 0)

    if value >= 1_000_000:
        number = value / 1_000_000
        return f"{number:.1f}M+".replace(".0M", "M")

    if value >= 1_000:
        number = value / 1_000
        return f"{number:.1f}k+".replace(".0k", "k")

    return str(value)


def get_cover_url(request, publication):
    if publication.cover:
        return request.build_absolute_uri(publication.cover.url)

    return None


def get_category_name(category, lang="ru"):
    if not category:
        return ""

    if lang == "kg":
        return getattr(category, "name_kg", "") or getattr(category, "name_ru", "")

    return getattr(category, "name_ru", "") or getattr(category, "name_kg", "")


def serialize_publication(request, publication):
    purchases_count = publication.purchases.count()
    reviews_count = publication.reviews.count()

    views_count = (publication.views_count or 0) + purchases_count
    downloads_count = (publication.downloads_count or 0) + purchases_count

    avg_rating = publication.reviews.aggregate(avg=Avg("rating")).get("avg") or 0

    return {
        "id": publication.id,
        "title": publication.title,
        "description": publication.description or "",
        "author_username": publication.author_user.username if publication.author_user else "",
        "category_name_ru": get_category_name(publication.category, "ru"),
        "category_name_kg": get_category_name(publication.category, "kg"),
        "price_type": publication.price_type,
        "price": publication.price,
        "cover_url": get_cover_url(request, publication),
        "views_count": views_count,
        "downloads_count": downloads_count,
        "purchases_count": purchases_count,
        "reviews_count": reviews_count,
        "average_rating": round(avg_rating, 1),
        "created_at": publication.created_at,
    }


@api_view(["GET"])
@permission_classes([AllowAny])
def home_data(request):
    # Берём РОВНО те материалы, которые берёт каталог /api/publications/
    all_publications = get_all_publications({})

    # Для поиска на главной тоже используем логику каталога
    publications = get_all_publications(request.GET)

    popular_materials = (
        publications
        .annotate(
            purchases_total=Count("purchases", distinct=True),
            reviews_total=Count("reviews", distinct=True),
        )
        .order_by(
            "-purchases_total",
            "-downloads_count",
            "-views_count",
            "-reviews_total",
            "-created_at",
        )[:4]
    )

    users_count = User.objects.count()
    materials_count = all_publications.count()

    ratings_count = 0
    downloads_count = 0

    for publication in all_publications:
        purchases_count = publication.purchases.count()

        ratings_count += publication.reviews.count()
        downloads_count += (publication.downloads_count or 0) + purchases_count

    categories_data = []
    
    category_ids = (
    all_publications
    .exclude(category__isnull=True)
    .values_list("category_id", flat=True)
    .distinct()
    )

    for category_id in category_ids:
      category_publications = all_publications.filter(category_id=category_id)
      first_publication = category_publications.first()

      if not first_publication or not first_publication.category:
           continue

      categories_data.append(
           {
               "id": first_publication.category.id,
               "name_ru": getattr(first_publication.category, "name_ru", ""),
               "name_kg": getattr(first_publication.category, "name_kg", ""),
               "materials_count": category_publications.count(),
           }
       )

    return Response(
        {
            "stats": {
                "users": {
                    "value": users_count,
                    "label": format_number(users_count),
                },
                "materials": {
                    "value": materials_count,
                    "label": format_number(materials_count),
                },
                "ratings": {
                    "value": ratings_count,
                    "label": format_number(ratings_count),
                },
                "downloads": {
                    "value": downloads_count,
                    "label": format_number(downloads_count),
                },
            },
            "categories": categories_data,
            "popular_materials": [
                serialize_publication(request, publication)
                for publication in popular_materials
            ],
        }
    )