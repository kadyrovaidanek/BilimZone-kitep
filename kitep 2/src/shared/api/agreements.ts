import axios from "axios";

const API = axios.create({
    baseURL: "https://bilimzone-backend1.onrender.com/api",
});

export type AgreementAudience =
    | "all"
    | "reader"
    | "author"
    | "organization"
    | "author_organization";

export type AgreementContext =
    | "registration"
    | "paid_material"
    | "publication"
    | "all";

export type ActiveAgreementAudience = "reader" | "author" | "organization";

export type ActiveAgreementContext =
    | "registration"
    | "paid_material"
    | "publication";

export type Agreement = {
    id: number;
    title: string;
    audience: AgreementAudience;
    context: AgreementContext;
    text: string | null;
    file: string | null;
    file_url: string | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
};

export const getAgreements = (params?: {
    audience?: string;
    context?: string;
    is_active?: string;
}) => {
    return API.get<Agreement[]>("/agreements/", { params });
};

export const createAgreement = (data: FormData) => {
    return API.post<Agreement>("/agreements/", data, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};

export const updateAgreement = (id: number, data: FormData) => {
    return API.put<Agreement>(`/agreements/${id}/`, data, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};

export const deleteAgreement = (id: number) => {
    return API.delete(`/agreements/${id}/`);
};

export const getActiveAgreement = (params: {
    audience: ActiveAgreementAudience;
    context: ActiveAgreementContext;
}) => {
    return API.get<{ agreement: Agreement | null }>("/agreements/active/", {
        params,
    });
};