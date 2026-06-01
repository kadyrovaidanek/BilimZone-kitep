from django.urls import path
from .views import (
    RegisterView,
    SendRegistrationCodeView,
    VerifyRegistrationCodeView,
    LoginView,
    ProfileView,
    check_username,
    check_email,
)
from .views_public import (
    PublicUserListView,
    PublicUserDetailView,
    AdminUserListView,
    AdminUserDetailView,
)

from .views_wallet import (
    WalletCreateCodeView,
    WalletConfirmCodeView,
    WalletBalanceView,
    WalletTransactionsView,
)

urlpatterns = [
    path("register/send-code/", SendRegistrationCodeView.as_view(), name="register_send_code"),
    path("register/verify-code/", VerifyRegistrationCodeView.as_view(), name="register_verify_code"),
    path("register/", RegisterView.as_view(), name="register"),
    path("login/", LoginView.as_view(), name="login"),
    path("profile/", ProfileView.as_view(), name="profile"),

    path("check-username/", check_username, name="check_username"),
    path("check-email/", check_email, name="check_email"),
   
    path("users/public/", PublicUserListView.as_view(), name="public_users"),
    path("users/public/<int:user_id>/", PublicUserDetailView.as_view(), name="public_user_detail"),

    path("admin/users/", AdminUserListView.as_view(), name="admin_users"),
    path("admin/users/<int:user_id>/", AdminUserDetailView.as_view(), name="admin_user_detail"),
    
    path("wallet/create-code/", WalletCreateCodeView.as_view(), name="wallet_create_code"),
    path("wallet/confirm-code/", WalletConfirmCodeView.as_view(), name="wallet_confirm_code"),
    path("wallet/<int:user_id>/", WalletBalanceView.as_view(), name="wallet_balance"),
    path("wallet/<int:user_id>/transactions/", WalletTransactionsView.as_view(), name="wallet_transactions"),
]