export type UserLike = {
    id?: number | string;
    user_id?: number | string;
    pk?: number | string;
    username?: string;
    email?: string;
    role?: string;
};

export const readUserFromStorage = (): UserLike | null => {
    const keys = ["user", "authUser", "currentUser", "bilimzone_user", "auth_user"];

    for (const key of keys) {
        const raw = localStorage.getItem(key);

        if (!raw) {
            continue;
        }

        try {
            const parsed = JSON.parse(raw);

            if (parsed && typeof parsed === "object") {
                return parsed;
            }
        } catch {
            continue;
        }
    }

    return null;
};

export const getCurrentOwnerId = (user: UserLike | null | undefined) => {
    const storageUser = readUserFromStorage();

    const id =
        user?.id ||
        user?.user_id ||
        user?.pk ||
        storageUser?.id ||
        storageUser?.user_id ||
        storageUser?.pk;

    return id ? String(id) : "";
};

export const canUserPublish = (user: UserLike | null | undefined) => {
    return user?.role === "author" || user?.role === "organization";
};