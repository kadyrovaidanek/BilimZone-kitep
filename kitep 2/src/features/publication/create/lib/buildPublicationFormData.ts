import type { CreatePublicationFormState } from "../model/types";

type BuildPublicationFormDataParams = {
    form: CreatePublicationFormState;
    userId: number | string;
    forceSubmit?: boolean;
};

export const buildPublicationFormData = ({
    form,
    userId,
    forceSubmit = false,
}: BuildPublicationFormDataParams) => {
    const formData = new FormData();

    formData.append("author_user", String(userId));
    formData.append("title", form.title.trim());
    formData.append("description", form.description.trim());
    formData.append("publication_type", form.publication_type);

    formData.append("category", form.category);
    formData.append("direction", form.direction);

    if (form.option) {
        formData.append("option", form.option);
    }

    formData.append("price_type", form.price_type);
    formData.append("price", form.price_type === "paid" ? form.price : "0");

    formData.append("preview_start_page", form.preview_start_page || "1");
    formData.append("preview_end_page", form.preview_end_page || "3");
    formData.append("cover_page_number", form.cover_page_number || "1");

    formData.append(
        "agreement_accepted",
        form.agreement_accepted ? "true" : "false",
    );

    if (form.agreement_id) {
        formData.append("agreement_id", String(form.agreement_id));
    }

    if (forceSubmit) {
        formData.append("force_submit", "true");
    }

    if (form.file) {
        formData.append("file", form.file);
    }

    if (form.cover_mode === "custom_image" && form.cover) {
        formData.append("cover", form.cover);
    }

    return formData;
};