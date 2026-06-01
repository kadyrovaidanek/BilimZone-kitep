from dataclasses import dataclass
from decimal import Decimal

from django.db import IntegrityError, transaction
from rest_framework import status

from users.models import User, UserWallet, WalletTransaction
from publications.models import Publication

from purchases.models import PublicationPurchase
from purchases.serializers import PublicationPurchaseSerializer
from purchases.selectors import get_existing_purchase

from purchases.services.notification_service import (
    notify_free_publication_added,
    notify_paid_publication_purchased,
)
from purchases.services.purchase_amounts import get_purchase_amounts
from purchases.services.receipt_service import build_publication_purchase_receipt


@dataclass
class ServiceResponse:
    data: dict
    status_code: int


def serialize_purchase(purchase, request=None):
    return PublicationPurchaseSerializer(
        purchase,
        context={"request": request},
    ).data


def get_or_create_wallet(user):
    wallet, _ = UserWallet.objects.get_or_create(user=user)
    return wallet


def create_wallet_transaction(
    user,
    transaction_type,
    amount,
    title,
    description="",
):
    wallet = get_or_create_wallet(user)

    WalletTransaction.objects.create(
        user=user,
        transaction_type=transaction_type,
        amount=amount,
        title=title,
        description=description,
        balance_after=wallet.balance,
    )


def get_system_admin_user():
    admin = User.objects.filter(role__name="manager_admin").first()

    if admin:
        return admin

    return User.objects.filter(role__name="admin").first()


def get_buyer_or_response(user_id):
    if not user_id:
        return None, ServiceResponse(
            data={"user_id": "user_id обязателен"},
            status_code=status.HTTP_400_BAD_REQUEST,
        )

    try:
        return User.objects.get(id=user_id), None
    except User.DoesNotExist:
        return None, ServiceResponse(
            data={"user_id": "Покупатель не найден"},
            status_code=status.HTTP_404_NOT_FOUND,
        )


def get_publication_or_response(publication_id):
    try:
        publication = Publication.objects.select_related("author_user").get(
            id=publication_id,
            status="published",
        )
        return publication, None
    except Publication.DoesNotExist:
        return None, ServiceResponse(
            data={"error": "Публикация не найдена или не опубликована"},
            status_code=status.HTTP_404_NOT_FOUND,
        )


def validate_purchase_access(buyer, publication, request=None):
    owner = publication.author_user

    if buyer.id == owner.id:
        return ServiceResponse(
            data={"error": "Нельзя купить собственную публикацию"},
            status_code=status.HTTP_400_BAD_REQUEST,
        )

    existing_purchase = get_existing_purchase(
        buyer=buyer,
        publication=publication,
    )

    if existing_purchase:
        return ServiceResponse(
            data={
                "message": "Публикация уже куплена этим пользователем",
                "already_purchased": True,
                "code_required": False,
                "purchase": serialize_purchase(existing_purchase, request),
            },
            status_code=status.HTTP_200_OK,
        )

    return None


def create_free_purchase(publication, buyer, request=None):
    try:
        purchase = PublicationPurchase.objects.create(
            buyer=buyer,
            publication=publication,
            amount=Decimal("0.00"),
            owner_amount=Decimal("0.00"),
            system_amount=Decimal("0.00"),
            bank_response={
                "payment_source": "free",
                "message": "Бесплатная публикация добавлена в коллекцию",
            },
        )
    except IntegrityError:
        existing_purchase = get_existing_purchase(buyer, publication)

        return ServiceResponse(
            data={
                "message": "Публикация уже куплена этим пользователем",
                "already_purchased": True,
                "code_required": False,
                "purchase": serialize_purchase(existing_purchase, request),
            },
            status_code=status.HTTP_200_OK,
        )

    notify_free_publication_added(publication, buyer)

    return ServiceResponse(
        data={
            "message": "Бесплатная публикация добавлена в коллекцию",
            "already_purchased": False,
            "code_required": False,
            "amount": "0.00",
            "owner_amount": "0.00",
            "system_amount": "0.00",
            "purchase": serialize_purchase(purchase, request),
            "payment_source": "free",
        },
        status_code=status.HTTP_201_CREATED,
    )


