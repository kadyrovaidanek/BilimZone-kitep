import { useState, useEffect, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  BookOpen,
  FileText,
  GraduationCap,
  Library,
  PenTool,
  Microscope,
} from "lucide-react";
import { Link } from "react-router-dom";

import type { HomeCategory } from "../api/homeApi";

const categoryStyles = [
  { icon: GraduationCap, gradient: "from-emerald-500 to-teal-600" },
  { icon: FileText, gradient: "from-orange-500 to-red-600" },
  { icon: Library, gradient: "from-purple-500 to-pink-600" },
  { icon: Microscope, gradient: "from-blue-500 to-cyan-600" },
  { icon: BookOpen, gradient: "from-indigo-500 to-purple-600" },
  { icon: PenTool, gradient: "from-rose-500 to-orange-600" },
];

type Props = {
  categories: HomeCategory[];
  loading?: boolean;
};

export const CategoriesSection = ({ categories, loading = false }: Props) => {
  const { t, i18n } = useTranslation();
  const [index, setIndex] = useState(0);

  const preparedCategories = useMemo(
    () =>
      categories.map((category, idx) => {
        const name =
          i18n.language === "kg"
            ? category.name_kg || category.name_ru
            : category.name_ru || category.name_kg;

        return {
          ...category,
          name: name || `${t("homePage.popular.category")} №${category.id}`,
          style: categoryStyles[idx % categoryStyles.length],
          link: "/catalog",
        };
      }),
    [categories, i18n.language, t],
  );

  const next = useCallback(() => {
    if (preparedCategories.length === 0) return;

    setIndex((prev) => (prev + 1) % preparedCategories.length);
  }, [preparedCategories.length]);

  const prev = useCallback(() => {
    if (preparedCategories.length === 0) return;

    setIndex((prev) =>
      prev === 0 ? preparedCategories.length - 1 : prev - 1,
    );
  }, [preparedCategories.length]);

  useEffect(() => {
    if (preparedCategories.length === 0) return;

    const interval = setInterval(next, 5000);

    return () => clearInterval(interval);
  }, [next, preparedCategories.length]);

  useEffect(() => {
    if (index >= preparedCategories.length) {
      setIndex(0);
    }
  }, [index, preparedCategories.length]);

  const activeCategory = preparedCategories[index];

  return (
    <section className="relative overflow-hidden bg-[#F8FAFC] py-14 sm:py-20 lg:py-24">
      <motion.div
        animate={{
          x: ["-100%", "200%"],
          opacity: [0, 0.4, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear",
        }}
        className="pointer-events-none absolute left-0 top-1/2 h-[220px] w-[360px] rounded-full bg-blue-300/20 blur-[100px] sm:h-[300px] sm:w-[600px] sm:blur-[120px]"
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center sm:mb-14 lg:mb-16">
          <div className="mb-4 inline-flex items-center gap-2">
            <Sparkles className="h-5 w-5 animate-pulse text-blue-500" />

            <span className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 sm:text-sm">
              {t("homePage.categories.label")}
            </span>
          </div>

          <h2 className="text-2xl font-black leading-tight tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            {t("homePage.categories.titleStart")}{" "}
            <span className="text-blue-600">
              {t("homePage.categories.titleHighlight")}
            </span>
          </h2>
        </div>

        {loading && (
          <div className="mx-auto h-[300px] max-w-sm animate-pulse rounded-[40px] bg-white shadow-sm" />
        )}

        {!loading && preparedCategories.length === 0 && (
          <div className="rounded-3xl border border-slate-100 bg-white p-8 text-center shadow-sm">
            <p className="text-sm font-semibold text-slate-500">
              {t("homePage.categories.empty")}
            </p>
          </div>
        )}

        {!loading && activeCategory && (
          <>
            <div className="sm:hidden">
              <div className="relative flex items-center justify-center">
                <button
                  type="button"
                  onClick={prev}
                  className="absolute left-0 z-20 rounded-full bg-white p-2 text-slate-500 shadow"
                  aria-label="Previous category"
                >
                  <ChevronLeft size={22} />
                </button>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeCategory.id}
                    initial={{ opacity: 0, x: 40, scale: 0.95 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: -40, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="w-[250px]"
                  >
                    <Link to={activeCategory.link} className="block">
                      <div className="overflow-hidden rounded-[30px] shadow-[0_25px_50px_-20px_rgba(59,130,246,0.35)]">
                        <div
                          className={`flex h-36 items-center justify-center bg-gradient-to-br ${activeCategory.style.gradient}`}
                        >
                          <activeCategory.style.icon className="h-16 w-16 text-white drop-shadow-xl" />
                        </div>

                        <div className="bg-white p-6 text-center">
                          <h3 className="text-lg font-bold text-slate-800">
                            {activeCategory.name}
                          </h3>

                          <p className="mt-2 text-xs font-medium uppercase tracking-wider text-slate-400">
                            {activeCategory.materials_count}{" "}
                            {t("homePage.categories.files")}
                          </p>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                </AnimatePresence>

                <button
                  type="button"
                  onClick={next}
                  className="absolute right-0 z-20 rounded-full bg-white p-2 text-slate-500 shadow"
                  aria-label="Next category"
                >
                  <ChevronRight size={22} />
                </button>
              </div>
            </div>

            <div className="relative hidden h-[400px] items-center justify-center sm:flex">
              <button
                type="button"
                onClick={prev}
                className="absolute left-4 z-30 rounded-full bg-white/70 p-3 text-slate-400 shadow-sm backdrop-blur-md transition-all hover:bg-white hover:text-blue-600 md:left-10"
                aria-label="Previous category"
              >
                <ChevronLeft size={24} />
              </button>

              <button
                type="button"
                onClick={next}
                className="absolute right-4 z-30 rounded-full bg-white/70 p-3 text-slate-400 shadow-sm backdrop-blur-md transition-all hover:bg-white hover:text-blue-600 md:right-10"
                aria-label="Next category"
              >
                <ChevronRight size={24} />
              </button>

              <div className="relative flex w-full items-center justify-center">
                <AnimatePresence mode="popLayout">
                  {preparedCategories.map((cat, i) => {
                    const isActive = i === index;
                    const isLeft =
                      i ===
                      (index - 1 + preparedCategories.length) %
                      preparedCategories.length;
                    const isRight =
                      i === (index + 1) % preparedCategories.length;

                    if (!isActive && !isLeft && !isRight) return null;

                    return (
                      <motion.div
                        key={cat.id}
                        initial={{
                          opacity: 0,
                          scale: 0.8,
                          x: isLeft ? -80 : 80,
                        }}
                        animate={{
                          opacity: isActive ? 1 : 0.25,
                          scale: isActive ? 1 : 0.78,
                          x: isActive ? 0 : isLeft ? -190 : 190,
                          zIndex: isActive ? 20 : 10,
                          filter: isActive ? "blur(0px)" : "blur(2px)",
                        }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        transition={{
                          type: "spring",
                          stiffness: 150,
                          damping: 25,
                        }}
                        className="absolute"
                      >
                        <Link to={cat.link} className="group block">
                          <div
                            className={`
                              w-[280px] overflow-hidden rounded-[40px] transition-all duration-700 md:w-[310px]
                              ${isActive
                                ? "shadow-[0_35px_70px_-15px_rgba(59,130,246,0.25)]"
                                : "shadow-none"
                              }
                            `}
                          >
                            <div
                              className={`relative flex h-44 items-center justify-center bg-gradient-to-br ${cat.style.gradient}`}
                            >
                              {isActive && (
                                <motion.div
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: [0, 1, 0] }}
                                  transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                  }}
                                  className="absolute inset-0 bg-white/20 blur-2xl"
                                />
                              )}

                              <cat.style.icon className="h-20 w-20 text-white drop-shadow-xl" />
                            </div>

                            <div className="bg-white p-8 text-center">
                              <h3 className="text-xl font-bold text-slate-800">
                                {cat.name}
                              </h3>

                              <p className="mt-2 text-sm font-medium uppercase tracking-wider text-slate-400">
                                {cat.materials_count}{" "}
                                {t("homePage.categories.files")}
                              </p>
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </div>

            <div className="mt-8 flex justify-center gap-3 sm:mt-10">
              {preparedCategories.map((_, i) => (
                <button
                  type="button"
                  onClick={() => setIndex(i)}
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-500 ${i === index ? "w-10 bg-blue-600" : "w-1.5 bg-slate-200"
                    }`}
                  aria-label={`Category ${i + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
};