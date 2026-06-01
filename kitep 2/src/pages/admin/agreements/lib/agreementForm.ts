import type { Agreement, AgreementAudience, AgreementContext } from "@/shared/api/agreements";

export type AgreementFormState = {
    title: string;
    audience: AgreementAudience;
    context: AgreementContext;
    text: string;
    file: File | null;
    is_active: boolean;
};

export const initialAgreementForm: AgreementFormState = {
    title: "",
    audience: "all",
    context: "registration",
    text: "",
    file: null,
    is_active: true,
};

export const mapAgreementToForm = (
    agreement: Agreement,
): AgreementFormState => {
    return {
        title: agreement.title || "",
        audience: agreement.audience,
        context: agreement.context,
        text: agreement.text || "",
        file: null,
        is_active: agreement.is_active,
    };
};

export const buildAgreementFormData = (form: AgreementFormState) => {
    const formData = new FormData();

    formData.append("title", form.title.trim());
    formData.append("audience", form.audience);
    formData.append("context", form.context);
    formData.append("text", form.text.trim());
    formData.append("is_active", String(form.is_active));

    if (form.file) {
        formData.append("file", form.file);
    }

    return formData;
};