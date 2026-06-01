from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny

from reports.services import get_admin_report_data, get_owner_report_data
from reports.export_service import export_report


class AdminAnalyticsReportView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]

    def get(self, request):
        data = get_admin_report_data(request)
        return Response(data)


class OwnerAnalyticsReportView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]

    def get(self, request, user_id):
        data = get_owner_report_data(request, user_id)
        return Response(data)


class AdminReportExportView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]

    def get(self, request, export_format):
        return export_report(
            role="admin",
            export_format=export_format,
            request=request,
        )


class OwnerReportExportView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]

    def get(self, request, user_id, export_format):
        return export_report(
            role="owner",
            export_format=export_format,
            request=request,
            user_id=user_id,
        )