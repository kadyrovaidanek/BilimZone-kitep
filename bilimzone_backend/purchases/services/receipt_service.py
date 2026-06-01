from django.utils import timezone


def build_publication_purchase_receipt(
    purchase,
    publication,
    buyer,
    owner,
    price,
    owner_amount,
    system_amount,
):
    return {
        "receipt_number": f"BZ-{purchase.id}-{publication.id}-{buyer.id}",
        "date": timezone.now().strftime("%d.%m.%Y %H:%M"),
        "buyer": buyer.username,
        "owner": owner.username,
        "publication_id": publication.id,
        "publication_title": publication.title,
        "amount": str(price),
        "owner_amount": str(owner_amount),
        "system_amount": str(system_amount),
        "commission_percent": "20%",
        "currency": "сом",
        "status": "Оплачено",
    }