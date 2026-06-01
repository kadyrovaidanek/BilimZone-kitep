import axios from "axios";
import type { Publication } from "@/shared/api/publications";

const API = axios.create({
    baseURL: "http://127.0.0.2:8000/api",
});

API.interceptors.request.use((config) => {
    const token = localStorage.getItem("authToken");

    if (token && token !== "undefined" && token !== "null") {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export type PublicUser = {
    id: number;
    username: string;

    role_name: string | null;

    photo_url: string | null;

    first_name: string | null;
    surname: string | null;
    father_name: string | null;
    last_name: string | null;
    full_name: string | null;

    organization_name: string | null;

    description: string | null;
    bio: string | null;
    specialization: string | null;

    website: string | null;
    address: string | null;

    rating: string | null;
    total_sales: number | null;

    status: string | null;
    materials_count: number;
    created_at: string | null;

    email?: string | null;
    phone?: string | null;
    is_active?: boolean | null;
    all_materials_count?: number;
    updated_at?: string | null;
};

export type UserDetailResponse = {
    user: PublicUser;
    materials: Publication[];
};

export const getPublicUsers = (params?: {
    search?: string;
    role?: string;
}) => {
    return API.get<PublicUser[]>("/users/public/", { params });
};

export const getPublicUserById = (userId: number | string) => {
    return API.get<UserDetailResponse>(`/users/public/${userId}/`);
};

export const getAdminUsers = (params?: {
    search?: string;
    role?: string;
}) => {
    return API.get<PublicUser[]>("/admin/users/", { params });
};

export const getAdminUserById = (userId: number | string) => {
    return API.get<UserDetailResponse>(`/admin/users/${userId}/`);
};