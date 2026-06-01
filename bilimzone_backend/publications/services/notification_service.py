from users.models import User
from notifications.models import Notification


def notify_admins_about_publication_request(publication):
    """
    Уведомляет администраторов о новой заявке на публикацию.
    Вызывается после создания публикации со статусом pending.
    """

    admins = User.objects.filter(role__name="manager_admin")

    for admin in admins:
        Notification.objects.create(
            recipient=admin,
            title="Новая заявка на публикацию",
            message=(
                f"Пользователь {publication.author_user.username} отправил "
                f"публикацию «{publication.title}» на проверку."
            ),
            notification_type="publication_request",
            link="/admin/materials",
        )


def notify_author_about_publication_status(publication):
    """
    Уведомляет автора о результате модерации публикации.
    Вызывается, когда администратор публикует или отклоняет публикацию.
    """

    if publication.status == "published":
        Notification.objects.create(
            recipient=publication.author_user,
            title="Публикация опубликована",
            message=(
                f"Ваша публикация «{publication.title}» была принята "
                f"и опубликована."
            ),
            notification_type="publication_published",
            link=f"/publications/{publication.id}",
        )

        return

    if publication.status == "rejected":
        reason = publication.reject_reason or "Причина не указана"

        Notification.objects.create(
            recipient=publication.author_user,
            title="Публикация отклонена",
            message=(
                f"Ваша публикация «{publication.title}» была отклонена. "
                f"Причина: {reason}"
            ),
            notification_type="publication_rejected",
            link="/publications",
        )

        return


# Алиас для совместимости, если где-то в коде уже был старый импорт.
def notify_admins_about_new_publication(publication):
    return notify_admins_about_publication_request(publication)