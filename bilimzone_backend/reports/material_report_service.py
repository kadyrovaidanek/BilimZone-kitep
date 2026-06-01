from decimal import Decimal

from django.db.models import Count, Sum
from django.db.models.functions import TruncDate

from publications.models import Publication
from purchases.models import PublicationPurchase


def to_float(value):
    return float(value or Decimal("0.00"))


def format_datetime(value):
    if not value:
        return None

    return value.strftime("%Y-%m-%d %H:%M")


def apply_material_report_filters(queryset, request):
    date_from = request.GET.get("date_from")
    date_to = request.GET.get("date_to")
    search = request.GET.get("search")

    if date_from:
        queryset = queryset.filter(created_at__date__gte=date_from)

    if date_to:
        queryset = queryset.filter(created_at__date__lte=date_to)

    if search:
        queryset = queryset.filter(
            buyer__username__icontains=search,
        )

    return queryset


def get_publication_or_none(publication_id):
    return (
        Publication.objects.select_related(
            "author_user",
            "category",
        )
        .filter(id=publication_id)
        .first()
    )


def build_material_summary(publication, purchases):
    totals = purchases.aggregate(
        total_sales=Sum("amount"),
        owner_income=Sum("owner_amount"),
        platform_income=Sum("system_amount"),
        purchases_count=Count("id"),
    )

    first_purchase = purchases.order_by("created_at").first()
    last_purchase = purchases.order_by("-created_at").first()

    return {
        "publication": {
            "id": publication.id,
            "title": publication.title,
            "price": to_float(publication.price),
            "price_type": publication.price_type,
            "category": (
                publication.category.name_ru
                if publication.category
                else "Без категории"
            ),
            "author_user": publication.author_user_id,
            "author_username": publication.author_user.username,
        },
        "summary": {
            "total_sales": to_float(totals["total_sales"]),
            "owner_income": to_float(totals["owner_income"]),
            "platform_income": to_float(totals["platform_income"]),
            "purchases_count": totals["purchases_count"] or 0,
            "first_purchase_at": format_datetime(
                first_purchase.created_at if first_purchase else None
            ),
            "last_purchase_at": format_datetime(
                last_purchase.created_at if last_purchase else None
            ),
        },
    }


def build_material_sales_by_date(purchases):
    sales_by_date = (
        purchases.annotate(date=TruncDate("created_at"))
        .values("date")
        .annotate(
            total_sales=Sum("amount"),
            owner_income=Sum("owner_amount"),
            platform_income=Sum("system_amount"),
            purchases_count=Count("id"),
        )
        .order_by("date")
    )

    return [
        {
            "date": item["date"].strftime("%Y-%m-%d"),
            "total_sales": to_float(item["total_sales"]),
            "owner_income": to_float(item["owner_income"]),
            "platform_income": to_float(item["platform_income"]),
            "purchases_count": item["purchases_count"],
        }
        for item in sales_by_date
    ]


def build_material_purchase_history(purchases, is_admin=False):
    result = []

    for purchase in purchases.select_related("buyer").order_by("-created_at"):
        item = {
            "id": purchase.id,
            "buyer_id": purchase.buyer_id,
            "buyer_username": purchase.buyer.username,
            "created_at": format_datetime(purchase.created_at),
            "amount": to_float(purchase.amount),
            "owner_income": to_float(purchase.owner_amount),
        }

        if is_admin:
            item["platform_income"] = to_float(purchase.system_amount)

        result.append(item)

    return result


def get_owner_material_report_data(request, publication_id, owner_user_id):
    publication = get_publication_or_none(publication_id)

    if not publication:
        return {
            "error": "Материал не найден.",
            "status_code": 404,
        }

    if str(publication.author_user_id) != str(owner_user_id):
        return {
            "error": "У вас нет доступа к отчёту этого материала.",
            "status_code": 403,
        }

    purchases = PublicationPurchase.objects.filter(
        publication=publication,
        amount__gt=0,
    )

    purchases = apply_material_report_filters(purchases, request)

    data = build_material_summary(publication, purchases)

    data.update(
        {
            "role": "owner",
            "charts": {
                "sales_by_date": build_material_sales_by_date(purchases),
            },
            "purchases": build_material_purchase_history(
                purchases,
                is_admin=False,
            ),
        }
    )

    return data


def get_admin_material_report_data(request, publication_id):
    publication = get_publication_or_none(publication_id)

    if not publication:
        return {
            "error": "Материал не найден.",
            "status_code": 404,
        }

    purchases = PublicationPurchase.objects.filter(
        publication=publication,
        amount__gt=0,
    )

    purchases = apply_material_report_filters(purchases, request)

    data = build_material_summary(publication, purchases)

    data.update(
        {
            "role": "admin",
            "charts": {
                "sales_by_date": build_material_sales_by_date(purchases),
            },
            "purchases": build_material_purchase_history(
                purchases,
                is_admin=True,
            ),
        }
    )

    return data