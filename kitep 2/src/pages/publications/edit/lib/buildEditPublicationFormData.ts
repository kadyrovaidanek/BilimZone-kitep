import type { EditPublicationFormState } from "./editPublicationTypes";

type BuildEditPublicationFormDataParams = {
    form: EditPublicationFormState;
    authorUserId: string;
};

export const buildEditPublicationFormData = ({
    form,
    authorUserId,
}: BuildEditPublicationFormDataParams) => {
    const formData = new FormData();

    formData.append("author_user", authorUserId);
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
    formData.append("agreement_accepted", String(form.agreement_accepted));

    formData.append("preview_start_page", form.preview_start_page);
    formData.append("preview_end_page", form.preview_end_page);

    if (form.file) {
        formData.append("file", form.file);
    }

    if (form.cover) {
        formData.append("cover", form.cover);
    }

    return formData;
};