import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import {
    createCategory,
    deleteCategory,
    getCategories,
    toggleCategoryActive,
    updateCategory,
} from "@/shared/api/categories";

import { AdminCategoriesHeader } from "./categories/ui/components/AdminCategoriesHeader";
import { CategoryForm } from "./categories/ui/components/CategoryForm";
import { CategoryList } from "./categories/ui/components/CategoryList";

import {
    emptyCategoryForm,
    mapCategoryToForm,
} from "./categories/lib/categoryForm";

import {
    buildCategoryPayload,
    isSchoolCategorySlug,
} from "./categories/lib/categoryPayload";

import type {
    AdminCatalogCategory,
    CategoryFormState,
} from "./categories/lib/categoryTypes";

const normalizeCategory = (category: any): AdminCatalogCategory => {
    return {
        id: Number(category.id),
        slug: category.slug || "",
        name_ru: category.name_ru || "",
        name_kg: category.name_kg || "",
        description_ru: category.description_ru || "",
        description_kg: category.description_kg || "",
        is_active: Boolean(category.is_active),
        sort_order: Number(category.sort_order || 0),

        directions: Array.isArray(category.directions)
            ? category.directions.map((direction: any, index: number) => ({
                id: Number(direction.id || index),
                name_ru: direction.name_ru || "",
                name_kg: direction.name_kg || "",
                is_active: Boolean(direction.is_active),
                sort_order: Number(direction.sort_order ?? index),
            }))
            : [],

        class_options: Array.isArray(category.class_options)
            ? category.class_options.map((option: any, index: number) => ({
                id: Number(option.id || index),
                value: String(option.value || ""),
                is_active: Boolean(option.is_active),
                sort_order: Number(option.sort_order ?? index),
            }))
            : [],

        active_directions_count:
            category.active_directions_count ??
            (Array.isArray(category.directions)
                ? category.directions.filter((item: any) => item.is_active).length
                : 0),
    };
};

export const AdminCategoriesPage = () => {
    const { t } = useTranslation();

    const [categories, setCategories] = useState<AdminCatalogCategory[]>([]);
    const [loading, setLoading] = useState(false);

    const [activeFilter, setActiveFilter] = useState("all_filter");
    const [search, setSearch] = useState("");

    const [editingId, setEditingId] = useState<number | null>(null);
    const [form, setForm] = useState<CategoryFormState>(emptyCategoryForm);

    const isSchoolCategory = useMemo(() => {
        return isSchoolCategorySlug(form.slug);
    }, [form.slug]);

    const loadCategories = async () => {
        try {
            setLoading(true);

            const response = await getCategories({
                is_active: activeFilter,
                search,
            });

            const normalized = (response.data || []).map(normalizeCategory);
            setCategories(normalized);
        } catch (error) {
            console.log("CATEGORIES LOAD ERROR:", error);
            alert(t("adminCatalog.messages.loadError"));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCategories();
    }, [activeFilter]);

    const resetForm = () => {
        setEditingId(null);
        setForm(emptyCategoryForm);
    };

    const handleSubmit = async () => {
        if (!form.name_ru.trim()) {
            alert(t("adminCatalog.validation.nameRequired"));
            return;
        }

        const payload = buildCategoryPayload(form);

        try {
            if (editingId) {
                await updateCategory(editingId, payload as any);
                alert(t("adminCatalog.messages.updated"));
            } else {
                await createCategory(payload as any);
                alert(t("adminCatalog.messages.created"));
            }

            resetForm();
            await loadCategories();
        } catch (error) {
            console.log("CATEGORY SAVE ERROR:", error);
            alert(t("adminCatalog.messages.saveError"));
        }
    };

    const handleEdit = (category: AdminCatalogCategory) => {
        setEditingId(category.id);
        setForm(mapCategoryToForm(category));

        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleDelete = async (category: AdminCatalogCategory) => {
        const ok = confirm(
            `${t("adminCatalog.messages.deleteConfirm")} "${category.name_ru}"?`,
        );

        if (!ok) return;

        try {
            await deleteCategory(category.id);
            await loadCategories();
        } catch (error) {
            console.log("CATEGORY DELETE ERROR:", error);
            alert(t("adminCatalog.messages.deleteError"));
        }
    };

    const handleToggle = async (category: AdminCatalogCategory) => {
        try {
            await toggleCategoryActive(category as any);
            await loadCategories();
        } catch (error) {
            console.log("CATEGORY TOGGLE ERROR:", error);
            alert(t("adminCatalog.messages.statusError"));
        }
    };

    return (
        <main className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl space-y-6 pb-10">
                <AdminCategoriesHeader count={categories.length} />

                <CategoryForm
                    form={form}
                    editingId={editingId}
                    isSchoolCategory={isSchoolCategory}
                    onChange={setForm}
                    onSubmit={handleSubmit}
                    onReset={resetForm}
                />

                <CategoryList
                    categories={categories}
                    loading={loading}
                    search={search}
                    activeFilter={activeFilter}
                    onSearchChange={setSearch}
                    onActiveFilterChange={setActiveFilter}
                    onSearch={loadCategories}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onToggle={handleToggle}
                />
            </div>
        </main>
    );
};

export default AdminCategoriesPage;