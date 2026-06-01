from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny

from publications.serializers import PublicationSerializer
from publications.selectors import (
    get_all_publications,
    get_published_publications,
)


class PublicationListView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]

    def get(self, request):
        publications = get_all_publications(request.GET)

        serializer = PublicationSerializer(
            publications,
            many=True,
            context={"request": request},
        )

        return Response(serializer.data)


class PublishedPublicationListView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]

    def get(self, request):
        publications = get_published_publications(request.GET)

        serializer = PublicationSerializer(
            publications,
            many=True,
            context={"request": request},
        )

        return Response(serializer.data)