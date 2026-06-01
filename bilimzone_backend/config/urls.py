from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path("admin/", admin.site.urls),

    path("api/", include("users.urls")),
    path("api/", include("publications.urls")),
    path("api/", include("categories.urls")),
    path("api/", include("notifications.urls")),
    path("api/", include("admin_panel.urls")),
    path("api/", include("purchases.urls")),
    path("api/", include("reports.urls")),
    path("api/", include("home.urls")),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)