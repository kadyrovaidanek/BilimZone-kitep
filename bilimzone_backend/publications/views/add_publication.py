from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.permissions import AllowAny

from users.models import User

from publications.serializers import PublicationSerializer
from publications.serializers.add_publication import AddPublicationSerializer

from publications.services.preview_service import generate_publication_pdf_preview
from publications.services.cover_service import create_cover_from_pdf_page
from publications.services.notification_service import (
    notify_admins_about_publication_request,
)
from publications.services.publication_similarity_match_service import (
    clear_publication_similarity_matches,
    save_current_check_result,
    save_pending_similarity_matches,
)
from publications.services.publication_file_check_service import (
    check_publication_file_duplicates,
)
from publications.services.similarity_service import save_text_analysis_to_publication


class AddPublicationView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def post(self, request):
        author_user_id = request.data.get("author_user")

        if not author_user_id:
            return Response(
                {"author_user": "author_user обязателен"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            author_user_id = int(author_user_id)
        except (TypeError, ValueError):
            return Response(
                {"author_user": "Некорректный ID пользователя"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            User.objects.get(id=author_user_id)
        except User.DoesNotExist:
            return Response(
                {"author_user": "Пользователь не найден"},
                status=status.HTTP_404_NOT_FOUND,
            )

        uploaded_file = request.FILES.get("file")
        force_submit = str(request.data.get("force_submit", "")).lower() == "true"

        file_hash = None
        text_analysis = None

        if uploaded_file:
            try:
                check_result = check_publication_file_duplicates(
                    uploaded_file=uploaded_file,
                    force_submit=force_submit,
                    only_published=True,
                )

                file_hash = check_result["file_sha256"]
                text_analysis = check_result["text_analysis"]

                if check_result["has_conflict"]:
                    if check_result["should_block"] or not force_submit:
                        return Response(
                            check_result["response_data"],
                            status=status.HTTP_409_CONFLICT,
                        )

            except Exception as error:
                print("PUBLICATION FILE CHECK ERROR:", error)

                return Response(
                    {
                        "file": (
                            "Не удалось проверить файл. "
                            "Попробуйте загрузить его ещё раз."
                        )
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

        serializer = AddPublicationSerializer(
            data=request.data,
            context={"request": request},
        )

        if not serializer.is_valid():
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST,
            )

        publication = serializer.save(status="pending")

        if file_hash:
            publication.file_sha256 = file_hash
            publication.save(update_fields=["file_sha256"])

        if text_analysis:
            save_text_analysis_to_publication(publication, text_analysis)

            clear_publication_similarity_matches(publication)
            save_current_check_result(
                publication=publication,
                check_result={
                    "text_analysis": text_analysis,
                    "response_data": {},
                },
            )
            save_pending_similarity_matches(publication)

        try:
            generate_publication_pdf_preview(publication)
            publication.refresh_from_db()

            if publication.pdf_file and not publication.cover:
                create_cover_from_pdf_page(
                    publication=publication,
                    pdf_path=publication.pdf_file.path,
                    page_number=publication.cover_page_number,
                )
                publication.refresh_from_db()

        except Exception as error:
            print("PUBLICATION FILE PROCESSING ERROR:", error)

        try:
            notify_admins_about_publication_request(publication)
        except Exception as error:
            print("PUBLICATION ADMIN NOTIFICATION ERROR:", error)

        return Response(
            PublicationSerializer(
                publication,
                context={"request": request},
            ).data,
            status=status.HTTP_201_CREATED,
        )