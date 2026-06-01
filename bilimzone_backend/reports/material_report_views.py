from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from reports.material_report_service import (    get_admin_material_report_data,
    get_owner_material_report_data,
)


class OwnerMaterialReportView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]

    def get(self, request, user_id, publication_id):
        data = get_owner_material_report_data(
            request=request,
            publication_id=publication_id,
            owner_user_id=user_id,
        )

        if "error" in data:
            return Response(
                {"error": data["error"]},
                status=data.get("status_code", status.HTTP_400_BAD_REQUEST),
            )

        return Response(data)


class AdminMaterialReportView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]

    def get(self, request, publication_id):
        data = get_admin_material_report_data(
            request=request,
            publication_id=publication_id,
        )

        if "error" in data:
            return Response(
                {"error": data["error"]},
                status=data.get("status_code", status.HTTP_400_BAD_REQUEST),
            )

        return Response(data)