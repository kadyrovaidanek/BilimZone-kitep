from users.models import User
from notifications.models import Notification


def notify_free_publication_added(publication, buyer):
    Notification.objects.create(
        recipient=buyer,
        title="Публикация добавлена в коллекцию",
        message=f"Бесплатная публикация «{publication.title}» добавлена в вашу коллекцию.",
        notification_type="free_publication_access",
        link=f"/publications/{publication.id}",
    )


def notify_paid_publication_purchased(
    publication,
    buyer,
    owner_amount,
    system_amount,
    price,
):
    owner = publication.author_user

    Notification.objects.create(
        recipient=buyer,
        title="Покупка успешно выполнена",
        message=f"Вы приобрели публикацию «{publication.title}» за {price} сом.",
        notification_type="publication_purchase_success",
        link=f"/publications/{publication.id}",
    )

    Notification.objects.create(
        recipient=owner,
        title="Вашу публикацию купили",
        message=(
            f"Пользователь {buyer.username} купил публикацию «{publication.title}». "
            f"Вам начислено {owner_amount} сом."
        ),
        notification_type="publication_bought",
        link=f"/publications/{publication.id}",
    )

    admins = User.objects.filter(role__name="manager_admin")

    for admin in admins:
        Notification.objects.create(
            recipient=admin,
            title="Новая покупка публикации",
            message=(
                f"Пользователь {buyer.username} купил публикацию «{publication.title}». "
                f"Системе начислено {system_amount} сом."
            ),
            notification_type="system_commission_income",
            link="/reports",
        )