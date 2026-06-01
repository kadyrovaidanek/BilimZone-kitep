from purchases.models import PublicationPurchase


def get_existing_purchase(buyer, publication):
    return PublicationPurchase.objects.filter(
        buyer=buyer,
        publication=publication,
    ).first()


def get_user_purchases(user):
    return PublicationPurchase.objects.select_related(
        "buyer",
        "publication",
        "publication__author_user",
        "publication__category",
        "publication__direction",
        "publication__option",
    ).filter(
        buyer=user,
        publication__status="published",
    ).order_by("-created_at")