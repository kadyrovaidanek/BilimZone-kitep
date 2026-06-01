from decimal import Decimal, ROUND_HALF_UP

import requests

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny

from users.models import User, UserWallet, WalletTransaction
from purchases.services.fake_bank_service import (
    create_wallet_confirmation_code,
    confirm_wallet_confirmation_code,
    get_bank_error_text,
    is_insufficient_funds_error,
)


def to_money(value):
    return Decimal(str(value or "0")).quantize(
        Decimal("0.01"),
        rounding=ROUND_HALF_UP,
    )


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


class WalletBalanceView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]

    def get(self, request, user_id):
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response(
                {"user_id": "Пользователь не найден"},
                status=status.HTTP_404_NOT_FOUND,
            )

        wallet = get_or_create_wallet(user)

        return Response({
            "user_id": user.id,
            "username": user.username,
            "balance": str(wallet.balance),
        })


class WalletTransactionsView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]

    def get(self, request, user_id):
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response(
                {"user_id": "Пользователь не найден"},
                status=status.HTTP_404_NOT_FOUND,
            )

        transactions = WalletTransaction.objects.filter(user=user)

        data = [
            {
                "id": item.id,
                "type": item.transaction_type,
                "title": item.title,
                "description": item.description,
                "amount": str(item.amount),
                "balance_after": str(item.balance_after),
                "created_at": item.created_at,
            }
            for item in transactions
        ]

        return Response(data)


class WalletCreateCodeView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]

    def post(self, request):
        user_id = request.data.get("user_id")
        action = request.data.get("action")

        if not user_id:
            return Response(
                {"user_id": "user_id обязателен"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if action not in ["deposit", "withdraw"]:
            return Response(
                {"action": "Некорректный тип операции"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response(
                {"user_id": "Пользователь не найден"},
                status=status.HTTP_404_NOT_FOUND,
            )

        try:
            amount = to_money(request.data.get("amount", "0"))
        except Exception:
            return Response(
                {"amount": "Некорректная сумма"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if amount <= 0:
            return Response(
                {"amount": "Сумма должна быть больше 0"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        wallet = get_or_create_wallet(user)

        if action == "withdraw" and wallet.balance < amount:
            return Response(
                {
                    "error": "Недостаточно средств на кошельке BilimZone.",
                    "code": "insufficient_balance",
                    "balance": str(wallet.balance),
                    "amount": str(amount),
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        payload = {
            "action": action,
            "bilimzone_user_id": f"bilimzone_user_{user.id}",

            "card_number": str(request.data.get("card_number", "")).replace(" ", ""),
            "expiry_month": request.data.get("expiry_month"),
            "expiry_year": request.data.get("expiry_year"),
            "cvv": request.data.get("cvv"),

            "amount": str(amount),
            "description": (
                "Пополнение кошелька BilimZone"
                if action == "deposit"
                else "Вывод средств из кошелька BilimZone"
            ),
        }

        try:
            bank_status_code, bank_data = create_wallet_confirmation_code(payload)
        except requests.RequestException as error:
            return Response(
                {
                    "error": "Банк временно недоступен. Попробуйте позже.",
                    "code": "bank_unavailable",
                    "detail": str(error),
                },
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )

        if bank_status_code >= 400 or not bank_data.get("success"):
            if is_insufficient_funds_error(bank_data):
                return Response(
                    {
                        "error": "Недостаточно средств на карте Fake Bank.",
                        "code": "insufficient_funds",
                        "bank": bank_data,
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            return Response(
                {
                    "error": get_bank_error_text(bank_data),
                    "code": "bank_wallet_code_create_failed",
                    "bank": bank_data,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response(
            {
                "message": "Код подтверждения отправлен в личный кабинет банка.",
                "code_required": True,
                "action": action,
                "amount": str(amount),
                "confirmation_id": bank_data.get("confirmation_id"),
                "external_reference": bank_data.get("external_reference"),
                "currency": bank_data.get("currency", "KGS"),
                "masked_card": bank_data.get("masked_card"),
                "bank": bank_data,
            },
            status=status.HTTP_202_ACCEPTED,
        )


class WalletConfirmCodeView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]

    def post(self, request):
        user_id = request.data.get("user_id")
        action = request.data.get("action")
        code = request.data.get("code")

        if not user_id:
            return Response(
                {"user_id": "user_id обязателен"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if action not in ["deposit", "withdraw"]:
            return Response(
                {"action": "Некорректный тип операции"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not code:
            return Response(
                {"code": "Введите код подтверждения"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            amount = to_money(request.data.get("amount", "0"))
        except Exception:
            return Response(
                {"amount": "Некорректная сумма"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if amount <= 0:
            return Response(
                {"amount": "Сумма должна быть больше 0"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response(
                {"user_id": "Пользователь не найден"},
                status=status.HTTP_404_NOT_FOUND,
            )

        wallet = get_or_create_wallet(user)

        if action == "withdraw" and wallet.balance < amount:
            return Response(
                {
                    "error": "Недостаточно средств на кошельке BilimZone.",
                    "code": "insufficient_balance",
                    "balance": str(wallet.balance),
                    "amount": str(amount),
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        payload = {
            "confirmation_id": request.data.get("confirmation_id"),
            "external_reference": request.data.get("external_reference"),
            "code": str(code).strip(),
        }

        try:
            bank_status_code, bank_data = confirm_wallet_confirmation_code(payload)
        except requests.RequestException as error:
            return Response(
                {
                    "error": "Банк временно недоступен. Попробуйте позже.",
                    "code": "bank_unavailable",
                    "detail": str(error),
                },
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )

        if bank_status_code >= 400 or not bank_data.get("success"):
            if is_insufficient_funds_error(bank_data):
                return Response(
                    {
                        "error": "Недостаточно средств на карте Fake Bank.",
                        "code": "insufficient_funds",
                        "bank": bank_data,
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            return Response(
                {
                    "error": get_bank_error_text(bank_data),
                    "code": "bank_wallet_code_confirm_failed",
                    "bank": bank_data,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        if action == "deposit":
            wallet.balance += amount
            title = "Пополнение кошелька"
            transaction_type = "deposit"
        else:
            wallet.balance -= amount
            title = "Вывод средств"
            transaction_type = "withdraw"

        wallet.save(update_fields=["balance", "updated_at"])

        create_wallet_transaction(
            user=user,
            transaction_type=transaction_type,
            amount=amount,
            title=title,
            description=(
                "Операция подтверждена через Fake Bank"
            ),
        )

        return Response(
            {
                "message": (
                    "Кошелёк успешно пополнен"
                    if action == "deposit"
                    else "Вывод средств успешно выполнен"
                ),
                "action": action,
                "amount": str(amount),
                "wallet_balance": str(wallet.balance),
                "bank": bank_data,
            },
            status=status.HTTP_200_OK,
        )