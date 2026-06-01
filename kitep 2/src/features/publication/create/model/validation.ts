import type { TFunction } from "i18next";

import type {
    CreatePublicationErrors,
    CreatePublicationFormState,
} from "./types";

const toNumber = (value: string) => {
    return Number(value || 0);
};

export const validateCreatePublicationForm = (
    form: CreatePublicationFormState,
    t: TFunction,
) => {
    const errors: CreatePublicationErrors = {};

    if (!form.title.trim()) {
        errors.title = t(
            "publicationCreate.errors.titleRequired",
            "Введите название публикации",
        );
    }

    if (!form.description.trim()) {
        errors.description = t(
            "publicationCreate.errors.descriptionRequired",
            "Введите описание публикации",
        );
    }

    if (!form.category) {
        errors.category = t(
            "publicationCreate.errors.categoryRequired",
            "Выберите категорию",
        );
    }

    if (!form.direction) {
        errors.direction = t(
            "publicationCreate.errors.directionRequired",
            "Выберите направление",
        );
    }

    if (!form.file) {
        errors.file = t(
            "publicationCreate.errors.fileRequired",
            "Загрузите файл публикации",
        );
    }

    const previewStart = toNumber(form.preview_start_page);
    const previewEnd = toNumber(form.preview_end_page);
    const coverPage = toNumber(form.cover_page_number);

    if (previewStart < 1) {
        errors.preview_start_page = t(
            "publicationCreate.errors.previewStartRequired",
            "Начальная страница не может быть меньше 1",
        );
    }

    if (previewEnd < previewStart) {
        errors.preview_end_page = t(
            "publicationCreate.errors.previewEndRequired",
            "Конечная страница должна быть больше или равна начальной",
        );
    }

    if (previewEnd - previewStart + 1 > 5) {
        errors.preview_end_page = t(
            "publicationCreate.errors.previewMaxPages",
            "Предпросмотр может содержать максимум 5 страниц",
        );
    }

    if (coverPage < 1) {
        errors.cover_page_number = t(
            "publicationCreate.errors.coverPageRequired",
            "Страница обложки не может быть меньше 1",
        );
    }

    if (form.price_type === "paid") {
        const price = Number(form.price);

        if (!price || price <= 0) {
            errors.price = t(
                "publicationCreate.errors.priceRequired",
                "Для платной публикации укажите цену",
            );
        }

        if (!form.agreement_id) {
            errors.agreement_id = t(
                "publicationCreate.errors.agreementNotFound",
                "Активный договор для платного материала не найден",
            );
        }

        if (!form.agreement_accepted) {
            errors.agreement_accepted = t(
                "publicationCreate.errors.agreementRequired",
                "Необходимо открыть и принять договор для платной публикации",
            );
        }
    }

    return errors;
};