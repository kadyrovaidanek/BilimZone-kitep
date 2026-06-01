import os
import tempfile
from pathlib import Path

import fitz
from django.core.files import File


def normalize_page_number(page_number, total_pages):
    try:
        page_number = int(page_number or 1)
    except Exception:
        page_number = 1

    if page_number < 1:
        page_number = 1

    if page_number > total_pages:
        page_number = total_pages

    return page_number


def create_cover_from_pdf_page(publication, pdf_path, page_number=1):
    """
    Создаёт PNG-обложку из выбранной страницы PDF.

    Важно:
    - frontend НЕ отправляет файл обложки;
    - frontend отправляет только cover_page_number;
    - backend сам создаёт PNG и сохраняет в publication.cover.
    """

    if not pdf_path or not os.path.exists(pdf_path):
        return publication

    document = fitz.open(pdf_path)

    try:
        total_pages = document.page_count

        if total_pages == 0:
            return publication

        safe_page_number = normalize_page_number(page_number, total_pages)

        page = document.load_page(safe_page_number - 1)

        matrix = fitz.Matrix(2, 2)
        pixmap = page.get_pixmap(matrix=matrix, alpha=False)

        with tempfile.TemporaryDirectory() as temp_dir:
            temp_dir_path = Path(temp_dir)
            cover_path = (
                temp_dir_path
                / f"publication_{publication.id}_cover_page_{safe_page_number}.png"
            )

            pixmap.save(str(cover_path))

            with open(cover_path, "rb") as cover_file:
                publication.cover.save(
                    f"publication_{publication.id}_cover_page_{safe_page_number}.png",
                    File(cover_file),
                    save=False,
                )

        publication.cover_page_number = safe_page_number
        publication.save(update_fields=["cover", "cover_page_number"])

        return publication

    finally:
        document.close()