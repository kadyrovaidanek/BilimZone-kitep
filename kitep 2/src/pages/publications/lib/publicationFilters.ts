import type {
    Publication,
    PublicationStatus,
} from "@/shared/api/publications";

export type PublicationsStatusFilter = "all" | PublicationStatus;

export const getPublicationsStats = (publications: Publication[]) => {
    const publishedPublications = publications.filter(
        (item) => item.status === "published",
    );

    const totalViews = publications.reduce(
        (sum, item) => sum + Number(item.views_count || 0),
        0,
    );

    const totalDownloads = publications.reduce(
        (sum, item) => sum + Number(item.downloads_count || 0),
        0,
    );

    const totalReviews = publications.reduce(
        (sum, item) => sum + Number(item.reviews_count || 0),
        0,
    );

    const totalPurchases = publications.reduce(
        (sum, item) => sum + Number(item.purchases_count || 0),
        0,
    );

    const totalRating = publishedPublications.reduce(
        (sum, item) => sum + Number(item.average_rating || 0),
        0,
    );

    const averageRating =
        publishedPublications.length > 0
            ? totalRating / publishedPublications.length
            : 0;

    return {
        all: publications.length,

        pending: publications.filter((item) => item.status === "pending").length,

        published: publications.filter((item) => item.status === "published")
            .length,

        rejected: publications.filter((item) => item.status === "rejected").length,

        totalViews,
        totalDownloads,
        totalReviews,
        totalPurchases,
        averageRating,
    };
};

export const getCategoryName = (
    item: Publication,
    language: "ru" | "kg",
) => {
    return language === "kg"
        ? item.category_name_kg || item.category_name_ru
        : item.category_name_ru || item.category_name_kg;
};

export const getDirectionName = (
    item: Publication,
    language: "ru" | "kg",
) => {
    return language === "kg"
        ? item.direction_name_kg || item.direction_name_ru
        : item.direction_name_ru || item.direction_name_kg;
};