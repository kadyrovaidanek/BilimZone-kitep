import json
import re
import urllib.parse
import urllib.request


YANDEX_SPELLER_URL = "https://speller.yandex.net/services/spellservice.json/checkText"


def capitalize_sentences(value):
    if not value:
        return ""

    return re.sub(
        r"(^\s*[а-яa-zё])|([.!?]\s+[а-яa-zё])",
        lambda match: match.group(0).upper(),
        value,
        flags=re.IGNORECASE,
    )


def check_text_with_yandex(text):
    if not text or not text.strip():
        return []

    data = urllib.parse.urlencode({
        "text": text,
        "lang": "ru,en",
        "format": "plain",
    }).encode("utf-8")

    request = urllib.request.Request(
        YANDEX_SPELLER_URL,
        data=data,
        headers={
            "Content-Type": "application/x-www-form-urlencoded",
            "User-Agent": "BilimZone/1.0",
        },
        method="POST",
    )

    try:
        with urllib.request.urlopen(request, timeout=10) as response:
            body = response.read().decode("utf-8")
            return json.loads(body)
    except Exception as error:
        print("YANDEX SPELLCHECK ERROR:", error)
        raise


def build_suggestions(errors):
    suggestions = {}
    unknown_words = []

    for item in errors:
        word = item.get("word", "").strip()
        variants = item.get("s", [])

        if not word:
            continue

        if word not in unknown_words:
            unknown_words.append(word)

        suggestions[word] = variants

    return unknown_words, suggestions


def apply_first_suggestions(text, suggestions):
    fixed_text = text

    for word, variants in suggestions.items():
        if not variants:
            continue

        replacement = variants[0]

        fixed_text = re.sub(
            rf"\b{re.escape(word)}\b",
            replacement,
            fixed_text,
            flags=re.IGNORECASE,
        )

    return capitalize_sentences(fixed_text)


def check_publication_spelling(title, description):
    title = title or ""
    description = description or ""

    title_errors = check_text_with_yandex(title)
    description_errors = check_text_with_yandex(description)

    all_errors = title_errors + description_errors

    unknown_words, suggestions = build_suggestions(all_errors)

    fixed_title = apply_first_suggestions(title, suggestions)
    fixed_description = apply_first_suggestions(description, suggestions)

    has_case_fix = (
        fixed_title != title or
        fixed_description != description
    )

    return {
        "unknownWords": unknown_words,
        "suggestions": suggestions,
        "fixedTitle": fixed_title,
        "fixedDescription": fixed_description,
        "hasCaseFix": has_case_fix,
    }