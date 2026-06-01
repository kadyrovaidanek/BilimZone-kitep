from decimal import Decimal

from django.db.models import Sum, Count
from django.db.models.functions import TruncDate

from purchases.models import PublicationPurchase
from purchases.services.purchase_amounts import get_active_commission_percent


def to_float(value):
    return float(value or Decimal("0.00"))


def apply_date_filters(queryset, request):
    date_from = request.GET.get("date_from")
    date_to = request.GET.get("date_to")

    if date_from:
        queryset = queryset.filter(created_at__date__gte=date_from)

    if date_to:
        queryset = queryset.filter(created_at__date__lte=date_to)

    return queryset


def apply_search_filter(queryset, request):
    search = request.GET.get("search")

    if search:
        queryset = queryset.filter(publication__title__icontains=search)

    return queryset


def get_admin_report_data(request):
    purchases = PublicationPurchase.objects.select_related(
        "buyer",
        "publication",
        "publication__author_user",
        "publication__category",
    ).filter(amount__gt=0)

    purchases = apply_date_filters(purchases, request)
    purchases = apply_search_filter(purchases, request)

    category_id = request.GET.get("category")
    owner_id = request.GET.get("owner")

    if category_id:
        purchases = purchases.filter(publication__category_id=category_id)

    if owner_id:
        purchases = purchases.filter(publication__author_user_id=owner_id)

    totals = purchases.aggregate(
        total_sales=Sum("amount"),
        platform_income=Sum("system_amount"),
        owners_income=Sum("owner_amount"),
        purchases_count=Count("id"),
    )

    sales_by_date = (
        purchases.annotate(date=TruncDate("created_at"))
        .values("date")
        .annotate(
            total_sales=Sum("amount"),
            platform_income=Sum("system_amount"),
            owners_income=Sum("owner_amount"),
            purchases_count=Count("id"),
        )
        .order_by("date")
    )

    sales_by_category = (
        purchases.values("publication__category__name_ru")
        .annotate(
            total_sales=Sum("amount"),
            platform_income=Sum("system_amount"),
            purchases_count=Count("id"),
        )
        .order_by("-platform_income")
    )

    top_publications = (
        purchases.values(
            "publication_id",
            "publication__title",
            "publication__category__name_ru",
            "publication__author_user__username",
        )
        .annotate(
            total_sales=Sum("amount"),
            platform_income=Sum("system_amount"),
            owners_income=Sum("owner_amount"),
            purchases_count=Count("id"),
        )
        .order_by("-total_sales")[:50]
    )

    top_owners = (
        purchases.values(
            "publication__author_user_id",
            "publication__author_user__username",
        )
        .annotate(
            total_sales=Sum("amount"),
            platform_income=Sum("system_amount"),
            owner_income=Sum("owner_amount"),
            purchases_count=Count("id"),
        )
        .order_by("-total_sales")[:50]
    )

    return {
        "role": "admin",
        "commission_percent": str(get_active_commission_percent()),
        "summary": {
            "total_sales": to_float(totals["total_sales"]),
            "platform_income": to_float(totals["platform_income"]),
            "owners_income": to_float(totals["owners_income"]),
            "purchases_count": totals["purchases_count"] or 0,
        },
        "charts": {
            "sales_by_date": [
                {
                    "date": item["date"].strftime("%Y-%m-%d"),
                    "total_sales": to_float(item["total_sales"]),
                    "platform_income": to_float(item["platform_income"]),
                    "owners_income": to_float(item["owners_income"]),
                    "purchases_count": item["purchases_count"],
                }
                for item in sales_by_date
            ],
            "sales_by_category": [
                {
                    "category": item["publication__category__name_ru"] or "Без категории",
                    "total_sales": to_float(item["total_sales"]),
                    "platform_income": to_float(item["platform_income"]),
                    "purchases_count": item["purchases_count"],
                }
                for item in sales_by_category
            ],
        },
        "tables": {
            "top_publications": [
                {
                    "publication_id": item["publication_id"],
                    "title": item["publication__title"],
                    "category": item["publication__category__name_ru"] or "Без категории",
                    "owner": item["publication__author_user__username"],
                    "total_sales": to_float(item["total_sales"]),
                    "platform_income": to_float(item["platform_income"]),
                    "owners_income": to_float(item["owners_income"]),
                    "purchases_count": item["purchases_count"],
                }
                for item in top_publications
            ],
            "top_owners": [
                {
                    "owner_id": item["publication__author_user_id"],
                    "owner": item["publication__author_user__username"],
                    "total_sales": to_float(item["total_sales"]),
                    "platform_income": to_float(item["platform_income"]),
                    "owner_income": to_float(item["owner_income"]),
                    "purchases_count": item["purchases_count"],
                }
                for item in top_owners
            ],
        },
    }


