import type { PublicationPurchase } from "@/shared/api/purchases";

export type CollectionFilterType = "all" | "free" | "paid" | "favorites";

export type FavoriteCollectionItem = {
    id: number | string;
    title?: string;
    author_username?: string;
    price_type?: "free" | "paid";
    price?: string | number;
    cover_url?: string | null;
    description?: string | null;
    category_name_ru?: string | null;
    category_name_kg?: string | null;
    file_url?: string | null;
    pdf_file_url?: string | null;
};

export type CollectionDisplayItem = PublicationPurchase & {
    is_favorite?: boolean;
};

export const filterCollectionItems = (
    items: CollectionDisplayItem[],
    search: string,
    filter: CollectionFilterType,
) => {
    const query = search.trim().toLowerCase();

    return items.filter((item) => {
        const title = String(item.publication_title || "").toLowerCase();
        const author = String(item.author_username || "").toLowerCase();

        const matchesSearch =
            !query || title.includes(query) || author.includes(query);

        if (!matchesSearch) {
            return false;
        }

        if (filter === "free") {
            return item.publication_price_type === "free";
        }

        if (filter === "paid") {
            return item.publication_price_type === "paid";
        }

        if (filter === "favorites") {
            return Boolean(item.is_favorite);
        }

        return true;
    });
};

export const getCollectionStats = (items: CollectionDisplayItem[]) => {
    return {
        all: items.length,
        free: items.filter((item) => item.publication_price_type === "free").length,
        paid: items.filter((item) => item.publication_price_type === "paid").length,
        favorites: items.filter((item) => item.is_favorite).length,
    };
};