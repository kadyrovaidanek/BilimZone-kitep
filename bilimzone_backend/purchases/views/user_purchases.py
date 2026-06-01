from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny

from users.models import User

from purchases.selectors import get_user_purchases
from purchases.serializers import PublicationPurchaseSerializer


class UserPurchasesView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]

    def get(self, request, user_id):
        try:
            buyer = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response(
                {"error": "Пользователь не найден"},
                status=status.HTTP_404_NOT_FOUND,
            )

        purchases = get_user_purchases(buyer)

        serializer = PublicationPurchaseSerializer(
            purchases,
            many=True,
            context={"request": request},
        )

        return Response(serializer.data)