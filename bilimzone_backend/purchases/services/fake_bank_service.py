import requests

from django.conf import settings

FAKE_BANK_BASE_URL = getattr(
    settings,
    "FAKE_BANK_BASE_URL",
    "http://127.0.0.2:8001/api/bank",
).rstrip("/")


def post_to_fake_bank(path, payload, timeout=15):
    url = f"{FAKE_BANK_BASE_URL}{path}"

    response = requests.post(
        url,
        json=payload,
        timeout=timeout,
    )

    try:
        data = response.json()
    except Exception:
        data = {
            "success": False,
            "error": "Fake Bank вернул некорректный ответ",
            "raw": response.text,
        }

    return response.status_code, data


def create_purchase_confirmation_code(payload):
    return post_to_fake_bank(
        "/bilimzone/purchase/create-code/",
        payload,
    )


def confirm_purchase_confirmation_code(payload):
    return post_to_fake_bank(
        "/bilimzone/purchase/confirm-code/",
        payload,
    )


def create_wallet_confirmation_code(payload):
    return post_to_fake_bank(
        "/bilimzone/wallet/create-code/",
        payload,
    )


def confirm_wallet_confirmation_code(payload):
    return post_to_fake_bank(
        "/bilimzone/wallet/confirm-code/",
        payload,
    )


def is_insufficient_funds_error(bank_data):
    text = " ".join(
        [
            str(bank_data.get("code", "")),
            str(bank_data.get("error", "")),
            str(bank_data.get("detail", "")),
            str(bank_data.get("message", "")),
        ]
    ).lower()

    return (
        bank_data.get("code")
        in [
            "insufficient_funds",
            "insufficient_balance",
            "not_enough_money",
        ]
        or "недостаточно" in text
        or "не хватает" in text
        or "insufficient" in text
        or "not enough" in text
    )


def get_bank_error_text(bank_data):
    return (
        bank_data.get("error")
        or bank_data.get("detail")
        or bank_data.get("message")
        or "Ошибка Fake Bank"
    )


def get_bank_balance(bank_data):
    buyer = bank_data.get("buyer")

    if isinstance(buyer, dict):
        return buyer.get("balance")

    wallet = bank_data.get("wallet")

    if isinstance(wallet, dict):
        return wallet.get("balance")

    return (
        bank_data.get("balance")
        or bank_data.get("current_balance")
        or bank_data.get("available_balance")
    )
