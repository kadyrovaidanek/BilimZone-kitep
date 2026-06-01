const CART_KEY = "cart";
const COLLECTION_KEY = "collection";
const FAVORITES_KEY = "favorites";

export type StoredMaterial = {
  id: number;
  title: string;
  author?: string;
  description?: string;
  priceType?: "free" | "paid";
  price?: number;
  image?: string;
  fileUrl?: string;
  addedAt?: string;
};

// =====================
// helpers
// =====================
const safeParse = <T>(key: string, fallback: T): T => {
  try {
    const value = localStorage.getItem(key);
    if (!value) return fallback;

    const parsed = JSON.parse(value);
    return parsed || fallback;
  } catch {
    return fallback;
  }
};

const normalizeMaterial = (item: any): StoredMaterial | null => {
  if (!item || !item.id) return null;

  return {
    id: Number(item.id),
    title: String(item.title || "Без названия"),
    author: String(item.author || item.author_username || ""),
    description: String(item.description || ""),
    priceType: item.priceType || item.price_type || "free",
    price: Number(item.price || 0),
    image: item.image || item.cover_url || "",
    fileUrl: item.fileUrl || item.file_url || "",
    addedAt: item.addedAt || new Date().toISOString(),
  };
};

// =====================
// CART
// =====================
export const getCart = (): StoredMaterial[] => {
  const cart = safeParse<any[]>(CART_KEY, []);
  return cart.map(normalizeMaterial).filter(Boolean) as StoredMaterial[];
};

export const addToCart = (item: any) => {
  const normalized = normalizeMaterial(item);
  if (!normalized) return;

  const cart = getCart();
  const exists = cart.some((i) => i.id === normalized.id);

  if (!exists) {
    localStorage.setItem(CART_KEY, JSON.stringify([...cart, normalized]));
  }
};

export const removeFromCart = (id: number) => {
  const cart = getCart().filter((item) => item.id !== id);
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
};

export const clearCart = () => {
  localStorage.setItem(CART_KEY, JSON.stringify([]));
};

// =====================
// COLLECTION
// =====================
export const getCollection = (): StoredMaterial[] => {
  const collection = safeParse<any[]>(COLLECTION_KEY, []);
  return collection.map(normalizeMaterial).filter(Boolean) as StoredMaterial[];
};

export const addToCollection = (item: any) => {
  const normalized = normalizeMaterial(item);
  if (!normalized) return;

  const collection = getCollection();
  const exists = collection.some((i) => i.id === normalized.id);

  if (!exists) {
    localStorage.setItem(
      COLLECTION_KEY,
      JSON.stringify([...collection, normalized])
    );
  }
};

export const removeFromCollection = (id: number) => {
  const collection = getCollection();
  const updated = collection.filter((item: any) => item.id !== id);
  localStorage.setItem(COLLECTION_KEY, JSON.stringify(updated));
};
// =====================
// FAVORITES
// =====================
export const getFavorites = (): StoredMaterial[] => {
  const favorites = safeParse<any[]>(FAVORITES_KEY, []);
  return favorites.map(normalizeMaterial).filter(Boolean) as StoredMaterial[];
};

export const addToFavorites = (item: any) => {
  const normalized = normalizeMaterial(item);
  if (!normalized) return;

  const favorites = getFavorites();
  const exists = favorites.some((i) => i.id === normalized.id);

  if (!exists) {
    localStorage.setItem(
      FAVORITES_KEY,
      JSON.stringify([...favorites, normalized])
    );
  }
};

export const removeFromFavorites = (id: number) => {
  const favorites = getFavorites().filter((item) => item.id !== id);
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
};

export const toggleFavorite = (item: any) => {
  const normalized = normalizeMaterial(item);
  if (!normalized) return false;

  const favorites = getFavorites();
  const exists = favorites.some((i) => i.id === normalized.id);

  if (exists) {
    removeFromFavorites(normalized.id);
    return false;
  }

  addToFavorites(normalized);
  return true;
};

export const isFavoriteMaterial = (id: number) => {
  return getFavorites().some((item) => item.id === id);
};

// =====================
// CURRENT USER
// =====================
export type CurrentUserLike = {
  id?: number | string;
  user_id?: number | string;
  pk?: number | string;
  username?: string;
  email?: string;
  role?: string;
};

const USER_STORAGE_KEYS = [
  "user",
  "currentUser",
  "authUser",
  "bilimzone_user",
];

export const readUserFromStorage = (): CurrentUserLike | null => {
  for (const key of USER_STORAGE_KEYS) {
    const rawValue = localStorage.getItem(key);

    if (!rawValue) {
      continue;
    }

    try {
      return JSON.parse(rawValue) as CurrentUserLike;
    } catch {
      continue;
    }
  }

  return null;
};

export const getCurrentUserId = () => {
  const user = readUserFromStorage();

  if (!user) {
    return null;
  }

  return user.id ?? user.user_id ?? user.pk ?? null;
};