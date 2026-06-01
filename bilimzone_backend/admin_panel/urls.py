from django.urls import path

from .views import (
    AgreementListCreateView,
    AgreementDetailView,
    ActiveAgreementView,

    CategoryListCreateView,
    CategoryDetailView,
    DirectionDetailView,
    OptionDetailView,

    PlatformCommissionSettingView,
)


urlpatterns = [
    path(
        "agreements/",
        AgreementListCreateView.as_view(),
        name="agreements",
    ),
    path(
        "agreements/active/",
        ActiveAgreementView.as_view(),
        name="active_agreement",
    ),
    path(
        "agreements/<int:agreement_id>/",
        AgreementDetailView.as_view(),
        name="agreement_detail",
    ),

    path(
        "platform-commission/active/",
        PlatformCommissionSettingView.as_view(),
        name="platform_commission_active",
    ),

    path(
        "categories/",
        CategoryListCreateView.as_view(),
        name="categories",
    ),
    path(
        "categories/<int:category_id>/",
        CategoryDetailView.as_view(),
        name="category_detail",
    ),

    path(
        "directions/<int:direction_id>/",
        DirectionDetailView.as_view(),
        name="direction_detail",
    ),

    path(
        "category-options/<int:option_id>/",
        OptionDetailView.as_view(),
        name="option_detail",
    ),
]