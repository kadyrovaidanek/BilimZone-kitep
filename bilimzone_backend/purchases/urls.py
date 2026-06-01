from django.urls import path

from purchases.views import (
    PurchasePublicationView,
    ConfirmPurchasePublicationView,
    UserPurchasesView,
)

urlpatterns = [
    path(
        "publications/<int:publication_id>/purchase/",
        PurchasePublicationView.as_view(),
        name="publication_purchase",
    ),
    path(
        "publications/<int:publication_id>/purchase/confirm/",
        ConfirmPurchasePublicationView.as_view(),
        name="publication_purchase_confirm",
    ),
    path(
        "users/<int:user_id>/purchases/",
        UserPurchasesView.as_view(),
        name="user_purchases",
    ),
]