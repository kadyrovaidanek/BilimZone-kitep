from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import AllowAny

from publications.services.preview_service import generate_temporary_preview_pdf


class TemporaryPublicationPreviewView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        uploaded_file = request.FILES.get("file")
        preview_start_page = request.data.get("preview_start_page", 1)
        preview_end_page = request.data.get("preview_end_page", 3)

        if not uploaded_file:
            return Response(
                {"file": "Файл обязателен"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        result = generate_temporary_preview_pdf(
            uploaded_file=uploaded_file,
            start_page=preview_start_page,
            end_page=preview_end_page,
        )

        if not result["success"]:
            return Response(
                {
                    "preview_url": None,
                    "message": result["error"],
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        preview_url = (
            request.build_absolute_uri("/media/publications/temp_previews/")
            + result["preview_name"]
        )

        return Response(
            {
                "preview_url": preview_url,
                "message": "Предпросмотр подготовлен.",
            },
            status=status.HTTP_200_OK,
        )