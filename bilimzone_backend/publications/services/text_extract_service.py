import os
import re
import shutil
import subprocess
import tempfile
from pathlib import Path

from django.conf import settings
from pypdf import PdfReader


SUPPORTED_TEXT_EXTENSIONS = [
    ".pdf",
    ".doc",
    ".docx",
    ".ppt",
    ".pptx",
]


def get_file_extension(file_name):
    return os.path.splitext(file_name or "")[1].lower()


def get_libreoffice_path():
    libreoffice_path = getattr(settings, "LIBREOFFICE_PATH", "")

    if libreoffice_path and os.path.exists(libreoffice_path):
        return libreoffice_path

    return "soffice"


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
        print("TEXT EXTRACT LIBREOFFICE ERROR:", error)
        return None

    if result.returncode != 0:
        print("TEXT EXTRACT LIBREOFFICE STDOUT:", result.stdout)
        print("TEXT EXTRACT LIBREOFFICE STDERR:", result.stderr)
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


def extract_text_from_pdf(pdf_path):
    try:
        reader = PdfReader(str(pdf_path))
    except Exception as error:
        print("PDF READ ERROR:", error)
        return ""

    parts = []

    for page in reader.pages:
        try:
            text = page.extract_text() or ""
        except Exception:
            text = ""

        if text:
            parts.append(text)

    return "\n".join(parts)


def save_uploaded_file_to_temp(uploaded_file, temp_dir_path):
    extension = get_file_extension(uploaded_file.name)
    temp_file_path = temp_dir_path / f"uploaded{extension}"

    try:
        uploaded_file.seek(0)
    except Exception:
        pass

    with open(temp_file_path, "wb") as destination:
        if hasattr(uploaded_file, "chunks"):
            for chunk in uploaded_file.chunks():
                destination.write(chunk)
        else:
            shutil.copyfileobj(uploaded_file, destination)

    try:
        uploaded_file.seek(0)
    except Exception:
        pass

    return temp_file_path


def extract_text_from_file(file_obj):
    if not file_obj:
        return ""

    extension = get_file_extension(getattr(file_obj, "name", ""))

    if extension not in SUPPORTED_TEXT_EXTENSIONS:
        return ""

    with tempfile.TemporaryDirectory() as temp_dir:
        temp_dir_path = Path(temp_dir)
        temp_input_path = save_uploaded_file_to_temp(file_obj, temp_dir_path)

        if extension == ".pdf":
            pdf_path = temp_input_path
        else:
            pdf_path = convert_office_to_pdf(temp_input_path, temp_dir_path)

        if not pdf_path:
            return ""

        return extract_text_from_pdf(pdf_path)


def normalize_text_for_hash(value):
    if not value:
        return ""

    text = str(value).lower()
    text = text.replace("ё", "е")
    text = re.sub(r"\s+", " ", text)
    text = re.sub (r"[^\w\sа-яА-ЯёЁ]", "", text, flags=re.UNICODE)

    return text.strip()