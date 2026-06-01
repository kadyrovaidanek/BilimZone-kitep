import type {
    PublicationPriceType,
    Publication,
} from "@/shared/api/publications";

export type EditPublicationType =
    | "book"
    | "article"
    | "coursework"
    | "diploma"
    | "lecture"
    | "methodical"
    | "test"
    | "other";

export type EditPublicationFormState = {
    title: string;
    description: string;
    publication_type: EditPublicationType;

    category: string;
    direction: string;
    option: string;

    price_type: PublicationPriceType;
    price: string;

    file: File | null;
    cover: File | null;

    agreement_accepted: boolean;

    preview_start_page: string;
    preview_end_page: string;
};

export type EditPublicationErrors = Partial<
    Record<keyof EditPublicationFormState, string>
>;

export type CurrentUserLike = {
    id?: number | string;
    user_id?: number | string;
    pk?: number | string;
    username?: string;
    email?: string;
    role?: string;
};

export type ExistingPublicationFiles = {
    fileUrl: string;
    fileName: string;
    coverUrl: string;
    pdfFileUrl: string;
    previewFileUrl: string;
};

export const initialEditPublicationForm: EditPublicationFormState = {
    title: "",
    description: "",
    publication_type: "other",

    category: "",
    direction: "",
    option: "",

    price_type: "free",
    price: "0",

    file: null,
    cover: null,

    agreement_accepted: false,

    preview_start_page: "1",
    preview_end_page: "3",
};

export const mapPublicationToEditForm = (
    publication: Publication,
): EditPublicationFormState => {
    return {
        title: publication.title || "",
        description: publication.description || "",
        publication_type:
            (publication.publication_type as EditPublicationType) || "other",

        category: publication.category ? String(publication.category) : "",
        direction: publication.direction ? String(publication.direction) : "",
        option: publication.option ? String(publication.option) : "",

        price_type: publication.price_type || "free",
        price:
            publication.price_type === "paid"
                ? String(publication.price || "")
                : "0",

        file: null,
        cover: null,

        agreement_accepted: Boolean(publication.agreement_accepted),

        preview_start_page: String(publication.preview_start_page || 1),
        preview_end_page: String(publication.preview_end_page || 3),
    };
};

export const getExistingPublicationFiles = (
    publication: Publication,
): ExistingPublicationFiles => {
    return {
        fileUrl: publication.file_url || "",
        fileName: publication.file || publication.file_url || "",
        coverUrl: publication.cover_url || "",
        pdfFileUrl: publication.pdf_file_url || "",
        previewFileUrl: publication.preview_file_url || "",
    };
};