def get_owner_report_data(request, user_id):
    purchases = PublicationPurchase.objects.select_related(
        "buyer",
        "publication",
        "publication__author_user",
        "publication__category",
    ).filter(
        amount__gt=0,
        publication__author_user_id=user_id,
    )

    purchases = apply_date_filters(purchases, request)
    purchases = apply_search_filter(purchases, request)

    category_id = request.GET.get("category")

    if category_id:
        purchases = purchases.filter(publication__category_id=category_id)

    totals = purchases.aggregate(
        total_sales=Sum("amount"),
        owner_income=Sum("owner_amount"),
        platform_commission=Sum("system_amount"),
        purchases_count=Count("id"),
    )

    sales_by_date = (
        purchases.annotate(date=TruncDate("created_at"))
        .values("date")
        .annotate(
            total_sales=Sum("amount"),
            owner_income=Sum("owner_amount"),
            platform_commission=Sum("system_amount"),
            purchases_count=Count("id"),
        )
        .order_by("date")
    )

    sales_by_publication = (
        purchases.values(
            "publication_id",
            "publication__title",
            "publication__category__name_ru",
        )
        .annotate(
            total_sales=Sum("amount"),
            owner_income=Sum("owner_amount"),
            platform_commission=Sum("system_amount"),
            purchases_count=Count("id"),
        )
        .order_by("-owner_income")
    )

    top_material = sales_by_publication.first()

    return {
        "role": "owner",
        "commission_percent": str(get_active_commission_percent()),
        "summary": {
            "total_sales": to_float(totals["total_sales"]),
            "owner_income": to_float(totals["owner_income"]),
            "platform_commission": to_float(totals["platform_commission"]),
            "purchases_count": totals["purchases_count"] or 0,
            "top_material": top_material["publication__title"] if top_material else None,
        },
        "charts": {
            "sales_by_date": [
                {
                    "date": item["date"].strftime("%Y-%m-%d"),
                    "total_sales": to_float(item["total_sales"]),
                    "owner_income": to_float(item["owner_income"]),
                    "platform_commission": to_float(item["platform_commission"]),
                    "purchases_count": item["purchases_count"],
                }
                for item in sales_by_date
            ],
            "sales_by_publication": [
                {
                    "publication_id": item["publication_id"],
                    "title": item["publication__title"],
                    "category": item["publication__category__name_ru"] or "Без категории",
                    "total_sales": to_float(item["total_sales"]),
                    "owner_income": to_float(item["owner_income"]),
                    "platform_commission": to_float(item["platform_commission"]),
                    "purchases_count": item["purchases_count"],
                }
                for item in sales_by_publication
            ],
        },
        "tables": {
            "publications": [
                {
                    "publication_id": item["publication_id"],
                    "title": item["publication__title"],
                    "category": item["publication__category__name_ru"] or "Без категории",
                    "total_sales": to_float(item["total_sales"]),
                    "owner_income": to_float(item["owner_income"]),
                    "platform_commission": to_float(item["platform_commission"]),
                    "purchases_count": item["purchases_count"],
                }
                for item in sales_by_publication
            ],
        },
    }