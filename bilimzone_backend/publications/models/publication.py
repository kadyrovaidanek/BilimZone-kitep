from django.db import models

from users.models import User
from admin_panel.models import Category, CategoryDirection, CategoryOption


class Publication(models.Model):
    STATUS_CHOICES = [
        ("draft", "Черновик"),
        ("pending", "На проверке"),
        ("published", "Опубликован"),
        ("rejected", "Отклонён"),
    ]

    PRICE_TYPE_CHOICES = [
        ("free", "Бесплатно"),
        ("paid", "Платно"),
    ]

    PUBLICATION_TYPE_CHOICES = [
        ("book", "Книга"),
        ("article", "Научная статья"),
        ("coursework", "Курсовая работа"),
        ("diploma", "Дипломная работа"),
        ("lecture", "Лекция / конспект"),
        ("methodical", "Методическое пособие"),
        ("test", "Тест"),
        ("other", "Другое"),
    ]

    author_user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="publications",
    )

    category = models.ForeignKey(
        Category,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="publications",
    )

    direction = models.ForeignKey(
        CategoryDirection,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="publications",
    )

    option = models.ForeignKey(
        CategoryOption,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="publications",
    )

    title = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)

    publication_type = models.CharField(
        max_length=50,
        choices=PUBLICATION_TYPE_CHOICES,
        default="other",
    )

    price_type = models.CharField(
        max_length=50,
        choices=PRICE_TYPE_CHOICES,
        default="free",
    )

    price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0,
    )

    file = models.FileField(
        upload_to="publications/files/",
        null=True,
        blank=True,
    )

    preview_file = models.FileField(
        upload_to="publications/previews/",
        null=True,
        blank=True,
    )

    pdf_file = models.FileField(
        upload_to="publications/pdf/",
        null=True,
        blank=True,
    )

    cover = models.ImageField(
        upload_to="publications/covers/",
        null=True,
        blank=True,
    )

    file_sha256 = models.CharField(
        max_length=64,
        null=True,
        blank=True,
        db_index=True,
    )
     
    text_sha256 = models.CharField(
        max_length=64,
        null=True,
        blank=True,
        db_index=True,
    )

    extracted_text = models.TextField(
        null=True,
        blank=True,
    )

    similarity_checked_at = models.DateTimeField(
        null=True,
        blank=True,
    )
    
    cover_page_number = models.PositiveIntegerField(default=1)

    preview_start_page = models.PositiveIntegerField(default=1)
    preview_end_page = models.PositiveIntegerField(default=3)

    status = models.CharField(
        max_length=50,
        choices=STATUS_CHOICES,
        default="pending",
    )

    reject_reason = models.TextField(null=True, blank=True)
    agreement_accepted = models.BooleanField(default=False)

    views_count = models.PositiveIntegerField(default=0)
    downloads_count = models.PositiveIntegerField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    published_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.title
    
class PublicationSimilarityMatch(models.Model):
    MATCH_TYPE_CHOICES = [
        ("duplicate_file", "Дубликат файла"),
        ("duplicate_text", "Дубликат текста"),
        ("similar_text_warning", "Похожий текст"),
    ]

    publication = models.ForeignKey(
        Publication,
        on_delete=models.CASCADE,
        related_name="similarity_matches",
    )

    matched_publication = models.ForeignKey(
        Publication,
        on_delete=models.CASCADE,
        related_name="matched_similarity_publications",
    )

    match_type = models.CharField(
        max_length=50,
        choices=MATCH_TYPE_CHOICES,
    )

    similarity_percent = models.PositiveIntegerField(default=0)

    matched_status = models.CharField(
        max_length=50,
        default="published",
    )

    detail = models.TextField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-similarity_percent", "-created_at"]
        unique_together = [
            ("publication", "matched_publication", "match_type"),
        ]

    def __str__(self):
        return (
            f"{self.publication_id} -> "
            f"{self.matched_publication_id} "
            f"({self.similarity_percent}%)"
        )