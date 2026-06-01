import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://bilimzone-backend1.onrender.com";

export type PublicationPriceType = "free" | "paid";

export type PublicationStatus =
    | "draft"
    | "pending"
    | "published"
    | "rejected";

export type PublicationSimilarityMatch = {
    id: number;
    publication: number;
    matched_publication: number;
    matched_publication_title: string;
    matched_publication_status: PublicationStatus;
    matched_publication_author?: string | null;
    matched_publication_url: string;
    match_type: "duplicate_file" | "duplicate_text" | "similar_text_warning";
    similarity_percent: number;
    matched_status: PublicationStatus | string;
    detail?: string | null;
    created_at?: string;
};

export type Publication = {
    id: number;

    author_user: number;
    author_username?: string;
    author_role?:
    | "author"
    | "organization"
    | "reader"
    | "manager_admin"
    | string
    | null;
    author_role_name?:
    | "author"
    | "organization"
    | "reader"
    | "manager_admin"
    | string
    | null;
    role_name?: string | null;

    category: number | null;
    category_name_ru?: string | null;
    category_name_kg?: string | null;

    direction: number | null;
    direction_name_ru?: string | null;
    direction_name_kg?: string | null;

    option: number | null;
    option_value?: string | null;

    title: string;
    description: string | null;

    publication_type: string;

    price_type: PublicationPriceType;
    price: string | number;

    file?: string | null;
    file_url?: string | null;

    preview_file?: string | null;
    preview_file_url?: string | null;

    pdf_file?: string | null;
    pdf_file_url?: string | null;

    cover?: string | null;
    cover_url?: string | null;

    file_sha256?: string | null;
    cover_page_number?: number;
    text_sha256?: string | null;
    similarity_checked_at?: string | null;
    similarity_matches?: PublicationSimilarityMatch[];

    preview_start_page?: number;
    preview_end_page?: number;

    status: PublicationStatus;
    reject_reason?: string | null;

    agreement_accepted?: boolean;

    views_count?: number;
    downloads_count?: number;

    average_rating?: number;
    reviews_count?: number;
    purchases_count?: number;
    is_purchased?: boolean;

    created_at?: string;
    updated_at?: string;
    published_at?: string | null;
};

export type CheckPublicationFileResponse = {
    exists: boolean;
    blocked?: boolean;
    code?:
    | "duplicate_file"
    | "duplicate_text"
    | "similar_text_warning"
    | "text_check_failed"
    | "unique";
    message: string;
    publication_id?: number;
    publication_title?: string;
    redirect_url?: string;
    detail?: string;
    file_sha256?: string;
    text_sha256?: string;
    similarity_percent?: number;
};

export const getPublications = (params?: Record<string, string | number>) => {
    return axios.get<Publication[]>(`${API_BASE_URL}/api/publications/`, {
        params,
    });
};

export const getPublishedPublications = (
    params?: Record<string, string | number>,
) => {
    return axios.get<Publication[]>(
        `${API_BASE_URL}/api/publications/published/`,
        {
            params,
        },
    );
};

export const getPublicationById = (id: number | string) => {
    return axios.get<Publication>(`${API_BASE_URL}/api/publications/${id}/`);
};

export const addPublication = (data: FormData) => {
    return axios.post<Publication>(`${API_BASE_URL}/api/publications/add/`, data, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};

export const checkPublicationFile = (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    return axios.post<CheckPublicationFileResponse>(
        `${API_BASE_URL}/api/publications/check-file/`,
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        },
    );
};

export const editPublication = (id: number | string, data: FormData) => {
    return axios.put<Publication>(
        `${API_BASE_URL}/api/publications/${id}/edit/`,
        data,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        },
    );
};

export const deletePublication = (id: number | string) => {
    return axios.delete(`${API_BASE_URL}/api/publications/${id}/delete/`);
};

export const checkPublication = (
    id: number | string,
    data: {
        status: "published" | "rejected" | "pending";
        reject_reason?: string;
    },
) => {
    return axios.put<Publication>(
        `${API_BASE_URL}/api/publications/${id}/check/`,
        data,
    );
};

export { API_BASE_URL };