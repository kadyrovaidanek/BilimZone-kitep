from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.permissions import AllowAny

from .models import (
    AgreementTemplate,
    Category,
    CategoryDirection,
    CategoryOption,
    PlatformCommissionSetting,
)

from .serializers import (
    AgreementTemplateSerializer,
    CategorySerializer,
    CategoryDirectionSerializer,
    CategoryOptionSerializer,
    PlatformCommissionSettingSerializer,
)


class AgreementListCreateView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get(self, request):
        audience = request.GET.get("audience")
        context_value = request.GET.get("context")
        is_active = request.GET.get("is_active")

        agreements = AgreementTemplate.objects.all().order_by("-created_at")

        if audience and audience != "all_filter":
            agreements = agreements.filter(audience=audience)

        if context_value and context_value != "all_filter":
            agreements = agreements.filter(context=context_value)

        if is_active == "true":
            agreements = agreements.filter(is_active=True)

        if is_active == "false":
            agreements = agreements.filter(is_active=False)

        serializer = AgreementTemplateSerializer(
            agreements,
            many=True,
            context={"request": request},
        )

        return Response(serializer.data)

    def post(self, request):
        serializer = AgreementTemplateSerializer(
            data=request.data,
            context={"request": request},
        )

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AgreementDetailView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def put(self, request, agreement_id):
        try:
            agreement = AgreementTemplate.objects.get(id=agreement_id)
        except AgreementTemplate.DoesNotExist:
            return Response(
                {"error": "Agreement not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = AgreementTemplateSerializer(
            agreement,
            data=request.data,
            partial=True,
            context={"request": request},
        )

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, agreement_id):
        try:
            agreement = AgreementTemplate.objects.get(id=agreement_id)
        except AgreementTemplate.DoesNotExist:
            return Response(
                {"error": "Agreement not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

        agreement.delete()

        return Response({"message": "Agreement deleted successfully"})


class ActiveAgreementView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]

    def get(self, request):
        audience = request.GET.get("audience")
        context_value = request.GET.get("context")

        if not audience or not context_value:
            return Response(
                {"error": "audience and context are required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        allowed_audiences = [
            "reader",
            "author",
            "organization",
        ]

        allowed_contexts = [
            "registration",
            "paid_material",
            "publication",
        ]

        if audience not in allowed_audiences:
            return Response(
                {"error": "Invalid audience"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if context_value not in allowed_contexts:
            return Response(
                {"error": "Invalid context"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        audience_values = [audience, "all"]

        if audience in ["author", "organization"]:
            audience_values.append("author_organization")

        agreements = AgreementTemplate.objects.filter(
            is_active=True,
            context__in=[context_value, "all"],
            audience__in=audience_values,
        ).order_by("-updated_at", "-created_at")

        agreement = agreements.first()

        if not agreement:
            return Response({"agreement": None})

        serializer = AgreementTemplateSerializer(
            agreement,
            context={"request": request},
        )

        return Response({"agreement": serializer.data})


class PlatformCommissionSettingView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]

    def get_active_setting(self):
        setting = PlatformCommissionSetting.objects.filter(
            is_active=True,
        ).order_by("-updated_at", "-created_at").first()

        if setting:
            return setting

        return PlatformCommissionSetting.objects.create(
            title="Комиссия платформы",
            commission_percent=20,
            is_active=True,
        )

    def get(self, request):
        setting = self.get_active_setting()
        serializer = PlatformCommissionSettingSerializer(setting)

        return Response(serializer.data)

    def put(self, request):
        setting = self.get_active_setting()

        serializer = PlatformCommissionSettingSerializer(
            setting,
            data=request.data,
            partial=True,
        )

        if serializer.is_valid():
            serializer.save(is_active=True)

            PlatformCommissionSetting.objects.exclude(
                id=serializer.instance.id,
            ).update(is_active=False)

            return Response(serializer.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CategoryListCreateView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]
    parser_classes = [JSONParser, FormParser, MultiPartParser]

    def get(self, request):
        is_active = request.GET.get("is_active")
        search = request.GET.get("search", "").strip()

        categories = Category.objects.all().order_by("sort_order", "id")

        if is_active == "true":
            categories = categories.filter(is_active=True)

        if is_active == "false":
            categories = categories.filter(is_active=False)

        if search:
            categories = categories.filter(name_ru__icontains=search) | categories.filter(
                name_kg__icontains=search
            )

        serializer = CategorySerializer(categories, many=True)

        return Response(serializer.data)

    def post(self, request):
        serializer = CategorySerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CategoryDetailView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]
    parser_classes = [JSONParser, FormParser, MultiPartParser]

    def get(self, request, category_id):
        try:
            category = Category.objects.get(id=category_id)
        except Category.DoesNotExist:
            return Response(
                {"error": "Category not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = CategorySerializer(category)

        return Response(serializer.data)

    def put(self, request, category_id):
        try:
            category = Category.objects.get(id=category_id)
        except Category.DoesNotExist:
            return Response(
                {"error": "Category not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = CategorySerializer(
            category,
            data=request.data,
            partial=True,
        )

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, category_id):
        try:
            category = Category.objects.get(id=category_id)
        except Category.DoesNotExist:
            return Response(
                {"error": "Category not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

        category.delete()

        return Response({"message": "Category deleted successfully"})


class DirectionDetailView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]
    parser_classes = [JSONParser, FormParser, MultiPartParser]

    def put(self, request, direction_id):
        try:
            direction = CategoryDirection.objects.get(id=direction_id)
        except CategoryDirection.DoesNotExist:
            return Response(
                {"error": "Direction not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = CategoryDirectionSerializer(
            direction,
            data=request.data,
            partial=True,
        )

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, direction_id):
        try:
            direction = CategoryDirection.objects.get(id=direction_id)
        except CategoryDirection.DoesNotExist:
            return Response(
                {"error": "Direction not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

        direction.delete()

        return Response({"message": "Direction deleted successfully"})


class OptionDetailView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]
    parser_classes = [JSONParser, FormParser, MultiPartParser]

    def put(self, request, option_id):
        try:
            option = CategoryOption.objects.get(id=option_id)
        except CategoryOption.DoesNotExist:
            return Response(
                {"error": "Option not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = CategoryOptionSerializer(
            option,
            data=request.data,
            partial=True,
        )

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, option_id):
        try:
            option = CategoryOption.objects.get(id=option_id)
        except CategoryOption.DoesNotExist:
            return Response(
                {"error": "Option not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

        option.delete()

        return Response({"message": "Option deleted successfully"})