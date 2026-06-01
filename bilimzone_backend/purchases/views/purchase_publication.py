from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny

from purchases.services.purchase_service import (
    purchase_publication,
    confirm_publication_purchase,
)


class PurchasePublicationView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]

    def post(self, request, publication_id):
        user_id = request.data.get("user_id")

        result = purchase_publication(
            publication_id=publication_id,
            user_id=user_id,
            request=request,
        )

        return Response(
            result.data,
            status=result.status_code,
        )


class ConfirmPurchasePublicationView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]

    def post(self, request, publication_id):
        user_id = request.data.get("user_id")
        confirmation_id = request.data.get("confirmation_id")
        external_reference = request.data.get("external_reference")
        code = request.data.get("code")

        result = confirm_publication_purchase(
            publication_id=publication_id,
            user_id=user_id,
            confirmation_id=confirmation_id,
            external_reference=external_reference,
            code=code,
            request=request,
        )

        return Response(
            result.data,
            status=result.status_code,
        )