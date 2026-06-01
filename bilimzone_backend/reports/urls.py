from django.urls import path

from reports.views import (
    AdminAnalyticsReportView,
    OwnerAnalyticsReportView,
    AdminReportExportView,
    OwnerReportExportView,
)

from reports.material_report_views import (
    AdminMaterialReportView,
    OwnerMaterialReportView,
)


urlpatterns = [
    path(
        "reports/admin/analytics/",
        AdminAnalyticsReportView.as_view(),
        name="admin_analytics_report",
    ),
    path(
        "reports/owner/<int:user_id>/analytics/",
        OwnerAnalyticsReportView.as_view(),
        name="owner_analytics_report",
    ),

    # Скачивание общих отчётов
    path(
        "reports/admin/export/<str:export_format>/",
        AdminReportExportView.as_view(),
        name="admin_report_export",
    ),
    path(
        "reports/owner/<int:user_id>/export/<str:export_format>/",
        OwnerReportExportView.as_view(),
        name="owner_report_export",
    ),

    # Отчёт по одному материалу
    path(
        "reports/admin/material/<int:publication_id>/analytics/",
        AdminMaterialReportView.as_view(),
        name="admin_material_report",
    ),
    path(
        "reports/owner/<int:user_id>/material/<int:publication_id>/analytics/",
        OwnerMaterialReportView.as_view(),
        name="owner_material_report",
    ),
]