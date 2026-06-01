import { useEffect, useMemo, useState } from "react";
import { AlertCircle } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { useAuth } from "@/entities/user/model/useAuth";
import {
  getUserPurchases,
  type PublicationPurchase,
} from "@/shared/api/purchases";

import {
  filterCollectionItems,
  getCollectionStats,
  type CollectionDisplayItem,
  type CollectionFilterType,
  type FavoriteCollectionItem,
} from "../lib/collectionFilters";

import { CollectionHeader } from "./components/CollectionHeader";
import { CollectionStats } from "./components/CollectionStats";
import { CollectionToolbar } from "./components/CollectionToolbar";
import { CollectionEmptyState } from "./components/CollectionEmptyState";
import { CollectionCard } from "./components/CollectionCard";

type UserLike = {
  id?: number | string;
  user_id?: number | string;
  pk?: number | string;
  email?: string;
};

const getUserId = (user: UserLike | null | undefined) => {
  if (!user) return "";

  return String(user.id || user.user_id || user.pk || user.email || "");
};

const getFavoritesKey = (userId: string) => {
  return `bilimzone_favorites_${userId}`;
};

const readFavorites = (userId: string): FavoriteCollectionItem[] => {
  if (!userId) return [];

  try {
    const raw = localStorage.getItem(getFavoritesKey(userId));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const favoriteToCollectionItem = (
  favorite: FavoriteCollectionItem,
): CollectionDisplayItem => {
  return {
    id: Number(`9${String(favorite.id).replace(/\D/g, "") || Date.now()}`),
    buyer: 0,
    publication: Number(favorite.id),

    publication_title: favorite.title || "Без названия",
    publication_description: favorite.description || null,
    publication_price: String(favorite.price || "0"),
    publication_price_type: favorite.price_type || "free",
    publication_type: "publication",

    publication_file_url: favorite.file_url || null,
    publication_preview_file_url: null,
    publication_pdf_file_url: favorite.pdf_file_url || null,
    publication_cover_url: favorite.cover_url || null,

    author_user: 0,
    author_username: favorite.author_username || "",

    category_name_ru: favorite.category_name_ru || null,
    category_name_kg: favorite.category_name_kg || null,

    direction_name_ru: null,
    direction_name_kg: null,

    option_value: null,

    amount: "0",
    owner_amount: "0",
    system_amount: "0",
    created_at: "",

    is_favorite: true,
  };
};

const mergePurchasesWithFavorites = (
  purchases: PublicationPurchase[],
  favorites: FavoriteCollectionItem[],
): CollectionDisplayItem[] => {
  const favoriteIds = new Set(
    favorites.map((item) => String(item.id)),
  );

  const purchasedItems: CollectionDisplayItem[] = purchases.map((item) => ({
    ...item,
    is_favorite: favoriteIds.has(String(item.publication)),
  }));

  const purchasedPublicationIds = new Set(
    purchases.map((item) => String(item.publication)),
  );

  const onlyFavoriteItems = favorites
    .filter((favorite) => !purchasedPublicationIds.has(String(favorite.id)))
    .map(favoriteToCollectionItem);

  return [...purchasedItems, ...onlyFavoriteItems];
};

const getInitialFilter = (tab: string | null): CollectionFilterType => {
  if (tab === "favorites") return "favorites";
  if (tab === "free") return "free";
  if (tab === "paid") return "paid";

  return "all";
};

export const CollectionPage = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();

  const userId = getUserId(user as UserLike | null);

  const [items, setItems] = useState<CollectionDisplayItem[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<CollectionFilterType>(
    getInitialFilter(searchParams.get("tab")),
  );
  const [loading, setLoading] = useState(false);

  const loadCollection = async () => {
    if (!user?.id || !userId) {
      return;
    }

    try {
      setLoading(true);

      const response = await getUserPurchases(user.id);
      const favorites = readFavorites(userId);

      setItems(mergePurchasesWithFavorites(response.data, favorites));
    } catch (error) {
      console.log("COLLECTION LOAD ERROR:", error);
      alert(t("collection.loadError"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCollection();

    const handleStorage = () => {
      loadCollection();
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener("bilimzone-favorites-updated", handleStorage);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("bilimzone-favorites-updated", handleStorage);
    };
  }, [user?.id, userId]);

  useEffect(() => {
    setFilter(getInitialFilter(searchParams.get("tab")));
  }, [searchParams]);

  const filteredItems = useMemo(() => {
    return filterCollectionItems(items, search, filter);
  }, [items, search, filter]);

  const stats = useMemo(() => {
    return getCollectionStats(items);
  }, [items]);

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-10">
        <div className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-8 text-center">
          <AlertCircle className="mx-auto mb-4 h-12 w-12 text-orange-500" />

          <h1 className="text-2xl font-black text-slate-900">
            {t("collection.authRequired")}
          </h1>

          <Link
            to="/login"
            className="mt-5 inline-flex rounded-2xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700 sm:text-base"
          >
            {t("collection.login")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <CollectionHeader />

        <CollectionStats
          stats={stats}
          filter={filter}
          onFilterChange={setFilter}
        />

        <CollectionToolbar
          search={search}
          filter={filter}
          onSearchChange={setSearch}
          onFilterChange={setFilter}
        />

        {loading ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-slate-500">
            {t("collection.loading")}
          </div>
        ) : filteredItems.length === 0 ? (
          <CollectionEmptyState />
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {filteredItems.map((item) => (
              <CollectionCard
                key={`${item.publication}-${item.id}`}
                item={item}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default CollectionPage;