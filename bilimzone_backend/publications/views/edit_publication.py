from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.permissions import AllowAny

from publications.serializers import (
    PublicationSerializer,
    EditPublicationSerializer,
)
from publications.selectors import get_publication_by_id
from publications.services import (
    generate_publication_pdf_preview,
    notify_admins_about_publication_request,
)


class EditPublicationView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def put(self, request, publication_id):
        publication = get_publication_by_id(publication_id)

        if not publication:
            return Response(
                {"error": "Публикация не найдена"},
                status=status.HTTP_404_NOT_FOUND,
            )

        old_file_name = publication.file.name if publication.file else None
        old_preview_start_page = publication.preview_start_page
        old_preview_end_page = publication.preview_end_page

        serializer = EditPublicationSerializer(
            publication,
            data=request.data,
            partial=True,
            context={"request": request},
        )

        if serializer.is_valid():
            updated = serializer.save(
                status="pending",
                reject_reason=None,
                published_at=None,
            )

            new_file_name = updated.file.name if updated.file else None

            file_changed = old_file_name != new_file_name
            preview_pages_changed = (
                old_preview_start_page != updated.preview_start_page
                or old_preview_end_page != updated.preview_end_page
            )

            if file_changed or preview_pages_changed:
                updated.preview_file = None
                updated.pdf_file = None
                updated.save(update_fields=["preview_file", "pdf_file"])

                try:
                    generate_publication_pdf_preview(updated)
                    updated.refresh_from_db()
                except Exception as error:
                    print("REGENERATE PDF PREVIEW ERROR:", error)

            notify_admins_about_publication_request(updated)

            return Response(
                PublicationSerializer(
                    updated,
                    context={"request": request},
                ).data
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)