import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
  BookOpen,
  Users,
  ShieldCheck,
  Zap,
  Globe,
  Award,
} from "lucide-react";

import type { HomeData } from "../api/homeApi";

const benefits = [
  {
    titleKey: "homePage.education.benefits.library.title",
    descriptionKey: "homePage.education.benefits.library.description",
    icon: BookOpen,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    titleKey: "homePage.education.benefits.experts.title",
    descriptionKey: "homePage.education.benefits.experts.description",
    icon: Users,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
  {
    titleKey: "homePage.education.benefits.security.title",
    descriptionKey: "homePage.education.benefits.security.description",
    icon: ShieldCheck,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
  },
  {
    titleKey: "homePage.education.benefits.access.title",
    descriptionKey: "homePage.education.benefits.access.description",
    icon: Zap,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
  },
];

type Props = {
  stats?: HomeData["stats"];
  loading?: boolean;
};

export const EducationSection = ({ stats, loading = false }: Props) => {
  const { t } = useTranslation();

  const dynamicStats = [
    {
      labelKey: "homePage.education.stats.users",
      val: stats?.users?.label || "0",
      icon: Globe,
    },
    {
      labelKey: "homePage.education.stats.materials",
      val: stats?.materials?.label || "0",
      icon: BookOpen,
    },
    {
      labelKey: "homePage.education.stats.ratings",
      val: stats?.ratings?.label || "0",
      icon: Award,
    },
    {
      labelKey: "homePage.education.stats.downloads",
      val: stats?.downloads?.label || "0",
      icon: Zap,
    },
  ];

  return (
    <section className="overflow-hidden bg-white py-12 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 grid items-end gap-6 sm:mb-16 lg:mb-20 lg:grid-cols-2 lg:gap-12">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <div className="h-[1px] w-8 bg-blue-600" />

              <span className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600">
                {t("homePage.education.label")}
              </span>
            </div>

            <h2 className="text-2xl font-black leading-tight text-slate-900 sm:text-4xl md:text-5xl">
              {t("homePage.education.titleStart")} <br />

              <span className="text-slate-400">
                {t("homePage.education.titleHighlight")}
              </span>
            </h2>
          </div>

          <p className="max-w-xl pb-2 text-sm text-slate-500 sm:text-lg lg:max-w-md">
            {t("homePage.education.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-8 lg:grid-cols-4">
          {benefits.map((item, idx) => (
            <motion.div
              key={item.titleKey}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
            >
              <div
                className={`mb-5 flex h-12 w-12 items-center justify-center rounded-2xl sm:mb-6 sm:h-14 sm:w-14 ${item.bgColor} ${item.color} transition-transform duration-300 group-hover:scale-110`}
              >
                <item.icon size={26} strokeWidth={2.5} />
              </div>

              <h3 className="mb-3 text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
                {t(item.titleKey)}
              </h3>

              <p className="text-sm leading-relaxed text-slate-500">
                {t(item.descriptionKey)}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 grid grid-cols-2 gap-4 border-t border-slate-100 pt-8 sm:mt-20 sm:gap-8 sm:pt-12 md:grid-cols-4">
          {dynamicStats.map((stat) => (
            <div
              key={stat.labelKey}
              className="rounded-2xl bg-slate-50 px-3 py-5 text-center md:bg-transparent md:p-0 md:text-left"
            >
              <div className="text-2xl font-black text-slate-900 sm:text-3xl">
                {loading ? "..." : stat.val}
              </div>

              <div className="mt-1 text-[10px] font-bold uppercase tracking-widest text-slate-400 sm:text-xs">
                {t(stat.labelKey)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};