import { useState, useEffect } from "react";

const KEY = "cart";

export const useCart = () => {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(KEY);
    if (saved) setItems(JSON.parse(saved));
  }, []);

  const save = (data: any[]) => {
    setItems(data);
    localStorage.setItem(KEY, JSON.stringify(data));
  };

  const addToCart = (item: any) => {
    save([...items, item]);
  };

  const removeFromCart = (id: number) => {
    save(items.filter((i) => i.id !== id));
  };

  return { items, addToCart, removeFromCart };
};