from django.urls import path

from .views import (
    CategoryListCreateView,
    ActiveCategoryListView,
    CategoryDetailView,
    CategoryToggleActiveView,
    CategoryDirectionListCreateView,
    CategoryDirectionDetailView,
    DirectionToggleActiveView,
    CategoryClassOptionListCreateView,
    CategoryClassOptionDetailView,
    ClassOptionToggleActiveView,
)

urlpatterns = [
    path("", CategoryListCreateView.as_view(), name="category_list_create"),
    path("active/", ActiveCategoryListView.as_view(), name="active_categories"),

    path("<int:category_id>/", CategoryDetailView.as_view(), name="category_detail"),
    path("<int:category_id>/toggle-active/", CategoryToggleActiveView.as_view(), name="category_toggle_active"),

    path(
        "<int:category_id>/directions/",
        CategoryDirectionListCreateView.as_view(),
        name="category_direction_create"
    ),
    path(
        "directions/<int:direction_id>/",
        CategoryDirectionDetailView.as_view(),
        name="category_direction_detail"
    ),
    path(
        "directions/<int:direction_id>/toggle-active/",
        DirectionToggleActiveView.as_view(),
        name="direction_toggle_active"
    ),

    path(
        "<int:category_id>/classes/",
        CategoryClassOptionListCreateView.as_view(),
        name="category_class_create"
    ),
    path(
        "classes/<int:option_id>/",
        CategoryClassOptionDetailView.as_view(),
        name="category_class_detail"
    ),
    path(
        "classes/<int:option_id>/toggle-active/",
        ClassOptionToggleActiveView.as_view(),
        name="class_toggle_active"
    ),
]