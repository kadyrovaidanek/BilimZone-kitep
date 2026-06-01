import axios from "axios";

const API = axios.create({
    baseURL: "https://bilimzone-backend1.onrender.com/api",
});

API.interceptors.request.use((config) => {
    const token = localStorage.getItem("authToken");

    if (token && token !== "undefined" && token !== "null") {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export type CategoryDirection = {
    id: number;
    category?: number;
    name_ru: string;
    name_kg?: string | null;
    is_active: boolean;
    sort_order: number;
    created_at?: string;
};

export type CategoryOption = {
    id: number;
    category?: number;
    label_ru?: string | null;
    label_kg?: string | null;
    value: string;
    is_active: boolean;
    sort_order: number;
    created_at?: string;
};

export type Category = {
    id: number;
    slug?: string | null;
    name_ru: string;
    name_kg?: string | null;
    description_ru?: string | null;
    description_kg?: string | null;
    is_active: boolean;
    sort_order: number;
    created_at?: string;

    directions: CategoryDirection[];

    class_options?: CategoryOption[];
    options?: CategoryOption[];

    directions_count?: number;
    active_directions_count?: number;
};

export type CategoryPayload = {
    slug?: string;
    name_ru: string;
    name_kg?: string;
    description_ru?: string;
    description_kg?: string;
    is_active: boolean;
    sort_order?: number;
    directions?: {
        id?: number;
        name_ru: string;
        name_kg?: string;
        is_active: boolean;
        sort_order?: number;
    }[];
    class_options?: {
        id?: number;
        value: string;
        is_active: boolean;
        sort_order?: number;
    }[];
};

export const getCategories = (params?: {
    is_active?: string;
    search?: string;
}) => {
    return API.get<Category[]>("/categories/", {
        params,
    });
};

export const getCategoryById = (id: number | string) => {
    return API.get<Category>(`/categories/${id}/`);
};

export const createCategory = (data: CategoryPayload) => {
    return API.post<Category>("/categories/", data);
};

export const updateCategory = (
    id: number | string,
    data: Partial<CategoryPayload>,
) => {
    return API.put<Category>(`/categories/${id}/`, data);
};

export const deleteCategory = (id: number | string) => {
    return API.delete(`/categories/${id}/`);
};

export const toggleCategoryActive = (category: Category) => {
    return API.put<Category>(`/categories/${category.id}/`, {
        ...category,
        is_active: !category.is_active,
    });
};