def create_paid_purchase_from_wallet(
    publication,
    buyer,
    price,
    owner_amount,
    system_amount,
    request=None,
):
    owner = publication.author_user
    system_admin = get_system_admin_user()

    if not system_admin:
        return ServiceResponse(
            data={
                "error": "Системный администратор для комиссии не найден",
                "code": "system_wallet_not_found",
            },
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

    buyer_wallet = get_or_create_wallet(buyer)
    owner_wallet = get_or_create_wallet(owner)
    system_wallet = get_or_create_wallet(system_admin)

    if buyer_wallet.balance < price:
        missing_amount = price - buyer_wallet.balance

        return ServiceResponse(
            data={
                "success": False,
                "code": "insufficient_balance",
                "error": "Недостаточно средств для покупки.",
                "message": "Недостаточно средств для покупки.",
                "detail": "Пополните кошелёк и повторите покупку.",
                "required_amount": str(price),
                "current_balance": str(buyer_wallet.balance),
                "missing_amount": str(missing_amount),
                "redirect_url": "/wallet",
            },
            status_code=status.HTTP_402_PAYMENT_REQUIRED,
        )

    buyer_wallet.balance -= price
    owner_wallet.balance += owner_amount
    system_wallet.balance += system_amount

    buyer_wallet.save(update_fields=["balance", "updated_at"])
    owner_wallet.save(update_fields=["balance", "updated_at"])
    system_wallet.save(update_fields=["balance", "updated_at"])

    create_wallet_transaction(
        user=buyer,
        transaction_type="purchase",
        amount=price,
        title=f"Покупка публикации «{publication.title}»",
        description=f"Списано с кошелька BilimZone",
    )

    create_wallet_transaction(
        user=owner,
        transaction_type="sale_income",
        amount=owner_amount,
        title=f"Доход от продажи «{publication.title}»",
        description=f"80% от покупки пользователя {buyer.username}",
    )

    create_wallet_transaction(
        user=system_admin,
        transaction_type="system_income",
        amount=system_amount,
        title=f"Комиссия сервиса за «{publication.title}»",
        description=f"20% комиссии от покупки пользователя {buyer.username}",
    )

    try:
        purchase = PublicationPurchase.objects.create(
            buyer=buyer,
            publication=publication,
            amount=price,
            owner_amount=owner_amount,
            system_amount=system_amount,
            bank_response={
                "payment_source": "bilimzone_wallet",
                "buyer_balance": str(buyer_wallet.balance),
                "owner_balance": str(owner_wallet.balance),
                "system_balance": str(system_wallet.balance),
                "system_admin_id": system_admin.id,
            },
        )
    except IntegrityError:
        existing_purchase = get_existing_purchase(buyer, publication)

        return ServiceResponse(
            data={
                "message": "Публикация уже куплена этим пользователем",
                "already_purchased": True,
                "code_required": False,
                "purchase": serialize_purchase(existing_purchase, request),
            },
            status_code=status.HTTP_200_OK,
        )

    notify_paid_publication_purchased(
        publication=publication,
        buyer=buyer,
        owner_amount=owner_amount,
        system_amount=system_amount,
        price=price,
    )

    receipt = build_publication_purchase_receipt(
        purchase=purchase,
        publication=publication,
        buyer=buyer,
        owner=owner,
        price=price,
        owner_amount=owner_amount,
        system_amount=system_amount,
    )

    return ServiceResponse(
        data={
            "message": "Покупка успешно выполнена с кошелька BilimZone",
            "already_purchased": False,
            "code_required": False,
            "amount": str(price),
            "owner_amount": str(owner_amount),
            "system_amount": str(system_amount),
            "receipt": receipt,
            "purchase": serialize_purchase(purchase, request),
            "payment_source": "bilimzone_wallet",
            "wallet": {
                "buyer_balance": str(buyer_wallet.balance),
                "owner_balance": str(owner_wallet.balance),
                "system_balance": str(system_wallet.balance),
                "system_admin_id": system_admin.id,
            },
        },
        status_code=status.HTTP_201_CREATED,
    )


@transaction.atomic
def purchase_publication(publication_id, user_id, request=None):
    buyer, error_response = get_buyer_or_response(user_id)

    if error_response:
        return error_response

    publication, error_response = get_publication_or_response(publication_id)

    if error_response:
        return error_response

    access_error = validate_purchase_access(
        buyer=buyer,
        publication=publication,
        request=request,
    )

    if access_error:
        return access_error

    price, owner_amount, system_amount = get_purchase_amounts(publication)

    if publication.price_type == "free" or price <= 0:
        return create_free_purchase(
            publication=publication,
            buyer=buyer,
            request=request,
        )

    return create_paid_purchase_from_wallet(
        publication=publication,
        buyer=buyer,
        price=price,
        owner_amount=owner_amount,
        system_amount=system_amount,
        request=request,
    )


@transaction.atomic
def confirm_publication_purchase(
    publication_id,
    user_id,
    confirmation_id=None,
    external_reference=None,
    code=None,
    request=None,
):
    return ServiceResponse(
        data={
            "error": (
                "Подтверждение через банк больше не требуется. "
                "Покупка оплачивается напрямую с кошелька BilimZone."
            ),
            "code": "bank_confirmation_not_required",
        },
        status_code=status.HTTP_400_BAD_REQUEST,
    )