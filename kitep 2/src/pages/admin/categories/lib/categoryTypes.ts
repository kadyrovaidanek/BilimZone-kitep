export type DirectionForm = {
    id?: number;
    name_ru: string;
    name_kg: string;
    is_active: boolean;
    sort_order: number;
};

export type ClassForm = {
    id?: number;
    value: string;
    is_active: boolean;
    sort_order: number;
};

export type CategoryFormState = {
    slug: string;
    name_ru: string;
    name_kg: string;
    description_ru: string;
    description_kg: string;
    is_active: boolean;
    sort_order: number;
    directions: DirectionForm[];
    class_options: ClassForm[];
};

export type AdminCatalogDirection = {
    id: number;
    name_ru: string;
    name_kg: string;
    is_active: boolean;
    sort_order?: number;
};

export type AdminCatalogClassOption = {
    id: number;
    value: string;
    is_active: boolean;
    sort_order?: number;
};

export type AdminCatalogCategory = {
    id: number;
    slug?: string;
    name_ru: string;
    name_kg: string;
    description_ru?: string;
    description_kg?: string;
    is_active: boolean;
    sort_order?: number;
    directions: AdminCatalogDirection[];
    class_options: AdminCatalogClassOption[];
    active_directions_count?: number;
};

export type AdminCategoryPayload = {
    slug?: string;
    name_ru: string;
    name_kg: string;
    description_ru: string;
    description_kg: string;
    is_active: boolean;
    sort_order: number;
    directions: Array<{
        id?: number;
        name_ru: string;
        name_kg: string;
        is_active: boolean;
        sort_order: number;
    }>;
    class_options: Array<{
        id?: number;
        value: string;
        is_active: boolean;
        sort_order: number;
    }>;
};