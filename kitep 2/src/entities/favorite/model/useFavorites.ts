import { useState, useEffect } from "react";

const KEY = "favorites";

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<number[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(KEY);
    if (saved) {
      setFavorites(JSON.parse(saved));
    }
  }, []);

  const toggleFavorite = (id: number) => {
    setFavorites((prev) => {
      let updated;

      if (prev.includes(id)) {
        updated = prev.filter((i) => i !== id);
      } else {
        updated = [...prev, id];
      }

      localStorage.setItem(KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const isFavorite = (id: number) => {
    return favorites.includes(id);
  };

  return { favorites, toggleFavorite, isFavorite };
};