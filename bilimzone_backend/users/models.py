from django.db import models
from django.contrib.auth.hashers import make_password


# =========================
# ROLE
# =========================
class Role(models.Model):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name


# =========================
# USER
# =========================
class User(models.Model):
    email = models.EmailField(unique=True)
    password = models.TextField()
    username = models.CharField(max_length=100, unique=True)

    role = models.ForeignKey(Role, on_delete=models.CASCADE)

    status = models.CharField(max_length=50, default="active")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.email

    @classmethod
    def create_user(cls, **kwargs):
        password = kwargs.pop("password")
        user = cls(**kwargs)
        user.password = make_password(password)
        user.save()
        return user


# =========================
# READER
# =========================
class ReaderProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)

    username = models.CharField(max_length=100)
    email = models.EmailField()
    password = models.TextField()

    first_name = models.CharField(max_length=100, null=True, blank=True)
    surname = models.CharField(max_length=100, null=True, blank=True)
    father_name = models.CharField(max_length=100, null=True, blank=True)
    phone_number = models.CharField(max_length=20, null=True, blank=True)

    photo = models.ImageField(upload_to="users/", null=True, blank=True)

    status = models.CharField(max_length=50, default="active")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Reader: {self.email}"


# =========================
# AUTHOR
# =========================
class AuthorProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)

    username = models.CharField(max_length=100)
    email = models.EmailField()
    password = models.TextField()

    first_name = models.CharField(max_length=100, null=True, blank=True)
    surname = models.CharField(max_length=100, null=True, blank=True)
    father_name = models.CharField(max_length=100, null=True, blank=True)
    phone_number = models.CharField(max_length=20, null=True, blank=True)

    bio = models.TextField(null=True, blank=True)
    specialization = models.TextField(null=True, blank=True)

    rating = models.DecimalField(max_digits=3, decimal_places=2, default=0)
    total_sales = models.IntegerField(default=0)

    photo = models.ImageField(upload_to="authors/", null=True, blank=True)

    status = models.CharField(max_length=50, default="active")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Author: {self.email}"


# =========================
# ORGANIZATION
# =========================
class OrganizationProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)

    username = models.CharField(max_length=100)
    email = models.EmailField()
    password = models.TextField()

    organization_name = models.CharField(max_length=255)
    full_name = models.CharField(max_length=255)

    bio = models.TextField(null=True, blank=True)
    address = models.TextField(null=True, blank=True)
    website = models.TextField(null=True, blank=True)

    photo = models.ImageField(upload_to="orgs/", null=True, blank=True)

    status = models.CharField(max_length=50, default="active")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Organization: {self.organization_name}"


# =========================
# MANAGER / ADMIN
# =========================
class ManagerProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)

    def __str__(self):
        return f"Manager: {self.user.email}"

# =========================
# WALLET
# =========================
class UserWallet(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="wallet",
    )

    balance = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0,
    )

    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Wallet: {self.user.username} — {self.balance}"


class WalletTransaction(models.Model):
    TRANSACTION_TYPES = [
        ("deposit", "Deposit"),
        ("withdraw", "Withdraw"),
        ("purchase", "Purchase"),
        ("sale_income", "Sale income"),
        ("system_income", "System income"),
    ]

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="wallet_transactions",
    )

    transaction_type = models.CharField(
        max_length=50,
        choices=TRANSACTION_TYPES,
    )

    amount = models.DecimalField(
        max_digits=12,
        decimal_places=2,
    )

    title = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)

    balance_after = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0,
    )

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.user.username} — {self.transaction_type} — {self.amount}"

# =========================
# EMAIL VERIFICATION CODE
# =========================
class EmailVerificationCode(models.Model):
    email = models.EmailField(unique=True)
    code = models.CharField(max_length=4)
    purpose = models.CharField(max_length=50, default="registration")
    attempts = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()

    def __str__(self):
        return f"{self.email} — {self.code}"
