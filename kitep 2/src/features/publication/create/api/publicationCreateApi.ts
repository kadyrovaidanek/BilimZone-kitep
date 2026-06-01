import axios from "axios";

const API = axios.create({
    baseURL: "https://bilimzone-backend1.onrender.com/api",
});

export type CategoryDirection = {
    id: number;
    name_ru: string;
    name_kg?: string | null;
    is_active?: boolean;
    sort_order?: number;
};

export type CategoryOption = {
    id: number;
    label_ru?: string | null;
    label_kg?: string | null;
    value: string;
    is_active?: boolean;
    sort_order?: number;
};

export type Category = {
    id: number;
    name_ru: string;
    name_kg?: string | null;
    is_active?: boolean;
    sort_order?: number;
    directions?: CategoryDirection[];
    options?: CategoryOption[];
    class_options?: CategoryOption[];
};

export type TemporaryPreviewResponse = {
    preview_url: string | null;
    message: string;
};

export const getActiveCategories = () => {
    return API.get<Category[]>("/categories/", {
        params: {
            is_active: "true",
        },
    });
};

export const createPublicationRequest = (data: FormData) => {
    return API.post("/publications/add/", data, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};

export const createTemporaryPublicationPreview = (data: FormData) => {
    return API.post<TemporaryPreviewResponse>(
        "/publications/temp-preview/",
        data,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        },
    );
};

export type SpellcheckApiItem = {
    word: string;
    suggestions: string[];
};

export type SpellcheckApiResponse = {
    unknownWords: string[];
    suggestions: Record<string, string[]>;
    fixedTitle: string;
    fixedDescription: string;
    hasCaseFix: boolean;
};

export const checkPublicationSpelling = (data: {
    title: string;
    description: string;
}) => {
    return API.post<SpellcheckApiResponse>(
        "/publications/spellcheck/",
        data,
    );
};