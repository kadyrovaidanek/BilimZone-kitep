from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from publications.services.spellcheck_service import check_publication_spelling


class SpellcheckView(APIView):
    def post(self, request):
        title = request.data.get("title", "")
        description = request.data.get("description", "")

        try:
            result = check_publication_spelling(title, description)
            return Response(result, status=status.HTTP_200_OK)
        except Exception:
            return Response(
                {
                    "message": "Не удалось проверить текст через Яндекс Спеллер."
                },
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )