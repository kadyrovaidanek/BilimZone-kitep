from publications.models import Publication


def get_publication_queryset():
    return Publication.objects.select_related(
        "author_user",
        "category",
        "direction",
        "option",
    )


def filter_publications(queryset, params):
    status_filter = params.get("status")
    category_id = params.get("category")
    direction_id = params.get("direction")
    option_id = params.get("option")
    author_user_id = params.get("author_user")
    price_type = params.get("price_type")
    search = params.get("search", "").strip()

    if status_filter:
        queryset = queryset.filter(status=status_filter)

    if category_id:
        queryset = queryset.filter(category_id=category_id)

    if direction_id:
        queryset = queryset.filter(direction_id=direction_id)

    if option_id:
        queryset = queryset.filter(option_id=option_id)

    if author_user_id:
        queryset = queryset.filter(author_user_id=author_user_id)

    if price_type:
        queryset = queryset.filter(price_type=price_type)

    if search:
        queryset = queryset.filter(title__icontains=search)

    return queryset


def get_all_publications(params):
    queryset = get_publication_queryset().order_by("-created_at")
    return filter_publications(queryset, params)


def get_published_publications(params):
    queryset = get_publication_queryset().filter(status="published")
    queryset = filter_publications(queryset, params)

    return queryset.order_by("-published_at", "-created_at")


def get_publication_by_id(publication_id):
    try:
        return get_publication_queryset().get(id=publication_id)
    except Publication.DoesNotExist:
        return None