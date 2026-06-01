const KEY = "favorites";

export const getFavorites = (): number[] => {
  return JSON.parse(localStorage.getItem(KEY) || "[]");
};

export const toggleFavorite = (id: number): number[] => {
  const current = getFavorites();

  let updated;

  if (current.includes(id)) {
    updated = current.filter((item) => item !== id);
  } else {
    updated = [...current, id];
  }

  localStorage.setItem(KEY, JSON.stringify(updated));
  return updated;
};

export const isFavorite = (id: number): boolean => {
  return getFavorites().includes(id);
};