import random
from datetime import datetime
from decimal import Decimal, ROUND_HALF_UP
from uuid import uuid4

from django.db import transaction
from django.shortcuts import get_object_or_404

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import (
    BankCustomer,
    BankAccount,
    BankCard,
    BankTransaction,
    BankConfirmationCode,
)
from .serializers import (
    BankCustomerSerializer,
    BankAccountSerializer,
    BankTransactionSerializer,
    RegisterCustomerSerializer,
    LoginSerializer,
    CardAmountSerializer,
    TransferSerializer,
    BilimZoneTopUpSerializer,
    PaymentSerializer,
    BilimZoneUserSyncSerializer,
    CardVerifySerializer,
    CardConfirmSerializer,
    BankConfirmationCodeSerializer,
    BilimZoneCreatePurchaseCodeSerializer,
    BilimZoneConfirmPurchaseCodeSerializer,
    BilimZoneWalletCreateCodeSerializer,
    BilimZoneWalletConfirmCodeSerializer,
)

FAKE_BANK_CODES = {}


def get_account_by_card(card_number):
    card = get_object_or_404(
        BankCard,
        card_number=card_number,
        is_active=True,
        account__is_active=True,
    )
    return card.account


def get_customer_by_bilimzone_id(external_bilimzone_user_id):
    return BankCustomer.objects.filter(
        external_bilimzone_user_id=external_bilimzone_user_id,
        is_active=True,
    ).first()


def get_first_active_account(customer):
    return (
        BankAccount.objects.select_related("card")
        .filter(customer=customer, is_active=True)
        .first()
    )


def failed_transaction(account, transaction_type, amount, description, **extra):
    return BankTransaction.objects.create(
        account=account,
        transaction_type=transaction_type,
        status=BankTransaction.STATUS_FAILED,
        amount=amount,
        description=description,
        **extra,
    )


def create_bank_transaction(
    account,
    transaction_type,
    amount,
    description,
    target_account=None,
    external_service="BilimZone",
    external_user_id="",
    external_reference="",
):
    return BankTransaction.objects.create(
        account=account,
        target_account=target_account,
        transaction_type=transaction_type,
        status=BankTransaction.STATUS_SUCCESS,
        amount=amount,
        currency=BankAccount.CURRENCY_KGS,
        description=description,
        external_service=external_service,
        external_user_id=external_user_id,
        external_reference=external_reference,
    )


def create_fake_card_for_account(account, card_holder):
    return BankCard.objects.create(
        account=account,
        card_holder=(card_holder or "BILIMZONE USER").upper(),
    )


def create_or_get_bilimzone_customer(
    bilimzone_user_id,
    full_name=None,
    email=None,
    role="",
    initial_balance=Decimal("0.00"),
):
    """
    Создаёт клиента Fake Bank для пользователя BilimZone, если его ещё нет.
    Используется для покупателя, владельца материала и системного кошелька.
    """

    customer = get_customer_by_bilimzone_id(bilimzone_user_id)

    if customer:
        account = get_first_active_account(customer)

        if not account:
            account = BankAccount.objects.create(
                customer=customer,
                balance=Decimal("0.00"),
            )
            create_fake_card_for_account(account, customer.full_name)

        return customer

    safe_name = full_name or f"BilimZone User {bilimzone_user_id}"

    phone_suffix = (
        str(bilimzone_user_id).replace("bilimzone_user_", "").replace("bilimzone_", "")
    )
    phone_suffix = (
        "".join(ch for ch in phone_suffix if ch.isalnum())[:20] or str(uuid4())[:8]
    )

    phone = f"+996BANK{phone_suffix}"

    while BankCustomer.objects.filter(phone=phone).exists():
        phone = f"+996BANK{str(uuid4())[:8]}"

    customer = BankCustomer(
        full_name=safe_name,
        phone=phone,
        email=email if email else None,
        external_bilimzone_user_id=bilimzone_user_id,
    )
    customer.set_password(f"bank{bilimzone_user_id}")
    customer.save()

    account = BankAccount.objects.create(
        customer=customer,
        balance=initial_balance,
    )

    create_fake_card_for_account(account, safe_name)

    if initial_balance > Decimal("0.00"):
        BankTransaction.objects.create(
            account=account,
            transaction_type=BankTransaction.TYPE_INITIAL,
            amount=initial_balance,
            description=(
                f"Автоматический стартовый баланс для BilimZone user "
                f"{bilimzone_user_id}, role={role}"
            ),
            external_service="BilimZone",
            external_user_id=bilimzone_user_id,
        )

    return customer


def create_or_get_system_customer():
    return create_or_get_bilimzone_customer(
        bilimzone_user_id="bilimzone_system",
        full_name="BilimZone System",
        role="system",
        initial_balance=Decimal("0.00"),
    )


