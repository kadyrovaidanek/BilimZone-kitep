from django.urls import path

from publications.views import (
    PublicationListView,
    PublishedPublicationListView,
    AddPublicationView,
    CheckPublicationView,
    CheckPublicationFileView,
    DeletePublicationView,
    EditPublicationView,
    PublicationDetailView,
    PublicationReviewListCreateView,
    TemporaryPublicationPreviewView,
    SpellcheckView,
    AdminPublicationReviewListView,
    AdminPublicationReviewDeleteView,
)


urlpatterns = [
    path(
        "publications/",
        PublicationListView.as_view(),
        name="publication_list",
    ),

    path(
        "publications/published/",
        PublishedPublicationListView.as_view(),
        name="published_publication_list",
    ),

    path(
        "publications/add/",
        AddPublicationView.as_view(),
        name="publication_add",
    ),

    path(
        "publications/check-file/",
        CheckPublicationFileView.as_view(),
        name="publication_check_file",
    ),

    path(
        "publications/temp-preview/",
        TemporaryPublicationPreviewView.as_view(),
        name="publication_temp_preview",
    ),

    path(
        "publications/spellcheck/",
        SpellcheckView.as_view(),
        name="publication_spellcheck",
    ),

    path(
        "publications/<int:publication_id>/",
        PublicationDetailView.as_view(),
        name="publication_detail",
    ),

    path(
        "publications/<int:publication_id>/edit/",
        EditPublicationView.as_view(),
        name="publication_edit",
    ),

    path(
        "publications/<int:publication_id>/delete/",
        DeletePublicationView.as_view(),
        name="publication_delete",
    ),

    path(
        "publications/<int:publication_id>/check/",
        CheckPublicationView.as_view(),
        name="publication_check",
    ),

    path(
        "publications/<int:publication_id>/reviews/",
        PublicationReviewListCreateView.as_view(),
        name="publication_reviews",
    ),

    path(
        "admin/reviews/",
        AdminPublicationReviewListView.as_view(),
        name="admin_publication_reviews",
    ),

    path(
        "admin/reviews/<int:review_id>/delete/",
        AdminPublicationReviewDeleteView.as_view(),
        name="admin_publication_review_delete",
    ),
]