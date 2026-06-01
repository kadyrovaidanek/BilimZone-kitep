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

export type CoverMode = "file_page" | "custom_image";

export type CreatePublicationFormState = {
    title: string;
    description: string;
    publication_type: PublicationType;

    category: string;
    direction: string;
    option: string;

    price_type: PublicationPriceType;
    price: string;

    file: File | null;
    cover: File | null;

    cover_mode: CoverMode;
    cover_page_number: string;

    preview_start_page: string;
    preview_end_page: string;

    agreement_accepted: boolean;
    agreement_id: number | null;
};

export type CreatePublicationErrors = Partial<
    Record<keyof CreatePublicationFormState, string>
>;

export type CreatePublicationField = keyof CreatePublicationFormState;