import type { PublicUser } from "@/shared/api/users";
import { getUserDisplayName } from "./adminUsersHelpers";

export const filterAdminUsers = (
    users: PublicUser[],
    search: string,
    role: string,
) => {
    const searchValue = search.trim().toLowerCase();

    return users.filter((item) => {
        const displayName = getUserDisplayName(item).toLowerCase();
        const email = String(item.email || "").toLowerCase();
        const phone = String(item.phone || "").toLowerCase();
        const username = String(item.username || "").toLowerCase();

        const matchesSearch =
            !searchValue ||
            username.includes(searchValue) ||
            displayName.includes(searchValue) ||
            email.includes(searchValue) ||
            phone.includes(searchValue);

        const matchesRole = !role || item.role_name === role;

        return matchesSearch && matchesRole;
    });
};