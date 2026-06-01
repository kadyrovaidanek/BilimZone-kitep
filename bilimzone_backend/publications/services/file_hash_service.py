import hashlib


def calculate_file_sha256(file_obj):
    """
    Считает SHA-256 по содержимому файла.
    Используется для проверки: есть ли уже такой файл в системе.
    Проверка идёт не по названию, а по внутреннему содержимому.
    """
    sha256 = hashlib.sha256()

    try:
        current_position = file_obj.tell()
    except Exception:
        current_position = 0

    file_obj.seek(0)

    for chunk in file_obj.chunks():
        sha256.update(chunk)

    file_obj.seek(current_position)

    return sha256.hexdigest()