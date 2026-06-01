import type { Category } from "@/shared/api/categories";

import type {
    EditPublicationErrors,
    EditPublicationFormState,
} from "./editPublicationTypes";
import {
    allowedDocumentExtensions,
    allowedImageTypes,
    hasAllowedExtension,
} from "./editPublicationHelpers";

type ValidateEditPublicationParams = {
    form: EditPublicationFormState;
    selectedOptions: Category["options"];
    hasExistingFile: boolean;
};

export const validateEditPublicationForm = ({
    form,
    selectedOptions,
    hasExistingFile,
}: ValidateEditPublicationParams) => {
    const errors: EditPublicationErrors = {};

    const previewStart = Number(form.preview_start_page);
    const previewEnd = Number(form.preview_end_page);

    if (!form.title.trim()) {
        errors.title = "publication_edit.errors.titleRequired";
    }

    if (!form.category) {
        errors.category = "publication_edit.errors.categoryRequired";
    }

    if (!form.direction) {
        errors.direction = "publication_edit.errors.directionRequired";
    }

    if ((selectedOptions?.length || 0) > 0 && !form.option) {
        errors.option = "publication_edit.errors.optionRequired";
    }

    if (!form.file && !hasExistingFile) {
        errors.file = "publication_edit.errors.fileRequired";
    }

    if (form.file && !hasAllowedExtension(form.file.name, allowedDocumentExtensions)) {
        errors.file = "publication_edit.errors.fileFormat";
    }

    if (form.cover && !allowedImageTypes.includes(form.cover.type)) {
        errors.cover = "publication_edit.errors.coverFormat";
    }

    if (
        !form.preview_start_page ||
        Number.isNaN(previewStart) ||
        previewStart < 1
    ) {
        errors.preview_start_page = "publication_edit.errors.previewStartRequired";
    }

    if (
        !form.preview_end_page ||
        Number.isNaN(previewEnd) ||
        previewEnd < previewStart
    ) {
        errors.preview_end_page = "publication_edit.errors.previewEndRequired";
    }

    if (
        !Number.isNaN(previewStart) &&
        !Number.isNaN(previewEnd) &&
        previewEnd >= previewStart &&
        previewEnd - previewStart > 4
    ) {
        errors.preview_end_page = "publication_edit.errors.previewMaxPages";
    }

    if (form.price_type === "paid") {
        const priceNumber = Number(form.price);

        if (!form.price || Number.isNaN(priceNumber) || priceNumber <= 0) {
            errors.price = "publication_edit.errors.priceRequired";
        }

        if (!form.agreement_accepted) {
            errors.agreement_accepted = "publication_edit.errors.agreementRequired";
        }
    }

    return errors;
};