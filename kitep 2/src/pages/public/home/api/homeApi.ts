import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://bilimzone-backend1.onrender.com";

export type HomeStat = {
    value: number;
    label: string;
};

export type HomeCategory = {
    id: number;
    name_ru: string;
    name_kg: string;
    materials_count: number;
};

export type HomePopularMaterial = {
    id: number;
    title: string;
    description: string;
    author_username: string;
    category_name_ru: string;
    category_name_kg: string;
    price_type: string;
    price: string | number;
    cover_url: string | null;
    views_count: number;
    downloads_count: number;
    purchases_count: number;
    reviews_count: number;
    average_rating: number;
    created_at: string;
};

export type HomeData = {
    stats: {
        users: HomeStat;
        materials: HomeStat;
        ratings: HomeStat;
        downloads: HomeStat;
    };
    categories: HomeCategory[];
    popular_materials: HomePopularMaterial[];
};

export const getHomeData = async (params?: {
    search?: string;
    category?: string | number;
}) => {
    const response = await axios.get<HomeData>(`${API_BASE_URL}/api/home/`, {
        params,
    });

    return response.data;
};