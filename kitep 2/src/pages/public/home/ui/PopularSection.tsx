import { useTranslation } from "react-i18next";
import { Eye, Download, Star, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

import type { HomePopularMaterial } from "../api/homeApi";

const typeStylesByIndex = [
  "text-blue-600 bg-blue-50",
  "text-emerald-600 bg-emerald-50",
  "text-purple-600 bg-purple-50",
  "text-orange-600 bg-orange-50",
];

type Props = {
  materials: HomePopularMaterial[];
  loading?: boolean;
};

const getYear = (date?: string) => {
  if (!date) return "";

  return new Date(date).getFullYear();
};

export const PopularSection = ({ materials, loading = false }: Props) => {
  const { t, i18n } = useTranslation();

  const getCategoryName = (material: HomePopularMaterial) => {
    if (i18n.language === "kg") {
      return material.category_name_kg || material.category_name_ru;
    }

    return material.category_name_ru || material.category_name_kg;
  };

  return (
    <section className="bg-white py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-7 flex flex-col gap-4 border-b border-gray-100 pb-5 sm:mb-10 sm:pb-6 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-2xl font-black text-slate-900 sm:text-3xl lg:text-4xl">
              {t("homePage.popular.title")}
            </h2>

            <p className="mt-2 text-sm text-slate-500 sm:text-base">
              {t("homePage.popular.subtitle")}
            </p>
          </div>

          <Link
            to="/materials"
            className="hidden items-center gap-2 text-sm font-semibold text-blue-600 transition-colors hover:text-blue-700 md:flex"
          >
            {t("homePage.popular.viewAll")} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {loading && (
          <div className="grid grid-cols-1 gap-4 xs:grid-cols-2 sm:gap-7 lg:grid-cols-4 lg:gap-8">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-48 animate-pulse rounded-2xl border border-slate-100 bg-slate-50"
              />
            ))}
          </div>
        )}

        {!loading && materials.length === 0 && (
          <div className="rounded-3xl border border-slate-100 bg-slate-50 p-8 text-center">
            <p className="text-sm font-semibold text-slate-500">
              {t("homePage.popular.empty")}
            </p>
          </div>
        )}

        {!loading && materials.length > 0 && (
          <div className="grid grid-cols-1 gap-4 xs:grid-cols-2 sm:gap-7 lg:grid-cols-4 lg:gap-8">
            {materials.map((material, idx) => (
              <div
                key={material.id}
                className="group flex cursor-pointer flex-col rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded px-2 py-1 text-[10px] font-bold uppercase tracking-widest ${typeStylesByIndex[idx % typeStylesByIndex.length]
                      }`}
                  >
                    {getCategoryName(material) || t("homePage.popular.category")}
                  </span>

                  {idx < 2 && (
                    <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-orange-500">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-orange-500" />
                      {t("homePage.popular.trend")}
                    </span>
                  )}
                </div>

                <Link to={`/publications/${material.id}`}>
                  <h3 className="line-clamp-2 text-sm font-bold leading-snug text-slate-800 transition-colors hover:text-blue-600 sm:text-base">
                    {material.title}
                  </h3>
                </Link>

                <div className="mb-4 mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-400">
                  <span>{material.author_username}</span>

                  {material.created_at && (
                    <>
                      <span className="h-1 w-1 rounded-full bg-slate-200" />
                      <span>{getYear(material.created_at)}</span>
                    </>
                  )}
                </div>

                <div className="mt-auto flex items-center justify-between gap-2 text-[11px] font-medium text-slate-400">
                  <div className="flex items-center gap-1">
                    <Eye className="h-3.5 w-3.5" />
                    <span>{material.views_count}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <Download className="h-3.5 w-3.5" />
                    <span>{material.downloads_count}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 fill-current text-amber-400" />
                    <span className="text-slate-600">
                      {material.average_rating || 0}
                    </span>
                  </div>
                </div>

                <div className="mt-4 h-0.5 w-0 bg-blue-600 transition-all duration-300 group-hover:w-full" />
              </div>
            ))}
          </div>
        )}

        <Link
          to="/materials"
          className="mt-8 block w-full rounded-lg border border-slate-200 py-3 text-center text-sm font-bold text-slate-500 hover:bg-slate-50 md:hidden"
        >
          {t("homePage.popular.allMaterials")}
        </Link>
      </div>
    </section>
  );
};