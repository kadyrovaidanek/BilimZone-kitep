from publications.models import Publication
from publications.services.file_hash_service import calculate_file_sha256
from publications.services.similarity_service import analyze_publication_file


def build_match_payload(
    code,
    message,
    matched_publication,
    detail,
    file_sha256=None,
    text_sha256=None,
    similarity_percent=None,
    blocked=False,
):
    return {
        "exists": True,
        "blocked": blocked,
        "code": code,
        "message": message,
        "publication_id": matched_publication.id,
        "publication_title": matched_publication.title,
        "redirect_url": f"/publications/{matched_publication.id}",
        "detail": detail,
        "file_sha256": file_sha256,
        "text_sha256": text_sha256,
        "similarity_percent": similarity_percent,
    }


def build_unique_payload(file_sha256, text_analysis):
    return {
        "exists": False,
        "blocked": False,
        "code": "unique",
        "file_sha256": file_sha256,
        "text_sha256": text_analysis.get("text_sha256"),
        "similarity_percent": text_analysis.get("similarity_percent", 0),
        "message": "Дубликатов не найдено.",
    }


def find_duplicate_file(file_sha256, only_published=True):
    publications = Publication.objects.filter(
        file_sha256=file_sha256,
    )

    if only_published:
        publications = publications.filter(status="published")

    return publications.first()


def check_publication_file_duplicates(
    uploaded_file,
    force_submit=False,
    only_published=True,
):
    file_sha256 = calculate_file_sha256(uploaded_file)

    try:
        uploaded_file.seek(0)
    except Exception:
        pass

    duplicate_file = find_duplicate_file(
        file_sha256=file_sha256,
        only_published=only_published,
    )

    if duplicate_file:
        response_data = build_match_payload(
            code="duplicate_file",
            message="Такой файл уже существует.",
            matched_publication=duplicate_file,
            detail="Файл совпадает по содержимому, а не только по названию.",
            file_sha256=file_sha256,
            similarity_percent=100,
            blocked=True,
        )

    duplicate_file = find_duplicate_file(
        file_sha256=file_sha256,
        only_published=only_published,
    )

    if duplicate_file:
        response_data = build_match_payload(
            code="duplicate_file",
            message="Такой файл уже существует.",
            matched_publication=duplicate_file,
            detail="Файл совпадает по содержимому, а не только по названию.",
            file_sha256=file_sha256,
            similarity_percent=100,
            blocked=True,
        )

        return {
            "has_conflict": True,
            "should_block": True,
            "file_sha256": file_sha256,
            "text_analysis": None,
            "response_data": response_data,
        }

    text_analysis = analyze_publication_file(
        uploaded_file,
        only_published=only_published,
    )

    matched_publication = text_analysis.get("matched_publication")

    if text_analysis["status"] == "duplicate_text" and matched_publication:
        response_data = build_match_payload(
            code="duplicate_text",
            message="Похожий текст уже существует.",
            matched_publication=matched_publication,
            detail=(
                "Текст совпадает после нормализации. Возможно, "
                "изменены только название файла, отступы или пробелы."
            ),
            file_sha256=file_sha256,
            text_sha256=text_analysis.get("text_sha256"),
            similarity_percent=100,
            blocked=True,
        )

        return {
            "has_conflict": True,
            "should_block": True,
            "file_sha256": file_sha256,
            "text_analysis": text_analysis,
            "response_data": response_data,
        }

    if (
        text_analysis["status"] == "similar_text_warning"
        and matched_publication
        and not force_submit
    ):
        similarity_percent = text_analysis.get("similarity_percent")

        response_data = build_match_payload(
            code="similar_text_warning",
            message="В системе найден материал с похожим содержанием.",
            matched_publication=matched_publication,
            detail=(
                f"Совпадение текста: {similarity_percent}%. "
                "Вы можете открыть похожую публикацию или отправить "
                "материал на проверку."
            ),
            file_sha256=file_sha256,
            text_sha256=text_analysis.get("text_sha256"),
            similarity_percent=similarity_percent,
            blocked=False,
        )

        return {
            "has_conflict": True,
            "should_block": False,
            "file_sha256": file_sha256,
            "text_analysis": text_analysis,
            "response_data": response_data,
        }

    return {
        "has_conflict": False,
        "should_block": False,
        "file_sha256": file_sha256,
        "text_analysis": text_analysis,
        "response_data": build_unique_payload(file_sha256, text_analysis),
    }