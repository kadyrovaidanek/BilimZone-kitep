from publications.models import Publication, PublicationSimilarityMatch
from publications.services.similarity_service import calculate_similarity_percent
from publications.services.text_extract_service import normalize_text_for_hash


def clear_publication_similarity_matches(publication):
    PublicationSimilarityMatch.objects.filter(
        publication=publication,
    ).delete()


def save_similarity_match(
    publication,
    matched_publication,
    match_type,
    similarity_percent,
    detail="",
):
    if not matched_publication:
        return None

    if publication.id == matched_publication.id:
        return None

    match, _ = PublicationSimilarityMatch.objects.update_or_create(
        publication=publication,
        matched_publication=matched_publication,
        match_type=match_type,
        defaults={
            "similarity_percent": similarity_percent or 0,
            "matched_status": matched_publication.status,
            "detail": detail or "",
        },
    )

    return match


def save_current_check_result(publication, check_result):
    text_analysis = check_result.get("text_analysis")
    response_data = check_result.get("response_data") or {}

    if not text_analysis:
        return

    matched_publication = text_analysis.get("matched_publication")
    status_value = text_analysis.get("status")

    if not matched_publication:
        return

    save_similarity_match(
        publication=publication,
        matched_publication=matched_publication,
        match_type=status_value,
        similarity_percent=text_analysis.get("similarity_percent") or 0,
        detail=response_data.get("detail") or text_analysis.get("message") or "",
    )


def find_pending_similarity_matches(publication):
    if not publication.extracted_text:
        return []

    current_text = normalize_text_for_hash(publication.extracted_text)

    if not current_text:
        return []

    pending_publications = Publication.objects.filter(
        status="pending",
    ).exclude(
        id=publication.id,
    ).exclude(
        extracted_text__isnull=True,
    ).exclude(
        extracted_text="",
    )

    matches = []

    for item in pending_publications.only(
        "id",
        "title",
        "status",
        "extracted_text",
        "author_user",
    ):
        existing_text = normalize_text_for_hash(item.extracted_text or "")

        if not existing_text:
            continue

        percent = calculate_similarity_percent(current_text, existing_text)

        if percent >= 75:
            matches.append(
                {
                    "publication": item,
                    "percent": percent,
                }
            )

    return matches


def save_pending_similarity_matches(publication):
    matches = find_pending_similarity_matches(publication)

    for match in matches:
        save_similarity_match(
            publication=publication,
            matched_publication=match["publication"],
            match_type="similar_text_warning",
            similarity_percent=match["percent"],
            detail=(
                "Похожая публикация также находится на модерации. "
                "Администратор должен сравнить материалы перед решением."
            ),
        )