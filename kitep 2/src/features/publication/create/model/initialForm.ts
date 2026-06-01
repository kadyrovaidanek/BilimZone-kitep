import type { CreatePublicationFormState } from "./types";

export const initialCreatePublicationForm: CreatePublicationFormState = {
    title: "",
    description: "",
    publication_type: "book",

    category: "",
    direction: "",
    option: "",

    price_type: "free",
    price: "",

    file: null,
    cover: null,

    cover_mode: "file_page",
    cover_page_number: "1",

    preview_start_page: "1",
    preview_end_page: "3",

    agreement_accepted: false,
    agreement_id: null,
};