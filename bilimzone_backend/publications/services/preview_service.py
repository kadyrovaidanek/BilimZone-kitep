import os
import shutil
import subprocess
import tempfile
from pathlib import Path
from uuid import uuid4

from django.conf import settings
from django.core.files import File
from pypdf import PdfReader, PdfWriter

from publications.constants import SUPPORTED_PUBLICATION_EXTENSIONS


def get_file_extension(file_name):
    return os.path.splitext(file_name or "")[1].lower()


def get_libreoffice_path():
    libreoffice_path = getattr(settings, "LIBREOFFICE_PATH", "")

    if libreoffice_path and os.path.exists(libreoffice_path):
        return libreoffice_path

    return "soffice"


def save_file_to_field(instance, field_name, save_name, local_path):
    field = getattr(instance, field_name)

    with open(local_path, "rb") as file:
        field.save(save_name, File(file), save=False)


def convert_office_to_pdf(source_path, output_dir):
    command = [
        get_libreoffice_path(),
        "--headless",
        "--nologo",
        "--nofirststartwizard",
        "--convert-to",
        "pdf",
        "--outdir",
        str(output_dir),
        str(source_path),
    ]

    try:
        result = subprocess.run(
            command,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            timeout=120,
        )
    except Exception as error:
        print("LIBREOFFICE ERROR:", error)
        return None

    if result.returncode != 0:
        print("LIBREOFFICE STDOUT:", result.stdout)
        print("LIBREOFFICE STDERR:", result.stderr)
        return None

    source_path = Path(source_path)
    output_dir = Path(output_dir)

    expected_pdf_path = output_dir / f"{source_path.stem}.pdf"

    if expected_pdf_path.exists():
        return expected_pdf_path

    pdf_files = list(output_dir.glob("*.pdf"))

    if pdf_files:
        return pdf_files[0]

    return None


def normalize_preview_pages(start_page, end_page, total_pages):
    if total_pages <= 0:
        return None, None

    try:
        start = int(start_page or 1)
    except Exception:
        start = 1

    try:
        end = int(end_page or start)
    except Exception:
        end = start

    start = max(start, 1)
    end = max(end, start)

    if end - start > 4:
        end = start + 4

    if start > total_pages:
        start = 1
        end = min(3, total_pages)

    end = min(end, total_pages)

    return start, end


def create_preview_pdf(full_pdf_path, output_pdf_path, start_page, end_page):
    reader = PdfReader(str(full_pdf_path))
    writer = PdfWriter()

    total_pages = len(reader.pages)

    start, end = normalize_preview_pages(
        start_page=start_page,
        end_page=end_page,
        total_pages=total_pages,
    )

    if not start or not end:
        return False

    for page_index in range(start - 1, end):
        writer.add_page(reader.pages[page_index])

    with open(output_pdf_path, "wb") as output:
        writer.write(output)

    return True


def convert_publication_file_to_pdf(source_path, original_ext, temp_dir_path):
    if original_ext == ".pdf":
        return Path(source_path)

    return convert_office_to_pdf(source_path, temp_dir_path)


def generate_publication_pdf_preview(publication):
    if not publication.file:
        return publication

    original_ext = get_file_extension(publication.file.name)

    if original_ext not in SUPPORTED_PUBLICATION_EXTENSIONS:
        return publication

    source_path = publication.file.path

    if not os.path.exists(source_path):
        return publication

    with tempfile.TemporaryDirectory() as temp_dir:
        temp_dir_path = Path(temp_dir)

        temp_input_path = temp_dir_path / Path(source_path).name
        shutil.copy2(source_path, temp_input_path)

        full_pdf_path = convert_publication_file_to_pdf(
            source_path=temp_input_path,
            original_ext=original_ext,
            temp_dir_path=temp_dir_path,
        )

        if not full_pdf_path:
            return publication

        full_pdf_name = f"publication_{publication.id}.pdf"
        preview_pdf_name = f"publication_{publication.id}_preview.pdf"

        save_file_to_field(
            publication,
            "pdf_file",
            full_pdf_name,
            full_pdf_path,
        )

        preview_pdf_path = temp_dir_path / preview_pdf_name

        created = create_preview_pdf(
            full_pdf_path=full_pdf_path,
            output_pdf_path=preview_pdf_path,
            start_page=publication.preview_start_page,
            end_page=publication.preview_end_page,
        )

        if created and preview_pdf_path.exists():
            save_file_to_field(
                publication,
                "preview_file",
                preview_pdf_name,
                preview_pdf_path,
            )

            publication.save(update_fields=["pdf_file", "preview_file"])
        else:
            publication.save(update_fields=["pdf_file"])

    return publication


def generate_temporary_preview_pdf(uploaded_file, start_page=1, end_page=3):
    original_ext = get_file_extension(uploaded_file.name)

    if original_ext not in SUPPORTED_PUBLICATION_EXTENSIONS:
        return {
            "success": False,
            "error": "Формат файла не поддерживается.",
            "preview_path": None,
            "preview_name": None,
        }

    temp_preview_dir = Path(settings.MEDIA_ROOT) / "publications" / "temp_previews"
    temp_preview_dir.mkdir(parents=True, exist_ok=True)

    with tempfile.TemporaryDirectory() as temp_dir:
        temp_dir_path = Path(temp_dir)

        safe_input_name = f"source_{uuid4().hex}{original_ext}"
        temp_input_path = temp_dir_path / safe_input_name

        with open(temp_input_path, "wb") as destination:
            for chunk in uploaded_file.chunks():
                destination.write(chunk)

        full_pdf_path = convert_publication_file_to_pdf(
            source_path=temp_input_path,
            original_ext=original_ext,
            temp_dir_path=temp_dir_path,
        )

        if not full_pdf_path or not Path(full_pdf_path).exists():
            return {
                "success": False,
                "error": "Не удалось подготовить предпросмотр файла.",
                "preview_path": None,
                "preview_name": None,
            }

        preview_name = f"temp_preview_{uuid4().hex}.pdf"
        preview_path = temp_preview_dir / preview_name

        created = create_preview_pdf(
            full_pdf_path=full_pdf_path,
            output_pdf_path=preview_path,
            start_page=start_page,
            end_page=end_page,
        )

        if not created or not preview_path.exists():
            return {
                "success": False,
                "error": "Не удалось создать предпросмотр выбранных страниц.",
                "preview_path": None,
                "preview_name": None,
            }

    return {
        "success": True,
        "error": None,
        "preview_path": preview_path,
        "preview_name": preview_name,
    }