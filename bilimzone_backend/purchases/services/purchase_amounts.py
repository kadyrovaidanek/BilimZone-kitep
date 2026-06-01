from decimal import Decimal, ROUND_HALF_UP

from admin_panel.models import PlatformCommissionSetting


DEFAULT_COMMISSION_PERCENT = Decimal("20.00")


def to_money(value):
    return Decimal(str(value or "0")).quantize(
        Decimal("0.01"),
        rounding=ROUND_HALF_UP,
    )


def get_active_commission_percent():
    setting = PlatformCommissionSetting.objects.filter(
        is_active=True,
    ).order_by("-updated_at", "-created_at").first()

    if not setting:
        return DEFAULT_COMMISSION_PERCENT

    percent = Decimal(setting.commission_percent)

    if percent < 0:
        return Decimal("0.00")

    if percent > 100:
        return Decimal("100.00")

    return percent.quantize(
        Decimal("0.01"),
        rounding=ROUND_HALF_UP,
    )


def get_purchase_amounts(publication):
    price = to_money(publication.price)

    commission_percent = get_active_commission_percent()

    system_amount = (
        price * commission_percent / Decimal("100")
    ).quantize(
        Decimal("0.01"),
        rounding=ROUND_HALF_UP,
    )

    owner_amount = (price - system_amount).quantize(
        Decimal("0.01"),
        rounding=ROUND_HALF_UP,
    )

    return price, owner_amount, system_amount


def build_insufficient_balance_response(
    price,
    current_balance=None,
    bank_data=None,
    redirect_url="/wallet",
):
    current = to_money(current_balance or 0)
    required = to_money(price)
    missing = max(required - current, Decimal("0.00"))

    return {
        "success": False,
        "code": "insufficient_balance",
        "error": "Недостаточно средств для покупки.",
        "message": "Недостаточно средств для покупки.",
        "detail": "Пополните кошелёк и повторите покупку.",
        "required_amount": str(required),
        "current_balance": str(current),
        "missing_amount": str(missing),
        "redirect_url": redirect_url,
        "bank": bank_data or {},
    }