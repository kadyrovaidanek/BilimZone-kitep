import requests
from django.conf import settings


def send_verification_email(email: str, code: str) -> None:
    api_key = getattr(settings, "RESEND_API_KEY", "")

    if not api_key:
        raise RuntimeError("RESEND_API_KEY is not set")

    response = requests.post(
        "https://api.resend.com/emails",
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        },
        json={
            "from": getattr(settings, "RESEND_FROM_EMAIL", "BilimZone <onboarding@resend.dev>"),
            "to": [email],
            "subject": "Код подтверждения BilimZone",
            "text": f"Ваш код подтверждения BilimZone: {code}. Код действует 10 минут.",
        },
        timeout=20,
    )

    if response.status_code >= 400:
        raise RuntimeError(f"Resend error {response.status_code}: {response.text}")
