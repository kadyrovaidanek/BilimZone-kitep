from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse

def health(request):
    return JsonResponse({
        "status": "ok",
        "service": "bank_bilimzone_v2",
        "description": "Fake Bank API for BilimZone"
    })

urlpatterns = [
    path("", health),
    path("admin/", admin.site.urls),
    path("api/bank/", include("bank.urls")),
]
