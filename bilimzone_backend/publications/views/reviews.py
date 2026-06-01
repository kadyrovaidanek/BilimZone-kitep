from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import JSONParser, FormParser, MultiPartParser
from rest_framework.permissions import AllowAny

from users.models import User

from publications.models import Publication, PublicationReview
from publications.serializers import PublicationReviewSerializer


class PublicationReviewListCreateView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]
    parser_classes = [JSONParser, FormParser, MultiPartParser]

    def get(self, request, publication_id):
        try:
            publication = Publication.objects.get(id=publication_id)
        except Publication.DoesNotExist:
            return Response(
                {"error": "Публикация не найдена"},
                status=status.HTTP_404_NOT_FOUND,
            )

        reviews = PublicationReview.objects.select_related("user").filter(
            publication=publication
        ).order_by("-created_at")

        serializer = PublicationReviewSerializer(reviews, many=True)

        reviews_count = reviews.count()
        average_rating = 0

        if reviews_count > 0:
            total = sum(review.rating for review in reviews)
            average_rating = round(total / reviews_count, 1)

        return Response(
            {
                "average_rating": average_rating,
                "reviews_count": reviews_count,
                "reviews": serializer.data,
            }
        )

    def post(self, request, publication_id):
        user_id = request.data.get("user")
        rating = request.data.get("rating")
        text = str(request.data.get("text", "") or "").strip()

        if not user_id:
            return Response(
                {"user": "Пользователь обязателен"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            publication = Publication.objects.get(id=publication_id)
        except Publication.DoesNotExist:
            return Response(
                {"error": "Публикация не найдена"},
                status=status.HTTP_404_NOT_FOUND,
            )

        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response(
                {"user": "Пользователь не найден"},
                status=status.HTTP_404_NOT_FOUND,
            )

        try:
            rating_value = int(rating)
        except Exception:
            return Response(
                {"rating": "Укажите рейтинг"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if rating_value < 1 or rating_value > 5:
            return Response(
                {"rating": "Рейтинг должен быть от 1 до 5"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        review, created = PublicationReview.objects.update_or_create(
            publication=publication,
            user=user,
            defaults={
                "rating": rating_value,
                "text": text,
            },
        )

        serializer = PublicationReviewSerializer(review)

        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED if created else status.HTTP_200_OK,
        )