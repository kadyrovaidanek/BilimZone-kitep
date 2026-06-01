from django.contrib import admin

from publications.models import (
    Publication,
    PublicationReview,
    PublicationSimilarityMatch,
)

@admin.register(Publication)
class PublicationAdmin(admin.ModelAdmin):
    list_display = [
        "id",
        "title",
        "author_user",
        "publication_type",
        "price_type",
        "price",
        "status",
        "created_at",
        "published_at",
    ]

    list_filter = [
        "status",
        "price_type",
        "publication_type",
        "category",
        "direction",
        "created_at",
    ]

    search_fields = [
        "title",
        "description",
        "author_user__username",
        "author_user__email",
    ]

    readonly_fields = [
        "views_count",
        "downloads_count",
        "created_at",
        "updated_at",
        "published_at",
    ]


@admin.register(PublicationReview)
class PublicationReviewAdmin(admin.ModelAdmin):
    list_display = [
        "id",
        "publication",
        "user",
        "rating",
        "created_at",
    ]

    list_filter = [
        "rating",
        "created_at",
    ]

    search_fields = [
        "publication__title",
        "user__username",
        "text",
    ]
@admin.register(PublicationSimilarityMatch)
class PublicationSimilarityMatchAdmin(admin.ModelAdmin):
    list_display = [
        "id",
        "publication",
        "matched_publication",
        "match_type",
        "similarity_percent",
        "matched_status",
        "created_at",
    ]

    list_filter = [
        "match_type",
        "matched_status",
        "created_at",
    ]

    search_fields = [
        "publication__title",
        "matched_publication__title",
    ]