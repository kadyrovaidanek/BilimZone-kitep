import { useState, useEffect } from "react";

const KEY = "notifications";

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(KEY);
    if (saved) setNotifications(JSON.parse(saved));
  }, []);

  const save = (data: any[]) => {
    setNotifications(data);
    localStorage.setItem(KEY, JSON.stringify(data));
  };

  const addNotification = (text: string) => {
    save([
      { id: Date.now(), text, read: false },
      ...notifications,
    ]);
  };

  const markRead = (id: number) => {
    save(
      notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      )
    );
  };

  return { notifications, addNotification, markRead };
};