from django.db.models import Q

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.parsers import JSONParser, FormParser, MultiPartParser

from .models import (
    CatalogCategory,
    CatalogDirection,
    CatalogClassOption,
)

from .serializers import (
    CatalogCategorySerializer,
    CatalogCategoryCreateUpdateSerializer,
    CatalogDirectionSerializer,
    CatalogClassOptionSerializer,
)


class CategoryListCreateView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]
    parser_classes = [JSONParser, FormParser, MultiPartParser]

    def get(self, request):
        is_active = request.GET.get("is_active")
        search = request.GET.get("search", "").strip()

        categories = CatalogCategory.objects.all().prefetch_related(
            "directions",
            "class_options",
        )

        if is_active == "true":
            categories = categories.filter(is_active=True)

        if is_active == "false":
            categories = categories.filter(is_active=False)

        if search:
            categories = categories.filter(
                Q(name_ru__icontains=search)
                | Q(name_kg__icontains=search)
                | Q(directions__name_ru__icontains=search)
                | Q(directions__name_kg__icontains=search)
                | Q(class_options__value__icontains=search)
            ).distinct()

        serializer = CatalogCategorySerializer(categories, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = CatalogCategoryCreateUpdateSerializer(data=request.data)

        if serializer.is_valid():
            category = serializer.save()
            response_serializer = CatalogCategorySerializer(category)
            return Response(response_serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ActiveCategoryListView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]

    def get(self, request):
        categories = CatalogCategory.objects.filter(
            is_active=True
        ).prefetch_related(
            "directions",
            "class_options",
        )

        serializer = CatalogCategorySerializer(categories, many=True)
        return Response(serializer.data)


class CategoryDetailView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]
    parser_classes = [JSONParser, FormParser, MultiPartParser]

    def get(self, request, category_id):
        try:
            category = CatalogCategory.objects.prefetch_related(
                "directions",
                "class_options",
            ).get(id=category_id)
        except CatalogCategory.DoesNotExist:
            return Response({"error": "Категория не найдена"}, status=404)

        serializer = CatalogCategorySerializer(category)
        return Response(serializer.data)

    def put(self, request, category_id):
        try:
            category = CatalogCategory.objects.get(id=category_id)
        except CatalogCategory.DoesNotExist:
            return Response({"error": "Категория не найдена"}, status=404)

        serializer = CatalogCategoryCreateUpdateSerializer(
            category,
            data=request.data,
            partial=True
        )

        if serializer.is_valid():
            category = serializer.save()
            response_serializer = CatalogCategorySerializer(category)
            return Response(response_serializer.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, category_id):
        try:
            category = CatalogCategory.objects.get(id=category_id)
        except CatalogCategory.DoesNotExist:
            return Response({"error": "Категория не найдена"}, status=404)

        category.delete()
        return Response({"message": "Категория удалена"})


class CategoryToggleActiveView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]

    def patch(self, request, category_id):
        try:
            category = CatalogCategory.objects.get(id=category_id)
        except CatalogCategory.DoesNotExist:
            return Response({"error": "Категория не найдена"}, status=404)

        category.is_active = not category.is_active
        category.save()

        serializer = CatalogCategorySerializer(category)
        return Response(serializer.data)


class CategoryDirectionListCreateView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]
    parser_classes = [JSONParser, FormParser, MultiPartParser]

    def post(self, request, category_id):
        try:
            category = CatalogCategory.objects.get(id=category_id)
        except CatalogCategory.DoesNotExist:
            return Response({"error": "Категория не найдена"}, status=404)

        serializer = CatalogDirectionSerializer(data=request.data)

        if serializer.is_valid():
            direction = serializer.save(category=category)
            response_serializer = CatalogDirectionSerializer(direction)
            return Response(response_serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CategoryDirectionDetailView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]
    parser_classes = [JSONParser, FormParser, MultiPartParser]

    def put(self, request, direction_id):
        try:
            direction = CatalogDirection.objects.get(id=direction_id)
        except CatalogDirection.DoesNotExist:
            return Response({"error": "Направление не найдено"}, status=404)

        serializer = CatalogDirectionSerializer(
            direction,
            data=request.data,
            partial=True
        )

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, direction_id):
        try:
            direction = CatalogDirection.objects.get(id=direction_id)
        except CatalogDirection.DoesNotExist:
            return Response({"error": "Направление не найдено"}, status=404)

        direction.delete()
        return Response({"message": "Направление удалено"})


class DirectionToggleActiveView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]

    def patch(self, request, direction_id):
        try:
            direction = CatalogDirection.objects.get(id=direction_id)
        except CatalogDirection.DoesNotExist:
            return Response({"error": "Направление не найдено"}, status=404)

        direction.is_active = not direction.is_active
        direction.save()

        serializer = CatalogDirectionSerializer(direction)
        return Response(serializer.data)


class CategoryClassOptionListCreateView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]
    parser_classes = [JSONParser, FormParser, MultiPartParser]

    def post(self, request, category_id):
        try:
            category = CatalogCategory.objects.get(id=category_id)
        except CatalogCategory.DoesNotExist:
            return Response({"error": "Категория не найдена"}, status=404)

        if category.slug != "school":
            return Response(
                {"error": "Классы можно добавлять только для школьной категории"},
                status=400
            )

        serializer = CatalogClassOptionSerializer(data=request.data)

        if serializer.is_valid():
            option = serializer.save(category=category)
            response_serializer = CatalogClassOptionSerializer(option)
            return Response(response_serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CategoryClassOptionDetailView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]
    parser_classes = [JSONParser, FormParser, MultiPartParser]

    def put(self, request, option_id):
        try:
            option = CatalogClassOption.objects.get(id=option_id)
        except CatalogClassOption.DoesNotExist:
            return Response({"error": "Класс не найден"}, status=404)

        serializer = CatalogClassOptionSerializer(
            option,
            data=request.data,
            partial=True
        )

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, option_id):
        try:
            option = CatalogClassOption.objects.get(id=option_id)
        except CatalogClassOption.DoesNotExist:
            return Response({"error": "Класс не найден"}, status=404)

        option.delete()
        return Response({"message": "Класс удалён"})


class ClassOptionToggleActiveView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]

    def patch(self, request, option_id):
        try:
            option = CatalogClassOption.objects.get(id=option_id)
        except CatalogClassOption.DoesNotExist:
            return Response({"error": "Класс не найден"}, status=404)

        option.is_active = not option.is_active
        option.save()

        serializer = CatalogClassOptionSerializer(option)
        return Response(serializer.data)