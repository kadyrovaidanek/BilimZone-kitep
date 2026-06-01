import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import {
    ArrowLeft,
    BookOpen,
    FileText,
    User,
    Calendar,
    Star,
    Globe,
    MapPin,
    Building2,
    Info,
} from "lucide-react";

import {
    getPublicUserById,
    type PublicUser,
} from "@/shared/api/users";

import type { Publication } from "@/shared/api/publications";

export const UserProfilePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const [profile, setProfile] = useState<PublicUser | null>(null);
    const [materials, setMaterials] = useState<Publication[]>([]);
    const [loading, setLoading] = useState(false);

    const loadProfile = async () => {
        if (!id) return;

        try {
            setLoading(true);

            const res = await getPublicUserById(id);

            setProfile(res.data.user);
            setMaterials(res.data.materials || []);
        } catch (error) {
            console.log("USER PROFILE LOAD ERROR:", error);
            setProfile(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProfile();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-500">
                {t("common.loading", "Загрузка...")}
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4 text-center">
                <User className="w-16 h-16 text-slate-300 mb-4" />

                <h1 className="text-xl font-black text-slate-700">
                    {t("users.notFound", "Пользователь не найден")}
                </h1>

                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="mt-4 text-blue-600 font-bold underline"
                >
                    {t("common.back", "Назад")}
                </button>
            </div>
        );
    }

    const displayName =
        profile.organization_name ||
        profile.full_name ||
        profile.username;

    const aboutText =
        profile.description ||
        profile.bio ||
        "";

    return (
        <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-6">
                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900"
                >
                    <ArrowLeft size={18} />
                    {t("common.back", "Назад")}
                </button>

                <section className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 sm:p-7">
                    <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                        <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 overflow-hidden">
                            {profile.photo_url ? (
                                <img
                                    src={profile.photo_url}
                                    alt={displayName}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <User size={58} />
                            )}
                        </div>

                        <div className="min-w-0 flex-1">
                            <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-4">
                                <div>
                                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900 break-words">
                                        {displayName}
                                    </h1>

                                    <p className="mt-2 text-slate-500 font-semibold">
                                        @{profile.username}
                                    </p>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    {profile.role_name && (
                                        <span className="rounded-full bg-slate-100 text-slate-600 px-3 py-1 text-xs font-bold">
                                            {profile.role_name}
                                        </span>
                                    )}

                                    <span className="rounded-full bg-blue-50 text-blue-600 px-3 py-1 text-xs font-bold">
                                        {t("users.materialsCount", {
                                            count: profile.materials_count,
                                            defaultValue: "Материалов: " + profile.materials_count,
                                        })}
                                    </span>
                                </div>
                            </div>

                            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                                {profile.organization_name && (
                                    <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4">
                                        <div className="flex items-center gap-2 text-xs text-slate-400 font-bold mb-1">
                                            <Building2 size={15} />
                                            {t("users.organization", "Организация")}
                                        </div>
                                        <p className="font-bold text-slate-800 break-words">
                                            {profile.organization_name}
                                        </p>
                                    </div>
                                )}

                                {profile.website && (
                                    <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4">
                                        <div className="flex items-center gap-2 text-xs text-slate-400 font-bold mb-1">
                                            <Globe size={15} />
                                            {t("users.website", "Сайт")}
                                        </div>
                                        <a
                                            href={profile.website}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="font-bold text-blue-600 hover:underline break-words"
                                        >
                                            {profile.website}
                                        </a>
                                    </div>
                                )}

                                {profile.address && (
                                    <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4">
                                        <div className="flex items-center gap-2 text-xs text-slate-400 font-bold mb-1">
                                            <MapPin size={15} />
                                            {t("users.address", "Адрес")}
                                        </div>
                                        <p className="font-bold text-slate-800 break-words">
                                            {profile.address}
                                        </p>
                                    </div>
                                )}

                                {profile.created_at && (
                                    <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4">
                                        <div className="flex items-center gap-2 text-xs text-slate-400 font-bold mb-1">
                                            <Calendar size={15} />
                                            {t("users.createdAt", "Дата регистрации")}
                                        </div>
                                        <p className="font-bold text-slate-800">
                                            {new Date(profile.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {aboutText && (
                                <div className="mt-5 rounded-2xl bg-blue-50 border border-blue-100 p-4">
                                    <div className="flex items-center gap-2 text-sm font-black text-blue-700 mb-2">
                                        <Info size={18} />
                                        {t("users.about", "О пользователе")}
                                    </div>

                                    <p className="text-sm text-blue-900 leading-6 whitespace-pre-line">
                                        {aboutText}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                <section className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 sm:p-7">
                    <div className="mb-5">
                        <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                            {t("users.publications", "Публикации пользователя")}
                        </h2>

                        <p className="text-sm text-slate-500 mt-1">
                            {t(
                                "users.publicationsSubtitle",
                                "Опубликованные материалы этого пользователя"
                            )}
                        </p>
                    </div>

                    {materials.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-slate-400">
                            <FileText className="w-12 h-12 mx-auto mb-3" />
                            {t(
                                "users.noMaterials",
                                "У пользователя пока нет опубликованных материалов"
                            )}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                            {materials.map((material) => (
                                <Link
                                    key={material.id}
                                    to={`/publications/${material.id}`}
                                    className="group rounded-2xl border border-slate-200 bg-white overflow-hidden hover:shadow-lg transition"
                                >
                                    <div className="h-48 bg-slate-100 flex items-center justify-center overflow-hidden">
                                        {material.cover_url ? (
                                            <img
                                                src={material.cover_url}
                                                alt={material.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition"
                                            />
                                        ) : (
                                            <BookOpen className="w-14 h-14 text-slate-300" />
                                        )}
                                    </div>

                                    <div className="p-4">
                                        <h3 className="font-black text-slate-900 line-clamp-2">
                                            {material.title}
                                        </h3>

                                        <p className="text-sm text-slate-500 mt-2 line-clamp-2">
                                            {material.description || t("publication.card.noDescription")}
                                        </p>

                                        <div className="mt-4 flex items-center justify-between gap-2">
                                            <span className="text-xs font-bold rounded-full bg-blue-50 text-blue-600 px-3 py-1">
                                                {material.price_type === "free"
                                                    ? t("publicationCreate.priceTypes.free", "Бесплатно")
                                                    : `${material.price} сом`}
                                            </span>

                                            <span className="inline-flex items-center gap-1 text-xs font-bold text-yellow-500">
                                                <Star size={14} className="fill-yellow-400" />
                                                {material.average_rating || 0}
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
};