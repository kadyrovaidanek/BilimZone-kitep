import type { TFunction } from "i18next";
import type { PublicUser } from "@/shared/api/users";

export const getUserDisplayName = (item: PublicUser) => {
    return item.organization_name || item.full_name || item.username || "-";
};

export const getRoleLabel = (
    roleName: string | null | undefined,
    t: TFunction,
) => {
    if (!roleName) return "-";

    const labels: Record<string, string> = {
        reader: t("roles.reader"),
        author: t("roles.author"),
        organization: t("roles.organization"),
        manager_admin: t("roles.manager_admin"),
    };

    return labels[roleName] || roleName;
};

export const formatAdminDate = (date?: string | null) => {
    if (!date) return "-";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
        return "-";
    }

    return parsedDate.toLocaleDateString();
};