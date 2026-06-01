import hashlib
from difflib import SequenceMatcher

from django.utils import timezone

from publications.models import Publication
from publications.services.text_extract_service import (
    extract_text_from_file,
    normalize_text_for_hash,
)


MIN_TEXT_LENGTH_FOR_CHECK = 80
HIGH_SIMILARITY_PERCENT = 75


def calculate_text_sha256(normalized_text):
    return hashlib.sha256(normalized_text.encode("utf-8")).hexdigest()


def calculate_similarity_percent(text_a, text_b):
    if not text_a or not text_b:
        return 0

    ratio = SequenceMatcher(None, text_a, text_b).ratio()
    return round(ratio * 100)


def get_publications_for_similarity_check(
    exclude_publication_id=None,
    only_published=True,
):
    publications = Publication.objects.exclude(
        extracted_text__isnull=True,
    ).exclude(
        extracted_text="",
    )

    if only_published:
        publications = publications.filter(status="published")

    if exclude_publication_id:
        publications = publications.exclude(id=exclude_publication_id)

    return publications


def analyze_publication_file(
    file_obj,
    exclude_publication_id=None,
    only_published=True,
):
    raw_text = extract_text_from_file(file_obj)
    normalized_text = normalize_text_for_hash(raw_text)

    if len(normalized_text) < MIN_TEXT_LENGTH_FOR_CHECK:
        return {
            "status": "ok",
            "text_sha256": None,
            "extracted_text": raw_text,
            "normalized_text": normalized_text,
            "similarity_percent": 0,
            "matched_publication": None,
            "message": "Текста недостаточно для проверки похожести.",
        }

    text_sha256 = calculate_text_sha256(normalized_text)

    publications = get_publications_for_similarity_check(
        exclude_publication_id=exclude_publication_id,
        only_published=only_published,
    )

    exact_duplicate = publications.filter(
        text_sha256=text_sha256,
    ).first()

    if exact_duplicate:
        return {
            "status": "duplicate_text",
            "text_sha256": text_sha256,
            "extracted_text": raw_text,
            "normalized_text": normalized_text,
            "matched_publication": exact_duplicate,
            "similarity_percent": 100,
            "message": "Похожий текст уже существует.",
        }

    best_match = None
    best_percent = 0

    for publication in publications.only(
        "id",
        "title",
        "extracted_text",
        "text_sha256",
    ):
        existing_text = normalize_text_for_hash(publication.extracted_text or "")

        if len(existing_text) < MIN_TEXT_LENGTH_FOR_CHECK:
            continue

        percent = calculate_similarity_percent(normalized_text, existing_text)

        if percent > best_percent:
            best_percent = percent
            best_match = publication

    if best_match and best_percent >= HIGH_SIMILARITY_PERCENT:
        return {
            "status": "similar_text_warning",
            "text_sha256": text_sha256,
            "extracted_text": raw_text,
            "normalized_text": normalized_text,
            "matched_publication": best_match,
            "similarity_percent": best_percent,
            "message": "В системе найден материал с похожим содержанием.",
        }

    return {
        "status": "ok",
        "text_sha256": text_sha256,
        "extracted_text": raw_text,
        "normalized_text": normalized_text,
        "similarity_percent": best_percent,
        "matched_publication": best_match,
        "message": "Похожих материалов не найдено.",
    }


def save_text_analysis_to_publication(publication, analysis):
    publication.text_sha256 = analysis.get("text_sha256")
    publication.extracted_text = analysis.get("extracted_text") or ""
    publication.similarity_checked_at = timezone.now()

    publication.save(
        update_fields=[
            "text_sha256",
            "extracted_text",
            "similarity_checked_at",
        ]
    )