class CustomerRegisterAPIView(APIView):
    @transaction.atomic
    def post(self, request):
        serializer = RegisterCustomerSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        phone = serializer.validated_data["phone"]
        email = serializer.validated_data.get("email") or None

        if BankCustomer.objects.filter(phone=phone).exists():
            return Response(
                {"detail": "Клиент с таким номером телефона уже существует."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if email and BankCustomer.objects.filter(email=email).exists():
            return Response(
                {"detail": "Клиент с таким email уже существует."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        customer = BankCustomer(
            full_name=serializer.validated_data["full_name"],
            phone=phone,
            email=email,
            external_bilimzone_user_id=serializer.validated_data.get(
                "external_bilimzone_user_id", ""
            ),
        )
        customer.set_password(serializer.validated_data["password"])
        customer.save()

        account = BankAccount.objects.create(
            customer=customer,
            balance=serializer.validated_data.get(
                "initial_balance", Decimal("1000.00")
            ),
        )

        BankCard.objects.create(
            account=account,
            card_holder=customer.full_name.upper(),
        )

        if account.balance > Decimal("0.00"):
            BankTransaction.objects.create(
                account=account,
                transaction_type=BankTransaction.TYPE_INITIAL,
                amount=account.balance,
                description="Начальный баланс fake bank",
            )

        return Response(
            {
                "token": f"fake-bank-token-{customer.id}",
                "customer": BankCustomerSerializer(customer).data,
            },
            status=status.HTTP_201_CREATED,
        )


class CustomerLoginAPIView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        customer = get_object_or_404(
            BankCustomer,
            phone=serializer.validated_data["phone"],
            is_active=True,
        )

        if not customer.check_password(serializer.validated_data["password"]):
            return Response(
                {"detail": "Неверный номер телефона или пароль."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response(
            {
                "token": f"fake-bank-token-{customer.id}",
                "customer": BankCustomerSerializer(customer).data,
            }
        )


class CustomerDetailAPIView(APIView):
    def get(self, request, customer_id):
        customer = get_object_or_404(BankCustomer, id=customer_id, is_active=True)
        return Response(BankCustomerSerializer(customer).data)


class BankCustomerListAPIView(APIView):
    def get(self, request):
        customers = BankCustomer.objects.all().order_by("-created_at")
        return Response(BankCustomerSerializer(customers, many=True).data)


class AccountByCardAPIView(APIView):
    def get(self, request, card_number):
        account = get_account_by_card(card_number)
        return Response(BankAccountSerializer(account).data)


class TransactionsByCardAPIView(APIView):
    def get(self, request, card_number):
        account = get_account_by_card(card_number)
        transactions = account.transactions.all()
        return Response(BankTransactionSerializer(transactions, many=True).data)


class CashInAPIView(APIView):
    @transaction.atomic
    def post(self, request):
        serializer = CardAmountSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        account = get_account_by_card(serializer.validated_data["card_number"])
        amount = serializer.validated_data["amount"]
        description = (
            serializer.validated_data.get("description") or "Пополнение счёта KGS"
        )

        account.balance += amount
        account.save(update_fields=["balance"])

        bank_transaction = BankTransaction.objects.create(
            account=account,
            transaction_type=BankTransaction.TYPE_CASH_IN,
            amount=amount,
            description=description,
        )

        return Response(
            {
                "account": BankAccountSerializer(account).data,
                "transaction": BankTransactionSerializer(bank_transaction).data,
            }
        )


class CashOutAPIView(APIView):
    @transaction.atomic
    def post(self, request):
        serializer = CardAmountSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        account = get_account_by_card(serializer.validated_data["card_number"])
        amount = serializer.validated_data["amount"]
        description = (
            serializer.validated_data.get("description") or "Снятие со счёта KGS"
        )

        if account.balance < amount:
            failed = failed_transaction(
                account,
                BankTransaction.TYPE_CASH_OUT,
                amount,
                "Недостаточно средств для снятия",
            )
            return Response(
                {
                    "detail": "Недостаточно средств.",
                    "transaction": BankTransactionSerializer(failed).data,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        account.balance -= amount
        account.save(update_fields=["balance"])

        bank_transaction = BankTransaction.objects.create(
            account=account,
            transaction_type=BankTransaction.TYPE_CASH_OUT,
            amount=amount,
            description=description,
        )

        return Response(
            {
                "account": BankAccountSerializer(account).data,
                "transaction": BankTransactionSerializer(bank_transaction).data,
            }
        )


class TransferAPIView(APIView):
    @transaction.atomic
    def post(self, request):
        serializer = TransferSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        from_card = serializer.validated_data["from_card"]
        to_card = serializer.validated_data["to_card"]
        amount = serializer.validated_data["amount"]
        description = serializer.validated_data.get("description") or "Перевод KGS"

        if from_card == to_card:
            return Response(
                {"detail": "Нельзя переводить деньги на ту же карту."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        sender = get_account_by_card(from_card)
        receiver = get_account_by_card(to_card)

        if sender.balance < amount:
            failed = failed_transaction(
                sender,
                BankTransaction.TYPE_TRANSFER_OUT,
                amount,
                "Недостаточно средств для перевода",
                target_account=receiver,
            )
            return Response(
                {
                    "detail": "Недостаточно средств для перевода.",
                    "transaction": BankTransactionSerializer(failed).data,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        sender.balance -= amount
        receiver.balance += amount
        sender.save(update_fields=["balance"])
        receiver.save(update_fields=["balance"])

        outgoing = BankTransaction.objects.create(
            account=sender,
            target_account=receiver,
            transaction_type=BankTransaction.TYPE_TRANSFER_OUT,
            amount=amount,
            description=description,
        )

        incoming = BankTransaction.objects.create(
            account=receiver,
            target_account=sender,
            transaction_type=BankTransaction.TYPE_TRANSFER_IN,
            amount=amount,
            description=f"Перевод от {sender.card.card_number}",
        )

        return Response(
            {
                "from_account": BankAccountSerializer(sender).data,
                "to_account": BankAccountSerializer(receiver).data,
                "transaction": BankTransactionSerializer(outgoing).data,
                "incoming_transaction": BankTransactionSerializer(incoming).data,
            }
        )


class BilimZoneTopUpAPIView(APIView):
    @transaction.atomic
    def post(self, request):
        serializer = BilimZoneTopUpSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        account = get_account_by_card(serializer.validated_data["card_number"])
        amount = serializer.validated_data["amount"]
        bilimzone_user_id = serializer.validated_data["bilimzone_user_id"]
        description = (
            serializer.validated_data.get("description")
            or "Пополнение кошелька BilimZone"
        )

        if account.balance < amount:
            failed = failed_transaction(
                account,
                BankTransaction.TYPE_BILIMZONE_TOP_UP,
                amount,
                "Недостаточно средств для пополнения BilimZone",
                external_service="BilimZone",
                external_user_id=bilimzone_user_id,
            )
            return Response(
                {
                    "success": False,
                    "detail": "Недостаточно средств для пополнения BilimZone.",
                    "transaction": BankTransactionSerializer(failed).data,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        account.balance -= amount
        account.save(update_fields=["balance"])

        external_reference = f"bilimzone-topup-{uuid4()}"

        bank_transaction = BankTransaction.objects.create(
            account=account,
            transaction_type=BankTransaction.TYPE_BILIMZONE_TOP_UP,
            amount=amount,
            description=description,
            external_service="BilimZone",
            external_user_id=bilimzone_user_id,
            external_reference=external_reference,
        )

        return Response(
            {
                "success": True,
                "message": "Fake Bank подтвердил пополнение BilimZone.",
                "bilimzone_user_id": bilimzone_user_id,
                "amount": str(amount),
                "currency": account.currency,
                "external_reference": external_reference,
                "account": BankAccountSerializer(account).data,
                "transaction": BankTransactionSerializer(bank_transaction).data,
            }
        )


class PaymentAPIView(APIView):
    @transaction.atomic
    def post(self, request):
        serializer = PaymentSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        account = get_account_by_card(serializer.validated_data["card_number"])
        amount = serializer.validated_data["amount"]
        merchant = serializer.validated_data.get("merchant", "BilimZone")
        external_reference = (
            serializer.validated_data.get("external_reference") or f"payment-{uuid4()}"
        )

        if account.balance < amount:
            failed = failed_transaction(
                account,
                BankTransaction.TYPE_PAYMENT,
                amount,
                "Недостаточно средств для оплаты",
                external_service=merchant,
                external_reference=external_reference,
            )
            return Response(
                {
                    "success": False,
                    "detail": "Недостаточно средств для оплаты.",
                    "transaction": BankTransactionSerializer(failed).data,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        account.balance -= amount
        account.save(update_fields=["balance"])

        bank_transaction = BankTransaction.objects.create(
            account=account,
            transaction_type=BankTransaction.TYPE_PAYMENT,
            amount=amount,
            description=f"Оплата в {merchant}",
            external_service=merchant,
            external_reference=external_reference,
        )

        return Response(
            {
                "success": True,
                "message": "Оплата подтверждена Fake Bank.",
                "external_reference": external_reference,
                "account": BankAccountSerializer(account).data,
                "transaction": BankTransactionSerializer(bank_transaction).data,
            }
        )


class BilimZoneUserSyncAPIView(APIView):
    @transaction.atomic
    def post(self, request):
        serializer = BilimZoneUserSyncSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        bilimzone_user_id = serializer.validated_data["bilimzone_user_id"]
        username = (
            serializer.validated_data.get("username")
            or f"BilimZone User {bilimzone_user_id}"
        )
        email = serializer.validated_data.get("email") or ""
        role = serializer.validated_data.get("role") or ""

        start_balance = Decimal("10000.00")

        if bilimzone_user_id == "bilimzone_system":
            start_balance = Decimal("0.00")

        customer = create_or_get_bilimzone_customer(
            bilimzone_user_id=bilimzone_user_id,
            full_name=username,
            email=email,
            role=role,
            initial_balance=start_balance,
        )

        return Response(
            {
                "created": True,
                "customer": BankCustomerSerializer(customer).data,
            }
        )


class CardVerifyAPIView(APIView):
    def post(self, request):
        serializer = CardVerifySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        card_number = serializer.validated_data["card_number"]
        expiry_month = serializer.validated_data["expiry_month"]
        expiry_year = serializer.validated_data["expiry_year"]
        cvv = serializer.validated_data["cvv"]

        card = get_object_or_404(
            BankCard,
            card_number=card_number,
            expiry_month=expiry_month,
            expiry_year=expiry_year,
            cvv=cvv,
            is_active=True,
            account__is_active=True,
        )

        code = str(random.randint(100000, 999999))

        FAKE_BANK_CODES[card_number] = {
            "code": code,
            "card_number": card.card_number,
            "masked_number": card.masked_number(),
            "card_holder": card.card_holder,
            "customer_id": card.account.customer.id,
            "created_at": datetime.now().isoformat(timespec="seconds"),
        }

        return Response(
            {
                "success": True,
                "message": "Карта подтверждена. Код отправлен в личный кабинет банка.",
                "card": {
                    "card_number": card.card_number,
                    "masked_number": card.masked_number(),
                    "card_holder": card.card_holder,
                },
            }
        )


class CardConfirmAPIView(APIView):
    def post(self, request):
        serializer = CardConfirmSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        card_number = serializer.validated_data["card_number"]
        code = serializer.validated_data["code"]

        saved_data = FAKE_BANK_CODES.get(card_number)

        if not saved_data or saved_data.get("code") != code:
            return Response(
                {"detail": "Неверный код подтверждения."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        card = get_object_or_404(
            BankCard,
            card_number=card_number,
            is_active=True,
            account__is_active=True,
        )

        FAKE_BANK_CODES.pop(card_number, None)

        return Response(
            {
                "success": True,
                "message": "Карта успешно подтверждена.",
                "account": BankAccountSerializer(card.account).data,
            }
        )


class CustomerPendingCodesAPIView(APIView):
    def get(self, request, customer_id):
        customer = get_object_or_404(
            BankCustomer,
            id=customer_id,
            is_active=True,
        )

        codes = BankConfirmationCode.objects.filter(
            customer=customer,
            status=BankConfirmationCode.STATUS_PENDING,
        ).order_by("-created_at")

        return Response(
            {"codes": BankConfirmationCodeSerializer(codes, many=True).data}
        )


class BilimZonePurchaseView(APIView):
    authentication_classes = []
    permission_classes = []

    @transaction.atomic
    def post(self, request):
        buyer_bilimzone_user_id = request.data.get("buyer_bilimzone_user_id")
        owner_bilimzone_user_id = request.data.get("owner_bilimzone_user_id")
        system_bilimzone_user_id = request.data.get(
            "system_bilimzone_user_id",
            "bilimzone_system",
        )

        amount = request.data.get("amount")
        owner_amount = request.data.get("owner_amount")
        system_amount = request.data.get("system_amount")

        material_id = request.data.get("material_id", "")
        material_title = request.data.get("material_title", "")
        description = request.data.get("description", "Покупка материала BilimZone")

        if not buyer_bilimzone_user_id:
            return Response(
                {"error": "buyer_bilimzone_user_id обязателен"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not owner_bilimzone_user_id:
            return Response(
                {"error": "owner_bilimzone_user_id обязателен"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            amount = Decimal(str(amount)).quantize(
                Decimal("0.01"),
                rounding=ROUND_HALF_UP,
            )
            owner_amount = Decimal(str(owner_amount)).quantize(
                Decimal("0.01"),
                rounding=ROUND_HALF_UP,
            )
            system_amount = Decimal(str(system_amount)).quantize(
                Decimal("0.01"),
                rounding=ROUND_HALF_UP,
            )
        except Exception:
            return Response(
                {"error": "Некорректная сумма"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if amount <= 0:
            return Response(
                {"error": "Сумма покупки должна быть больше 0"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if owner_amount + system_amount != amount:
            return Response(
                {"error": "owner_amount + system_amount должны быть равны amount"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        buyer_customer = create_or_get_bilimzone_customer(
            bilimzone_user_id=buyer_bilimzone_user_id,
            full_name=f"BilimZone Buyer {buyer_bilimzone_user_id}",
            role="buyer",
            initial_balance=Decimal("10000.00"),
        )

        owner_customer = create_or_get_bilimzone_customer(
            bilimzone_user_id=owner_bilimzone_user_id,
            full_name=f"BilimZone Owner {owner_bilimzone_user_id}",
            role="owner",
            initial_balance=Decimal("0.00"),
        )

        system_customer = create_or_get_bilimzone_customer(
            bilimzone_user_id=system_bilimzone_user_id,
            full_name="BilimZone System",
            role="system",
            initial_balance=Decimal("0.00"),
        )

        buyer_account = get_first_active_account(buyer_customer)
        owner_account = get_first_active_account(owner_customer)
        system_account = get_first_active_account(system_customer)

        if not buyer_account:
            return Response(
                {"error": "Активный счёт покупателя не найден"},
                status=status.HTTP_404_NOT_FOUND,
            )

        if not owner_account:
            return Response(
                {"error": "Активный счёт владельца материала не найден"},
                status=status.HTTP_404_NOT_FOUND,
            )

        if not system_account:
            return Response(
                {"error": "Активный системный счёт BilimZone не найден"},
                status=status.HTTP_404_NOT_FOUND,
            )

        if buyer_account.balance < amount:
            failed = failed_transaction(
                buyer_account,
                BankTransaction.TYPE_PAYMENT,
                amount,
                f"Недостаточно средств для покупки материала «{material_title}»",
                external_service="BilimZone",
                external_user_id=buyer_bilimzone_user_id,
                external_reference=f"material_{material_id}",
            )

            return Response(
                {
                    "success": False,
                    "error": "Недостаточно средств у покупателя",
                    "detail": "Покупка не выполнена. Пополните баланс.",
                    "buyer_balance": str(buyer_account.balance),
                    "amount": str(amount),
                    "transaction": BankTransactionSerializer(failed).data,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        buyer_account.balance -= amount
        owner_account.balance += owner_amount
        system_account.balance += system_amount

        buyer_account.save(update_fields=["balance"])
        owner_account.save(update_fields=["balance"])
        system_account.save(update_fields=["balance"])

        external_reference = f"material_{material_id}_{uuid4()}"

        buyer_transaction = create_bank_transaction(
            account=buyer_account,
            target_account=owner_account,
            transaction_type=BankTransaction.TYPE_PAYMENT,
            amount=amount,
            description=description,
            external_user_id=buyer_bilimzone_user_id,
            external_reference=external_reference,
        )

        owner_transaction = create_bank_transaction(
            account=owner_account,
            target_account=buyer_account,
            transaction_type=BankTransaction.TYPE_INCOME,
            amount=owner_amount,
            description=f"Доход 80% за материал «{material_title}»",
            external_user_id=owner_bilimzone_user_id,
            external_reference=external_reference,
        )

        system_transaction = create_bank_transaction(
            account=system_account,
            target_account=buyer_account,
            transaction_type=BankTransaction.TYPE_COMMISSION,
            amount=system_amount,
            description=f"Комиссия BilimZone 20% за материал «{material_title}»",
            external_user_id=system_bilimzone_user_id,
            external_reference=external_reference,
        )

        return Response(
            {
                "success": True,
                "message": "Покупка обработана Fake Bank",
                "amount": str(amount),
                "owner_amount": str(owner_amount),
                "system_amount": str(system_amount),
                "buyer": {
                    "customer_id": buyer_customer.id,
                    "bilimzone_user_id": buyer_bilimzone_user_id,
                    "balance": str(buyer_account.balance),
                },
                "owner": {
                    "customer_id": owner_customer.id,
                    "bilimzone_user_id": owner_bilimzone_user_id,
                    "balance": str(owner_account.balance),
                },
                "system": {
                    "customer_id": system_customer.id,
                    "bilimzone_user_id": system_bilimzone_user_id,
                    "balance": str(system_account.balance),
                },
                "transactions": {
                    "buyer_transaction_id": buyer_transaction.id,
                    "owner_transaction_id": owner_transaction.id,
                    "system_transaction_id": system_transaction.id,
                },
            },
            status=status.HTTP_200_OK,
        )


class BilimZoneCreatePurchaseCodeView(APIView):
    authentication_classes = []
    permission_classes = []

    @transaction.atomic
    def post(self, request):
        serializer = BilimZoneCreatePurchaseCodeSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        data = serializer.validated_data

        buyer_bilimzone_user_id = data["buyer_bilimzone_user_id"]
        owner_bilimzone_user_id = data["owner_bilimzone_user_id"]
        system_bilimzone_user_id = data.get(
            "system_bilimzone_user_id",
            "bilimzone_system",
        )

        amount = data["amount"]
        owner_amount = data["owner_amount"]
        system_amount = data["system_amount"]

        publication_id = data["publication_id"]
        publication_title = data["publication_title"]
        description = (
            data.get("description") or f"Покупка публикации «{publication_title}»"
        )

        if owner_amount + system_amount != amount:
            return Response(
                {
                    "success": False,
                    "error": "owner_amount + system_amount должны быть равны amount",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        buyer_customer = create_or_get_bilimzone_customer(
            bilimzone_user_id=buyer_bilimzone_user_id,
            full_name=f"BilimZone Buyer {buyer_bilimzone_user_id}",
            role="buyer",
            initial_balance=Decimal("10000.00"),
        )

        create_or_get_bilimzone_customer(
            bilimzone_user_id=owner_bilimzone_user_id,
            full_name=f"BilimZone Owner {owner_bilimzone_user_id}",
            role="owner",
            initial_balance=Decimal("0.00"),
        )

        create_or_get_bilimzone_customer(
            bilimzone_user_id=system_bilimzone_user_id,
            full_name="BilimZone System",
            role="system",
            initial_balance=Decimal("0.00"),
        )

        buyer_account = get_first_active_account(buyer_customer)

        if not buyer_account:
            return Response(
                {
                    "success": False,
                    "error": "Активный счёт покупателя не найден",
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        if buyer_account.balance < amount:
            failed = failed_transaction(
                buyer_account,
                BankTransaction.TYPE_PAYMENT,
                amount,
                f"Недостаточно средств для покупки публикации «{publication_title}»",
                external_service="BilimZone",
                external_user_id=buyer_bilimzone_user_id,
                external_reference=f"publication_{publication_id}",
            )

            return Response(
                {
                    "success": False,
                    "code": "insufficient_funds",
                    "error": "Недостаточно средств у покупателя",
                    "detail": "Покупка не выполнена. Пополните баланс.",
                    "buyer_balance": str(buyer_account.balance),
                    "amount": str(amount),
                    "transaction": BankTransactionSerializer(failed).data,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        external_reference = f"bilimzone_purchase_{publication_id}_{uuid4()}"
        code = str(random.randint(100000, 999999))

        confirmation = BankConfirmationCode.objects.create(
            customer=buyer_customer,
            code=code,
            purpose=BankConfirmationCode.PURPOSE_PURCHASE,
            amount=amount,
            external_reference=external_reference,
            description=description,
            payload={
                "buyer_bilimzone_user_id": buyer_bilimzone_user_id,
                "owner_bilimzone_user_id": owner_bilimzone_user_id,
                "system_bilimzone_user_id": system_bilimzone_user_id,
                "amount": str(amount),
                "owner_amount": str(owner_amount),
                "system_amount": str(system_amount),
                "publication_id": str(publication_id),
                "publication_title": publication_title,
                "description": description,
            },
        )

        return Response(
            {
                "success": True,
                "code_required": True,
                "message": "Код подтверждения отправлен в личный кабинет банка.",
                "confirmation_id": confirmation.id,
                "external_reference": confirmation.external_reference,
                "amount": str(amount),
                "currency": confirmation.currency,
                "customer_id": buyer_customer.id,
                "masked_card": BankConfirmationCodeSerializer(confirmation).data.get(
                    "masked_card"
                ),
            },
            status=status.HTTP_201_CREATED,
        )


class BilimZoneConfirmPurchaseCodeView(APIView):
    authentication_classes = []
    permission_classes = []

    @transaction.atomic
    def post(self, request):
        serializer = BilimZoneConfirmPurchaseCodeSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        confirmation_id = serializer.validated_data.get("confirmation_id")
        external_reference = serializer.validated_data.get("external_reference")
        code = serializer.validated_data["code"]

        confirmation_query = BankConfirmationCode.objects.select_for_update().filter(
            status=BankConfirmationCode.STATUS_PENDING,
            purpose=BankConfirmationCode.PURPOSE_PURCHASE,
        )

        if confirmation_id:
            confirmation_query = confirmation_query.filter(id=confirmation_id)
        elif external_reference:
            confirmation_query = confirmation_query.filter(
                external_reference=external_reference
            )
        else:
            return Response(
                {
                    "success": False,
                    "error": "confirmation_id или external_reference обязателен",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        confirmation = confirmation_query.first()

        if not confirmation:
            return Response(
                {
                    "success": False,
                    "error": "Код подтверждения не найден или уже использован",
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        if confirmation.code != code:
            return Response(
                {
                    "success": False,
                    "error": "Неверный код подтверждения",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        payload = confirmation.payload

        buyer_bilimzone_user_id = payload["buyer_bilimzone_user_id"]
        owner_bilimzone_user_id = payload["owner_bilimzone_user_id"]
        system_bilimzone_user_id = payload.get(
            "system_bilimzone_user_id",
            "bilimzone_system",
        )

        amount = Decimal(str(payload["amount"])).quantize(
            Decimal("0.01"),
            rounding=ROUND_HALF_UP,
        )
        owner_amount = Decimal(str(payload["owner_amount"])).quantize(
            Decimal("0.01"),
            rounding=ROUND_HALF_UP,
        )
        system_amount = Decimal(str(payload["system_amount"])).quantize(
            Decimal("0.01"),
            rounding=ROUND_HALF_UP,
        )

        publication_id = payload.get("publication_id", "")
        publication_title = payload.get("publication_title", "")
        description = payload.get(
            "description",
            f"Покупка публикации «{publication_title}»",
        )

        buyer_customer = get_customer_by_bilimzone_id(buyer_bilimzone_user_id)
        owner_customer = get_customer_by_bilimzone_id(owner_bilimzone_user_id)
        system_customer = get_customer_by_bilimzone_id(system_bilimzone_user_id)

        if not buyer_customer or not owner_customer or not system_customer:
            return Response(
                {
                    "success": False,
                    "error": "Один из участников операции не найден в банке",
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        buyer_account = get_first_active_account(buyer_customer)
        owner_account = get_first_active_account(owner_customer)
        system_account = get_first_active_account(system_customer)

        if buyer_account.balance < amount:
            failed = failed_transaction(
                buyer_account,
                BankTransaction.TYPE_PAYMENT,
                amount,
                f"Недостаточно средств для покупки публикации «{publication_title}»",
                external_service="BilimZone",
                external_user_id=buyer_bilimzone_user_id,
                external_reference=confirmation.external_reference,
            )

            return Response(
                {
                    "success": False,
                    "code": "insufficient_funds",
                    "error": "Недостаточно средств у покупателя",
                    "detail": "Покупка не выполнена. Пополните баланс.",
                    "buyer_balance": str(buyer_account.balance),
                    "amount": str(amount),
                    "transaction": BankTransactionSerializer(failed).data,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        buyer_account.balance -= amount
        owner_account.balance += owner_amount
        system_account.balance += system_amount

        buyer_account.save(update_fields=["balance"])
        owner_account.save(update_fields=["balance"])
        system_account.save(update_fields=["balance"])

        buyer_transaction = create_bank_transaction(
            account=buyer_account,
            target_account=owner_account,
            transaction_type=BankTransaction.TYPE_PAYMENT,
            amount=amount,
            description=description,
            external_service="BilimZone",
            external_user_id=buyer_bilimzone_user_id,
            external_reference=confirmation.external_reference,
        )

        owner_transaction = create_bank_transaction(
            account=owner_account,
            target_account=buyer_account,
            transaction_type=BankTransaction.TYPE_INCOME,
            amount=owner_amount,
            description=f"Доход автора за публикацию «{publication_title}»",
            external_service="BilimZone",
            external_user_id=owner_bilimzone_user_id,
            external_reference=confirmation.external_reference,
        )

        system_transaction = create_bank_transaction(
            account=system_account,
            target_account=buyer_account,
            transaction_type=BankTransaction.TYPE_COMMISSION,
            amount=system_amount,
            description=f"Комиссия BilimZone за публикацию «{publication_title}»",
            external_service="BilimZone",
            external_user_id=system_bilimzone_user_id,
            external_reference=confirmation.external_reference,
        )

        confirmation.status = BankConfirmationCode.STATUS_USED
        confirmation.used_at = datetime.now()
        confirmation.save(update_fields=["status", "used_at"])

        return Response(
            {
                "success": True,
                "message": "Покупка успешно подтверждена Fake Bank.",
                "confirmation_id": confirmation.id,
                "external_reference": confirmation.external_reference,
                "publication_id": publication_id,
                "publication_title": publication_title,
                "amount": str(amount),
                "owner_amount": str(owner_amount),
                "system_amount": str(system_amount),
                "currency": BankAccount.CURRENCY_KGS,
                "buyer": {
                    "customer_id": buyer_customer.id,
                    "balance": str(buyer_account.balance),
                    "transaction": BankTransactionSerializer(buyer_transaction).data,
                },
                "owner": {
                    "customer_id": owner_customer.id,
                    "balance": str(owner_account.balance),
                    "transaction": BankTransactionSerializer(owner_transaction).data,
                },
                "system": {
                    "customer_id": system_customer.id,
                    "balance": str(system_account.balance),
                    "transaction": BankTransactionSerializer(system_transaction).data,
                },
            }
        )


class BilimZoneWalletCreateCodeView(APIView):
    authentication_classes = []
    permission_classes = []

    @transaction.atomic
    def post(self, request):
        serializer = BilimZoneWalletCreateCodeSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        data = serializer.validated_data

        action = data["action"]
        bilimzone_user_id = data["bilimzone_user_id"]

        card_number = data["card_number"]
        expiry_month = data["expiry_month"]
        expiry_year = data["expiry_year"]
        cvv = data["cvv"]

        amount = data["amount"]
        description = data.get("description") or ""

        try:
            card = BankCard.objects.select_related(
                "account",
                "account__customer",
            ).get(
                card_number=card_number,
                expiry_month=expiry_month,
                expiry_year=expiry_year,
                cvv=cvv,
                is_active=True,
                account__is_active=True,
            )
        except BankCard.DoesNotExist:
            return Response(
                {
                    "success": False,
                    "code": "invalid_card",
                    "error": "Данные карты неверные или карта неактивна.",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        account = card.account
        customer = account.customer

        if action == "deposit" and account.balance < amount:
            failed = failed_transaction(
                account,
                BankTransaction.TYPE_BILIMZONE_TOP_UP,
                amount,
                "Недостаточно средств для пополнения кошелька BilimZone",
                external_service="BilimZone",
                external_user_id=bilimzone_user_id,
            )

            return Response(
                {
                    "success": False,
                    "code": "insufficient_funds",
                    "error": "Недостаточно средств на карте Fake Bank.",
                    "bank_balance": str(account.balance),
                    "amount": str(amount),
                    "transaction": BankTransactionSerializer(failed).data,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        external_reference = f"bilimzone_wallet_{action}_{bilimzone_user_id}_{uuid4()}"
        code = str(random.randint(100000, 999999))

        if action == "deposit":
            purpose = BankConfirmationCode.PURPOSE_TOP_UP
            final_description = (
                description or "Пополнение кошелька BilimZone через Fake Bank"
            )
        else:
            purpose = BankConfirmationCode.PURPOSE_TOP_UP
            final_description = (
                description or "Вывод средств из кошелька BilimZone через Fake Bank"
            )

        confirmation = BankConfirmationCode.objects.create(
            customer=customer,
            code=code,
            purpose=purpose,
            amount=amount,
            external_reference=external_reference,
            description=final_description,
            payload={
                "action": action,
                "bilimzone_user_id": bilimzone_user_id,
                "card_number": card.card_number,
                "masked_card": card.masked_number(),
                "amount": str(amount),
                "description": final_description,
            },
        )

        return Response(
            {
                "success": True,
                "code_required": True,
                "message": "Код подтверждения отправлен в личный кабинет банка.",
                "confirmation_id": confirmation.id,
                "external_reference": confirmation.external_reference,
                "action": action,
                "amount": str(amount),
                "currency": confirmation.currency,
                "customer_id": customer.id,
                "masked_card": card.masked_number(),
            },
            status=status.HTTP_201_CREATED,
        )


class BilimZoneWalletConfirmCodeView(APIView):
    authentication_classes = []
    permission_classes = []

    @transaction.atomic
    def post(self, request):
        serializer = BilimZoneWalletConfirmCodeSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        confirmation_id = serializer.validated_data.get("confirmation_id")
        external_reference = serializer.validated_data.get("external_reference")
        code = serializer.validated_data["code"]

        confirmation_query = BankConfirmationCode.objects.select_for_update().filter(
            status=BankConfirmationCode.STATUS_PENDING,
            purpose=BankConfirmationCode.PURPOSE_TOP_UP,
        )

        if confirmation_id:
            confirmation_query = confirmation_query.filter(id=confirmation_id)
        elif external_reference:
            confirmation_query = confirmation_query.filter(
                external_reference=external_reference
            )
        else:
            return Response(
                {
                    "success": False,
                    "error": "confirmation_id или external_reference обязателен",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        confirmation = confirmation_query.first()

        if not confirmation:
            return Response(
                {
                    "success": False,
                    "error": "Код подтверждения не найден или уже использован.",
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        if confirmation.code != code:
            return Response(
                {
                    "success": False,
                    "error": "Неверный код подтверждения.",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        payload = confirmation.payload

        action = payload.get("action")
        bilimzone_user_id = payload.get("bilimzone_user_id")
        card_number = payload.get("card_number")
        amount = Decimal(str(payload.get("amount", "0"))).quantize(
            Decimal("0.01"),
            rounding=ROUND_HALF_UP,
        )
        description = payload.get("description") or "Операция BilimZone"

        try:
            card = BankCard.objects.select_related(
                "account",
                "account__customer",
            ).get(
                card_number=card_number,
                is_active=True,
                account__is_active=True,
            )
        except BankCard.DoesNotExist:
            return Response(
                {
                    "success": False,
                    "error": "Карта не найдена или неактивна.",
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        account = card.account

        if action == "deposit":
            if account.balance < amount:
                failed = failed_transaction(
                    account,
                    BankTransaction.TYPE_BILIMZONE_TOP_UP,
                    amount,
                    "Недостаточно средств для пополнения кошелька BilimZone",
                    external_service="BilimZone",
                    external_user_id=bilimzone_user_id,
                    external_reference=confirmation.external_reference,
                )

                return Response(
                    {
                        "success": False,
                        "code": "insufficient_funds",
                        "error": "Недостаточно средств на карте Fake Bank.",
                        "bank_balance": str(account.balance),
                        "amount": str(amount),
                        "transaction": BankTransactionSerializer(failed).data,
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            account.balance -= amount
            transaction_type = BankTransaction.TYPE_BILIMZONE_TOP_UP
            transaction_description = description

        elif action == "withdraw":
            account.balance += amount
            transaction_type = BankTransaction.TYPE_CASH_IN
            transaction_description = description

        else:
            return Response(
                {
                    "success": False,
                    "error": "Некорректный тип операции.",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        account.save(update_fields=["balance"])

        bank_transaction = create_bank_transaction(
            account=account,
            transaction_type=transaction_type,
            amount=amount,
            description=transaction_description,
            external_service="BilimZone",
            external_user_id=bilimzone_user_id,
            external_reference=confirmation.external_reference,
        )

        confirmation.status = BankConfirmationCode.STATUS_USED
        confirmation.used_at = datetime.now()
        confirmation.save(update_fields=["status", "used_at"])

        return Response(
            {
                "success": True,
                "message": "Операция подтверждена Fake Bank.",
                "confirmation_id": confirmation.id,
                "external_reference": confirmation.external_reference,
                "action": action,
                "amount": str(amount),
                "currency": account.currency,
                "masked_card": card.masked_number(),
                "account": BankAccountSerializer(account).data,
                "transaction": BankTransactionSerializer(bank_transaction).data,
            },
            status=status.HTTP_200_OK,
        )
