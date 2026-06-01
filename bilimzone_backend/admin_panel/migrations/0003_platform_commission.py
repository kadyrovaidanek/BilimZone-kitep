from django.db import migrations, models


def create_default_commission(apps, schema_editor):
    PlatformCommissionSetting = apps.get_model(
        "admin_panel",
        "PlatformCommissionSetting",
    )

    PlatformCommissionSetting.objects.create(
        title="Комиссия платформы",
        commission_percent=20,
        is_active=True,
    )


class Migration(migrations.Migration):

    dependencies = [
        ("admin_panel", "0002_category_remove_material_is_paid_and_more"),
    ]

    operations = [
        migrations.CreateModel(
            name="PlatformCommissionSetting",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "title",
                    models.CharField(
                        default="Комиссия платформы",
                        max_length=255,
                    ),
                ),
                (
                    "commission_percent",
                    models.DecimalField(
                        decimal_places=2,
                        default=20,
                        max_digits=5,
                    ),
                ),
                (
                    "is_active",
                    models.BooleanField(default=True),
                ),
                (
                    "created_at",
                    models.DateTimeField(auto_now_add=True),
                ),
                (
                    "updated_at",
                    models.DateTimeField(auto_now=True),
                ),
            ],
            options={
                "ordering": ["-created_at"],
            },
        ),
        migrations.RunPython(
            create_default_commission,
            migrations.RunPython.noop,
        ),
    ]