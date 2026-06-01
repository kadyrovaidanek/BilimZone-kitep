import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useSearchParams } from "react-router-dom";

import { getCategories, type Category } from "@/shared/api/categories";
import {
  getPublishedPublications,
  type Publication,
  type PublicationPriceType,
} from "@/shared/api/publications";

import image from "@/assets/images/glavn1.png";

import {
  BookOpen,
  Clock,
  Filter,
  Flame,
  LayoutGrid,
  Search,
  FileText,
  Eye,
  Download,
} from "lucide-react";

type FilterType = "all" | "popular" | "new";

export const CatalogPage = () => {
  const { t, i18n } = useTranslation();
  const [searchParams] = useSearchParams();

  const searchFromUrl = searchParams.get("search") || "";

  const [categories, setCategories] = useState<Category[]>([]);
  const [publications, setPublications] = useState<Publication[]>([]);

  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("all");
  const [selectedDirectionId, setSelectedDirectionId] = useState<string>("all");
  const [selectedOptionId, setSelectedOptionId] = useState<string>("all");
  const [selectedPriceType, setSelectedPriceType] =
    useState<"all" | PublicationPriceType>("all");

  const [search, setSearch] = useState(searchFromUrl);
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");

  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingPublications, setLoadingPublications] = useState(false);

  const currentLang = i18n.language === "kg" ? "kg" : "ru";

  useEffect(() => {
    setSearch(searchFromUrl);
  }, [searchFromUrl]);

  const selectedCategory = useMemo(() => {
    return categories.find((item) => String(item.id) === selectedCategoryId);
  }, [categories, selectedCategoryId]);

  const selectedDirections = useMemo(() => {
    return selectedCategory?.directions?.filter((item) => item.is_active) || [];
  }, [selectedCategory]);

  const selectedClassOptions = useMemo(() => {
    return (
      selectedCategory?.class_options?.filter((item) => item.is_active) ||
      selectedCategory?.options?.filter((item) => item.is_active) ||
      []
    );
  }, [selectedCategory]);

  const isSchoolCategory = selectedCategory?.slug === "school";

  const categoryName = (category: Category) => {
    return currentLang === "kg"
      ? category.name_kg || category.name_ru
      : category.name_ru;
  };

  const publicationCategoryName = (publication: Publication) => {
    return currentLang === "kg"
      ? publication.category_name_kg || publication.category_name_ru
      : publication.category_name_ru;
  };

  const publicationDirectionName = (publication: Publication) => {
    return currentLang === "kg"
      ? publication.direction_name_kg || publication.direction_name_ru
      : publication.direction_name_ru;
  };

  const loadCategories = async () => {
    try {
      setLoadingCategories(true);

      const response = await getCategories({
        is_active: "true",
        search: "",
      });

      const activeCategories = response.data
        .filter((category) => category.is_active)
        .map((category) => ({
          ...category,
          directions:
            category.directions?.filter((direction) => direction.is_active) ||
            [],
          class_options:
            category.class_options?.filter((option) => option.is_active) || [],
        }));

      setCategories(activeCategories);
    } catch (error) {
      console.log("CATALOG CATEGORIES LOAD ERROR:", error);
    } finally {
      setLoadingCategories(false);
    }
  };

  const loadPublications = async () => {
    try {
      setLoadingPublications(true);

      const params: Record<string, string> = {};

      if (search.trim()) {
        params.search = search.trim();
      }

      if (selectedCategoryId !== "all") {
        params.category = selectedCategoryId;
      }

      if (selectedDirectionId !== "all") {
        params.direction = selectedDirectionId;
      }

      if (selectedOptionId !== "all") {
        params.option = selectedOptionId;
      }

      if (selectedPriceType !== "all") {
        params.price_type = selectedPriceType;
      }

      const response = await getPublishedPublications(params);

      setPublications(response.data);
    } catch (error) {
      console.log("CATALOG PUBLICATIONS LOAD ERROR:", error);
      setPublications([]);
    } finally {
      setLoadingPublications(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      loadPublications();
    }, 300);

    return () => window.clearTimeout(timer);
  }, [
    search,
    selectedCategoryId,
    selectedDirectionId,
    selectedOptionId,
    selectedPriceType,
  ]);

  const sortedPublications = useMemo(() => {
    const list = [...publications];

    if (activeFilter === "popular") {
      return list.sort(
        (a, b) =>
          (b.views_count || 0) +
          (b.downloads_count || 0) -
          ((a.views_count || 0) + (a.downloads_count || 0)),
      );
    }

    if (activeFilter === "new") {
      return list.sort((a, b) => {
        const dateA = a.published_at || a.created_at || "";
        const dateB = b.published_at || b.created_at || "";

        return new Date(dateB).getTime() - new Date(dateA).getTime();
      });
    }

    return list;
  }, [publications, activeFilter]);

  const resetFilters = () => {
    setSelectedCategoryId("all");
    setSelectedDirectionId("all");
    setSelectedOptionId("all");
    setSelectedPriceType("all");
  };

  const listTitle = search.trim()
    ? `${t("catalogPage.searchResults")}: ${search.trim()}`
    : t("catalogPage.allMaterials", "Все материалы");

  return (
    <div className="min-h-screen bg-slate-50">
      <section
        className="px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16"
        style={{ backgroundColor: "#C5E5FE" }}
      >
        <div className="mx-auto flex max-w-7xl flex-col-reverse items-center justify-between gap-8 md:flex-row lg:gap-12">
          <div className="w-full max-w-2xl text-center md:text-left">
            <h1 className="text-2xl font-black leading-tight text-slate-800 sm:text-4xl lg:text-5xl">
              {t("homePage.hero.title")}
            </h1>

            <p className="mt-3 text-sm text-slate-600 sm:mt-4 sm:text-lg lg:text-xl">
              {t("homePage.hero.subtitle")}
            </p>

            <div className="relative mx-auto mt-5 w-full max-w-xl sm:mt-8 md:mx-0">
              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder={t("homePage.hero.searchPlaceholder")}
                className="w-full rounded-xl border border-gray-300 bg-white p-3 pr-12 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 sm:p-4 sm:text-base"
              />

              <Search
                size={20}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
              />
            </div>
          </div>

          <div className="flex w-full justify-center md:w-auto">
            <img
              src={image}
              alt="hero"
              className="w-[190px] object-contain sm:w-[280px] md:w-[340px] lg:w-[390px]"
            />
          </div>
        </div>
      </section>

      <section className="px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                {t("catalogPage.title")}
              </h2>

              <p className="mt-2 text-sm text-slate-500 sm:text-base">
                {t("catalogPage.subtitle")}
              </p>
            </div>

            <div className="flex w-full rounded-2xl border border-slate-200 bg-white p-1 shadow-sm sm:w-fit">
              {(["all", "popular", "new"] as const).map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setActiveFilter(filter)}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition sm:flex-none ${activeFilter === filter
                    ? "bg-blue-600 text-white"
                    : "text-slate-500 hover:bg-slate-50"
                    }`}
                >
                  {filter === "all" && <LayoutGrid size={16} />}
                  {filter === "popular" && <Flame size={16} />}
                  {filter === "new" && <Clock size={16} />}
                  {t(`catalogPage.filters.${filter}`)}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
            <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:sticky lg:top-24">
              <div className="mb-4 flex items-center gap-2 font-bold text-slate-800">
                <Filter size={18} className="text-blue-600" />
                {t("catalogPage.categoriesTitle")}
              </div>

              <div className="space-y-4">
                <label className="block">
                  <span className="mb-2 block text-xs font-bold text-slate-500">
                    {t("publicationCreate.fields.category")}
                  </span>

                  <select
                    value={selectedCategoryId}
                    onChange={(event) => {
                      setSelectedCategoryId(event.target.value);
                      setSelectedDirectionId("all");
                      setSelectedOptionId("all");
                    }}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="all">
                      {t("catalogPage.allCategories", "Все категории")}
                    </option>

                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {categoryName(category)}
                      </option>
                    ))}
                  </select>
                </label>

                {selectedCategoryId !== "all" && (
                  <label className="block">
                    <span className="mb-2 block text-xs font-bold text-slate-500">
                      {t("publicationCreate.fields.direction")}
                    </span>

                    <select
                      value={selectedDirectionId}
                      onChange={(event) => {
                        setSelectedDirectionId(event.target.value);
                        setSelectedOptionId("all");
                      }}
                      className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-100"
                    >
                      <option value="all">
                        {t("catalogPage.allDirections", "Все направления")}
                      </option>

                      {selectedDirections.map((direction) => (
                        <option key={direction.id} value={direction.id}>
                          {currentLang === "kg"
                            ? direction.name_kg || direction.name_ru
                            : direction.name_ru}
                        </option>
                      ))}
                    </select>
                  </label>
                )}

                {selectedCategoryId !== "all" &&
                  isSchoolCategory &&
                  selectedClassOptions.length > 0 && (
                    <label className="block">
                      <span className="mb-2 block text-xs font-bold text-slate-500">
                        {t("publicationCreate.fields.option")}
                      </span>

                      <select
                        value={selectedOptionId}
                        onChange={(event) =>
                          setSelectedOptionId(event.target.value)
                        }
                        className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-100"
                      >
                        <option value="all">
                          {t("catalogPage.allOptions", "Все")}
                        </option>

                        {selectedClassOptions.map((option) => (
                          <option key={option.id} value={option.id}>
                            {option.value}
                          </option>
                        ))}
                      </select>
                    </label>
                  )}

                <label className="block">
                  <span className="mb-2 block text-xs font-bold text-slate-500">
                    {t("publicationCreate.fields.priceType")}
                  </span>

                  <select
                    value={selectedPriceType}
                    onChange={(event) =>
                      setSelectedPriceType(
                        event.target.value as "all" | PublicationPriceType,
                      )
                    }
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="all">
                      {t("catalogPage.allPriceTypes", "Все")}
                    </option>

                    <option value="free">
                      {t("publicationCreate.priceTypes.free")}
                    </option>

                    <option value="paid">
                      {t("publicationCreate.priceTypes.paid")}
                    </option>
                  </select>
                </label>

                <button
                  type="button"
                  onClick={resetFilters}
                  className="w-full rounded-xl bg-slate-100 px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-200"
                >
                  {t("catalogPage.resetFilters", "Сбросить фильтры")}
                </button>
              </div>

              {loadingCategories && (
                <p className="mt-4 text-sm text-slate-400">
                  {t("catalogPage.loading")}
                </p>
              )}
            </aside>

            <main className="space-y-5">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="text-xl font-bold text-slate-900">
                  {listTitle}
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  {sortedPublications.length}{" "}
                  {t("catalogPage.materialsCount", "материалов найдено")}
                </p>
              </div>

              {loadingPublications ? (
                <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-400">
                  {t("catalogPage.loading")}
                </div>
              ) : sortedPublications.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-400">
                  <FileText className="mx-auto mb-4 h-14 w-14 text-slate-300" />
                  {t("catalogPage.emptyMaterials", "Материалы не найдены")}
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                  {sortedPublications.map((publication) => (
                    <Link
                      key={publication.id}
                      to={`/publications/${publication.id}`}
                      className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                    >
                      <div className="h-44 overflow-hidden bg-slate-100">
                        {publication.cover_url ? (
                          <img
                            src={publication.cover_url}
                            alt={publication.title}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-slate-300">
                            <BookOpen size={48} />
                          </div>
                        )}
                      </div>

                      <div className="p-5">
                        <div className="mb-3 flex flex-wrap gap-2">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-bold ${publication.price_type === "free"
                              ? "bg-green-50 text-green-700"
                              : "bg-orange-50 text-orange-700"
                              }`}
                          >
                            {publication.price_type === "free"
                              ? t("publicationCreate.priceTypes.free")
                              : `${publication.price} сом`}
                          </span>

                          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                            {publicationCategoryName(publication)}
                          </span>
                        </div>

                        <h4 className="line-clamp-2 text-lg font-black text-slate-900">
                          {publication.title}
                        </h4>

                        {publication.description && (
                          <p className="mt-2 line-clamp-2 text-sm text-slate-500">
                            {publication.description}
                          </p>
                        )}

                        <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold">
                          <span className="rounded-full bg-purple-50 px-3 py-1 text-purple-700">
                            {publicationDirectionName(publication)}
                          </span>

                          {publication.option_value && (
                            <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-600">
                              {publication.option_value}
                            </span>
                          )}
                        </div>

                        <div className="mt-4 flex items-center gap-4 text-xs text-slate-400">
                          <span className="inline-flex items-center gap-1">
                            <Eye size={14} />
                            {publication.views_count || 0}
                          </span>

                          <span className="inline-flex items-center gap-1">
                            <Download size={14} />
                            {publication.downloads_count || 0}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </main>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CatalogPage;