export const getUserId = (user: unknown) => {
    const currentUser = user as
        | {
            id?: number | string;
            user_id?: number | string;
            pk?: number | string;
        }
        | null
        | undefined;

    return currentUser?.id || currentUser?.user_id || currentUser?.pk || "";
};

export const getUserRole = (user: unknown) => {
    const currentUser = user as { role?: string } | null | undefined;

    return currentUser?.role || "";
};