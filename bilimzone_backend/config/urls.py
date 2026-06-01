from django.contrib import admin
from django.urls import path, include
from django.conf.urls.static import static
from django.urls import re_path
from django.views.static import serve
from django.conf import settings

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

urlpatterns += [
    re_path(
        r"^media/(?P<path>.*)$",
        serve,
        {"document_root": settings.MEDIA_ROOT},
    ),
]
