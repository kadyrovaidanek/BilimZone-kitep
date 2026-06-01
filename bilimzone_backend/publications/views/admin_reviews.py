from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny

from publications.models import PublicationReview
from publications.serializers.admin_reviews import AdminPublicationReviewSerializer


class AdminPublicationReviewListView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]

    def get(self, request):
        reviews = PublicationReview.objects.select_related(
            "publication",
            "user",
        ).order_by("-created_at")

        serializer = AdminPublicationReviewSerializer(reviews, many=True)

        return Response(
            {
                "count": reviews.count(),
                "reviews": serializer.data,
            },
            status=status.HTTP_200_OK,
        )


class AdminPublicationReviewDeleteView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]

    def delete(self, request, review_id):
        try:
            review = PublicationReview.objects.get(id=review_id)
        except PublicationReview.DoesNotExist:
            return Response(
                {"error": "Отзыв не найден"},
                status=status.HTTP_404_NOT_FOUND,
            )

        review.delete()

        return Response(
            {"message": "Отзыв удалён"},
            status=status.HTTP_200_OK,
        )