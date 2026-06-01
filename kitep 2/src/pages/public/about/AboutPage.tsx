import aboutImg from "@/assets/images/about.svg";
import { useTranslation } from "react-i18next";
import {Target, Rocket, Heart } from "lucide-react";

export const AboutPage = () => {
  const { t } = useTranslation();

  return (
    <div className="bg-[#FCFCFD] min-h-screen text-slate-900 selection:bg-blue-100 overflow-hidden">
      
      {/* 🌌 BACKGROUND ELEMENTS — Декоративные пятна для глубины */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] bg-blue-50/50 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] left-[-5%] w-[300px] h-[300px] bg-purple-50/50 rounded-full blur-[100px]" />
      </div>

      {/* 🔹 HERO SECTION */}
      <section className="relative max-w-7xl mx-auto px-6 pt-24 pb-20 md:pt-10 md:pb-22">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          
          <div className="flex-1 space-y-5 z-10">
            <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-white border border-slate-200/60 shadow-sm">
              
    
            </div>
            
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-950 leading-[1.1]">
              {t("aboutPage.title")}
              <span className="text-blue-600">.</span>
            </h1>

            <div className="space-y-6 max-w-xl">
              <p className="text-xl text-slate-600 leading-relaxed font-light">
                {t("aboutPage.text1")}
              </p>
              <p className="text-base text-slate-400 leading-relaxed border-l-2 border-slate-100 pl-6">
                {t("aboutPage.text2")}
              </p>
            </div>

          </div>

          <div className="flex-1 w-full relative">
            {/* Декоративная рамка вокруг изображения */}
            <div className="relative z-10 p-4 bg-white/40 backdrop-blur-sm border border-white/80 rounded-[48px] shadow-2xl">
              <img
                src={aboutImg}
                alt="about"
                className="w-full h-auto object-contain rounded-[32px]"
              />
            </div>
            {/* Абстрактная фигура сзади */}
            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob" />
          </div>
        </div>
      </section>

      {/* 🔹 MISSION SECTION — Элегантный финал */}
      <section className="max-w-5xl mx-auto px-6 py-10">
        <div className="bg-white border border-slate-100 rounded-[60px] p-12 md:p-24 relative overflow-hidden shadow-sm">
          <div className="grid lg:grid-cols-2 gap-20 items-center relative z-10">
            <div>
              <div className="flex items-center gap-4 mb-8">
                <span className="h-[2px] w-8 bg-blue-600" />
                <span className="text-xs font-black uppercase tracking-[0.2em] text-blue-600">Наша философия</span>
              </div>
              <h2 className="text-4xl md:text-3xl font-bold text-slate-950 mb-10 tracking-tight leading-tight">
                {t("aboutPage.missionTitle")}
              </h2>
              <blockquote className="text-1xl text-slate-500 leading-relaxed font-serif italic border-l-4 border-blue-50 pl-8">
                «{t("aboutPage.missionText")}»
              </blockquote>
            </div>
            
            <div className="flex justify-center">
              <div className="relative w-full max-w-xs aspect-square">
                {/* Элементы-карточки со смещением */}
                <div className="absolute top-0 left-0 w-32 h-32 bg-white shadow-2xl rounded-3xl p-6 flex flex-col items-center justify-center rotate-[-10deg] border border-slate-50">
                   <Target className="text-blue-500 mb-3" size={32} />
                   <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Цель</span>
                </div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-white shadow-2xl rounded-[40px] p-6 flex flex-col items-center justify-center z-10 border border-slate-50">
                   <Rocket className="text-indigo-600 mb-3" size={40} />
                   <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Развитие</span>
                </div>
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-white shadow-2xl rounded-3xl p-6 flex flex-col items-center justify-center rotate-[15deg] border border-slate-50">
                   <Heart className="text-rose-500 mb-3" size={32} />
                   <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Забота</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Фоновый текст на заднем плане секции */}
          <div className="absolute -bottom-20 -right-20 text-[200px] font-black text-slate-50 select-none -z-0">
            GOAL
          </div>
        </div>
      </section>

    </div>
  );
};