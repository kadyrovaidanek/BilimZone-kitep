from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny

from publications.serializers import PublicationSerializer
from publications.selectors import get_publication_by_id


class PublicationDetailView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]

    def get(self, request, publication_id):
        publication = get_publication_by_id(publication_id)

        if not publication:
            return Response(
                {"error": "Публикация не найдена"},
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = PublicationSerializer(
            publication,
            context={"request": request},
        )

        return Response(serializer.data)