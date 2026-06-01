export type PublicationType =
    | "book"
    | "article"
    | "coursework"
    | "diploma"
    | "lecture"
    | "methodical"
    | "test"
    | "other";

export type PublicationPriceType = "free" | "paid";

export type PublicationStatus =
    | "draft"
    | "pending"
    | "published"
    | "rejected";

export type PublicationFormState = {
    title: string;
    description: string;
    publication_type: PublicationType;

    category: string;
    direction: string;
    option: string;

    price_type: PublicationPriceType;
    price: string;

    file: File | null;

    cover_page_number: string;
    preview_start_page: string;
    preview_end_page: string;

    agreement_accepted: boolean;
};

export type PublicationFormErrors = Partial<
    Record<keyof PublicationFormState, string>
>;

export type CategoryOption = {
    id: number;
    value: string;
    is_active?: boolean;
};

export type CategoryDirection = {
    id: number;
    name_ru: string;
    name_kg?: string | null;
    is_active?: boolean;
    category?: number;
};

export type Category = {
    id: number;
    slug?: string | null;
    name_ru: string;
    name_kg?: string | null;
    directions?: CategoryDirection[];
    class_options?: CategoryOption[];
    options?: CategoryOption[];
};