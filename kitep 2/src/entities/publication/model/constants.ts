import type { PublicationFormState } from "./types";

export const initialPublicationForm: PublicationFormState = {
    title: "",
    description: "",
    publication_type: "other",

    category: "",
    direction: "",
    option: "",

    price_type: "free",
    price: "0",

    file: null,

    cover_page_number: "1",
    preview_start_page: "1",
    preview_end_page: "3",

    agreement_accepted: false,
};

export const allowedDocumentExtensions = [
    ".pdf",
    ".doc",
    ".docx",
    ".ppt",
    ".pptx",
];

export const publicationTypeOptions = [
    { value: "book", labelKey: "publication.types.book" },
    { value: "article", labelKey: "publication.types.article" },
    { value: "coursework", labelKey: "publication.types.coursework" },
    { value: "diploma", labelKey: "publication.types.diploma" },
    { value: "lecture", labelKey: "publication.types.lecture" },
    { value: "methodical", labelKey: "publication.types.methodical" },
    { value: "test", labelKey: "publication.types.test" },
    { value: "other", labelKey: "publication.types.other" },
] as const;