import type { AdminCatalogCategory, CategoryFormState } from "./categoryTypes";

export const emptyCategoryForm: CategoryFormState = {
    slug: "",
    name_ru: "",
    name_kg: "",
    description_ru: "",
    description_kg: "",
    is_active: true,
    sort_order: 0,
    directions: [
        {
            name_ru: "",
            name_kg: "",
            is_active: true,
            sort_order: 0,
        },
    ],
    class_options: [],
};

export const mapCategoryToForm = (
    category: AdminCatalogCategory,
): CategoryFormState => {
    return {
        slug: category.slug || "",
        name_ru: category.name_ru || "",
        name_kg: category.name_kg || "",
        description_ru: category.description_ru || "",
        description_kg: category.description_kg || "",
        is_active: Boolean(category.is_active),
        sort_order: category.sort_order || 0,

        directions:
            category.directions.length > 0
                ? category.directions.map((item, index) => ({
                    id: item.id,
                    name_ru: item.name_ru || "",
                    name_kg: item.name_kg || "",
                    is_active: Boolean(item.is_active),
                    sort_order: item.sort_order ?? index,
                }))
                : [
                    {
                        name_ru: "",
                        name_kg: "",
                        is_active: true,
                        sort_order: 0,
                    },
                ],

        class_options:
            category.slug === "school"
                ? category.class_options.map((item, index) => ({
                    id: item.id,
                    value: item.value || "",
                    is_active: Boolean(item.is_active),
                    sort_order: item.sort_order ?? index,
                }))
                : [],
    };
};