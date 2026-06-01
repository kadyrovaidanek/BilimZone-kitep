from django.utils import timezone

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import JSONParser, FormParser, MultiPartParser
from rest_framework.permissions import AllowAny

from publications.models import Publication
from publications.serializers import (
    PublicationSerializer,
    PublicationModerationSerializer,
)
from publications.services import notify_author_about_publication_status
from publications.services.publication_file_check_service import (
    check_publication_file_duplicates,
)


class CheckPublicationView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]
    parser_classes = [JSONParser, FormParser, MultiPartParser]

    def put(self, request, publication_id):
        try:
            publication = Publication.objects.select_related("author_user").get(
                id=publication_id
            )
        except Publication.DoesNotExist:
            return Response(
                {"error": "Публикация не найдена"},
                status=status.HTTP_404_NOT_FOUND,
            )

        old_status = publication.status

        serializer = PublicationModerationSerializer(
            publication,
            data=request.data,
            partial=True,
        )

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        updated = serializer.save()

        if updated.status == "published":
            updated.published_at = timezone.now()
            updated.reject_reason = None
            updated.save()

        if updated.status == "pending":
            updated.reject_reason = None
            updated.published_at = None
            updated.save()

        if updated.status == "rejected":
            updated.published_at = None
            updated.save()

        if old_status != updated.status and updated.status in [
            "published",
            "rejected",
        ]:
            notify_author_about_publication_status(updated)

        return Response(
            PublicationSerializer(
                updated,
                context={"request": request},
            ).data
        )


class CheckPublicationFileView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        uploaded_file = request.FILES.get("file")
        force_submit = str(request.data.get("force_submit", "")).lower() == "true"

        if not uploaded_file:
            return Response(
                {"file": "Файл обязателен"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            check_result = check_publication_file_duplicates(
                uploaded_file=uploaded_file,
                force_submit=force_submit,
                only_published=True,
            )

            return Response(check_result["response_data"])

        except Exception as error:
            print("CHECK FILE ERROR:", error)

            return Response(
                {"file": "Не удалось проверить файл"},
                status=status.HTTP_400_BAD_REQUEST,
            )