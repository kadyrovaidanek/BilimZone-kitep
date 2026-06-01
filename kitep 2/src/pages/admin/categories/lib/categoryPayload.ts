import type { AdminCategoryPayload, CategoryFormState } from "./categoryTypes";

export const isSchoolCategorySlug = (slug: string) => {
    return slug.trim().toLowerCase() === "school";
};

export const buildCategoryPayload = (
    form: CategoryFormState,
): AdminCategoryPayload => {
    const isSchool = isSchoolCategorySlug(form.slug);

    return {
        slug: form.slug.trim() || undefined,
        name_ru: form.name_ru.trim(),
        name_kg: form.name_kg.trim(),
        description_ru: form.description_ru.trim(),
        description_kg: form.description_kg.trim(),
        is_active: form.is_active,
        sort_order: Number(form.sort_order) || 0,

        directions: form.directions
            .filter((item) => item.name_ru.trim())
            .map((item, index) => ({
                id: item.id,
                name_ru: item.name_ru.trim(),
                name_kg: item.name_kg.trim() || item.name_ru.trim(),
                is_active: item.is_active,
                sort_order: index,
            })),

        class_options: isSchool
            ? form.class_options
                .filter((item) => item.value.trim())
                .map((item, index) => ({
                    id: item.id,
                    value: item.value.trim(),
                    is_active: item.is_active,
                    sort_order: index,
                }))
            : [],
    };
};