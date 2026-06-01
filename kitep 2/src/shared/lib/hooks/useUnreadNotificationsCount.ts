import { useCallback, useEffect, useState } from "react";

import { useAuth } from "@/entities/user/model/useAuth";
import {
    getUnreadNotificationsCount,
    NOTIFICATIONS_EVENT_NAME,
} from "@/shared/api/notifications";

type UserLike = {
    id?: number | string;
    user_id?: number | string;
    pk?: number | string;
};

const getUserId = (user: UserLike | null | undefined) => {
    if (!user) return "";

    return String(user.id || user.user_id || user.pk || "");
};

export const useUnreadNotificationsCount = () => {
    const { user } = useAuth();
    const userId = getUserId(user as UserLike | null);

    const [count, setCount] = useState(0);

    const loadCount = useCallback(async () => {
        if (!userId) {
            setCount(0);
            return;
        }

        try {
            const response = await getUnreadNotificationsCount(userId);
            setCount(Number(response.data.count || 0));
        } catch (error) {
            console.log("UNREAD NOTIFICATIONS COUNT ERROR:", error);
            setCount(0);
        }
    }, [userId]);

    useEffect(() => {
        loadCount();

        const handleRefresh = () => {
            loadCount();
        };

        window.addEventListener("focus", handleRefresh);
        window.addEventListener("storage", handleRefresh);
        window.addEventListener(NOTIFICATIONS_EVENT_NAME, handleRefresh);

        const intervalId = window.setInterval(loadCount, 15000);

        return () => {
            window.removeEventListener("focus", handleRefresh);
            window.removeEventListener("storage", handleRefresh);
            window.removeEventListener(NOTIFICATIONS_EVENT_NAME, handleRefresh);
            window.clearInterval(intervalId);
        };
    }, [loadCount]);

    return {
        count,
        refresh: loadCount,
    };
};