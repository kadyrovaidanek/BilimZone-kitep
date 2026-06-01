import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";

import image from "@/assets/images/glavn1.png";

import { CategoriesSection } from "./CategoriesSection";
import { EducationSection } from "./EducationSection";
import { PopularSection } from "./PopularSection";
import { getHomeData, type HomeData } from "../api/homeApi";

export const HomePage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [homeData, setHomeData] = useState<HomeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const loadHomeData = async () => {
    try {
      setLoading(true);

      const data = await getHomeData();

      setHomeData(data);
    } catch (error) {
      console.log("HOME DATA ERROR:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHomeData();
  }, []);

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const value = search.trim();

    if (!value) {
      navigate("/catalog");
      return;
    }

    navigate(`/catalog?search=${encodeURIComponent(value)}`);
  };

  return (
    <div className="w-full overflow-hidden bg-white">
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

            <form
              onSubmit={handleSearchSubmit}
              className="relative mx-auto mt-5 w-full max-w-xl sm:mt-8 md:mx-0"
            >
              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder={t("homePage.hero.searchPlaceholder")}
                className="w-full rounded-xl border border-gray-300 bg-white p-3 pr-12 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 sm:p-4 sm:text-base"
              />

              <button
                type="submit"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-blue-600"
                aria-label="Search"
              >
                <Search size={20} />
              </button>
            </form>
          </div>

          <div className="flex w-full justify-center md:w-auto">
            <img
              src={image}
              alt="hero"
              className="w-[190px] object-contain xs:w-[220px] sm:w-[280px] md:w-[340px] lg:w-[390px]"
            />
          </div>
        </div>
      </section>

      <PopularSection
        materials={homeData?.popular_materials || []}
        loading={loading}
      />

      <CategoriesSection
        categories={homeData?.categories || []}
        loading={loading}
      />

      <EducationSection stats={homeData?.stats} loading={loading} />
    </div>
  );
};

export default HomePage;