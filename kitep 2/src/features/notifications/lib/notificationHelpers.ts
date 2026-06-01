import type { TFunction } from "i18next";

export const getNotificationTypeLabel = (
    type: string,
    t: TFunction,
) => {
    if (type === "publication_request" || type === "material_request") {
        return t(
            "notifications.types.publication_request",
            "Заявка на публикацию",
        );
    }

    if (type === "publication_published" || type === "material_published") {
        return t(
            "notifications.types.publication_published",
            "Публикация опубликована",
        );
    }

    if (type === "publication_rejected" || type === "material_rejected") {
        return t(
            "notifications.types.publication_rejected",
            "Публикация отклонена",
        );
    }

    if (type === "material_purchase_success") {
        return t(
            "notifications.types.material_purchase_success",
            "Покупка выполнена",
        );
    }

    if (type === "material_bought") {
        return t(
            "notifications.types.material_bought",
            "Материал купили",
        );
    }

    if (type === "system_commission_income") {
        return t(
            "notifications.types.system_commission_income",
            "Доход системы",
        );
    }

    if (type === "free_material_access") {
        return t(
            "notifications.types.free_material_access",
            "Бесплатный материал",
        );
    }

    return t(
        "notifications.types.system",
        "Системное уведомление",
    );
};

export const getNotificationIconClass = (isRead: boolean) => {
    if (isRead) {
        return "bg-slate-100 text-slate-500";
    }

    return "bg-red-100 text-red-600";
};

export const getNotificationCardClass = (isRead: boolean) => {
    if (isRead) {
        return "bg-white border-slate-200";
    }

    return "bg-red-50 border-red-100";
};