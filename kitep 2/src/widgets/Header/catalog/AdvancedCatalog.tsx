import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { getCategories, type Category } from "@/shared/api/categories";
import { Link } from "react-router-dom";

export const AdvancedCatalog = () => {
  const { i18n } = useTranslation();

  const [categories, setCategories] = useState<Category[]>([]);
  const [activeTab, setActiveTab] = useState<Category | null>(null);
  const [loading, setLoading] = useState(false);

  const currentLang = i18n.language === "kg" ? "kg" : "ru";

  const loadCategories = async () => {
    try {
      setLoading(true);

      const res = await getCategories({
        is_active: "true",
        search: "",
      });

      const activeCategories = res.data
        .filter((category) => category.is_active)
        .map((category) => ({
          ...category,
          directions: category.directions?.filter((direction) => direction.is_active) || [],
          options: category.options?.filter((option) => option.is_active) || [],
        }));

      setCategories(activeCategories);
      setActiveTab(activeCategories[0] || null);
    } catch (error) {
      console.log("CATALOG LOAD ERROR:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const categoryName = (category: Category) => {
    if (currentLang === "kg") {
      return category.name_kg || category.name_ru;
    }

    return category.name_ru;
  };

  const directionName = (direction: Category["directions"][number]) => {
    if (currentLang === "kg") {
      return direction.name_kg || direction.name_ru;
    }

    return direction.name_ru;
  };

  const optionLabel = useMemo(() => {
    if (!activeTab || !activeTab.options || activeTab.options.length === 0) {
      return "";
    }

    const firstOption = activeTab.options[0];

    if (currentLang === "kg") {
      return firstOption.label_kg || firstOption.label_ru || "";
    }

    return firstOption.label_ru || "";
  }, [activeTab, currentLang]);

  if (loading) {
    return (
      <div className="w-[620px] rounded-[24px] bg-white shadow-2xl border border-slate-100 p-8 text-center text-slate-500">
        Загрузка каталога...
      </div>
    );
  }

  if (!categories.length || !activeTab) {
    return (
      <div className="w-[620px] rounded-[24px] bg-white shadow-2xl border border-slate-100 p-8 text-center text-slate-500">
        Категории пока не добавлены
      </div>
    );
  }

  return (
    <div className="flex w-[620px] max-h-[75vh] bg-white rounded-[24px] shadow-2xl border border-slate-100 overflow-hidden">
      {/* Левая часть */}
      <div className="w-[240px] bg-slate-50/80 border-r border-slate-100 p-4 flex flex-col gap-0.5 overflow-y-auto custom-scrollbar">
        <h3 className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-4 px-3 italic">
          Каталог BilimZone
        </h3>

        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onMouseEnter={() => setActiveTab(cat)}
            onClick={() => setActiveTab(cat)}
            className={`w-full flex justify-between items-center px-3 py-2.5 rounded-xl transition-all duration-200 ${activeTab.id === cat.id
              ? "bg-white shadow-sm text-blue-600 ring-1 ring-slate-100"
              : "hover:bg-slate-200/40 text-slate-500"
              }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="text-[13px] font-semibold truncate">
                {categoryName(cat)}
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Правая часть */}
      <div className="flex-1 p-7 flex flex-col bg-white overflow-y-auto custom-scrollbar">
        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
          <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-slate-400 mb-5">
            Направления
          </p>

          {activeTab.directions.length > 0 ? (
            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
              {activeTab.directions.map((item) => (
                <Link
                  key={item.id}
                  to={`/catalog?category=${activeTab.id}&direction=${item.id}`}
                  className="text-[13px] font-medium text-slate-600 hover:text-blue-600 cursor-pointer transition-colors flex items-center gap-2 min-w-0"
                >
                  <div className="w-1 h-1 bg-slate-200 rounded-full shrink-0" />
                  <span className="truncate">{directionName(item)}</span>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-400">
              Направления пока не добавлены
            </p>
          )}
        </div>

        {/* Только если у категории есть опции, например классы */}
        {(activeTab.options?.length || 0) > 0 && (<div className="mt-auto pt-5 border-t border-slate-50">
          <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-slate-400 mb-4">
            {optionLabel}
          </p>

          <div className="grid grid-cols-4 gap-2">
            {activeTab.options?.map((option) => (<Link
              key={option.id}
              to={`/catalog?category=${activeTab.id}&option=${option.id}`}
              className="text-center py-1.5 border border-slate-100 rounded-lg text-[12px] font-bold text-slate-500 hover:border-blue-500 hover:bg-blue-50/50 hover:text-blue-600 transition-all"
            >
              {option.value}
            </Link>
            ))}
          </div>
        </div>
        )}
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      `}</style>
    </div>
  );
};