import { Link } from "react-router-dom";
import { Download, Eye, ShoppingCart, Star } from "lucide-react";
import { useTranslation } from "react-i18next";

import type { Publication } from "@/shared/api/publications";

type PublicationInfoPanelProps = {
    publication: Publication;
};

type PublicationWithOwner = Publication & {
    author_user?: number | string | null;
    author_id?: number | string | null;
    user_id?: number | string | null;
    owner_id?: number | string | null;
};

const getPublicationOwnerId = (publication: PublicationWithOwner) => {
    return (
        publication.author_user ||
        publication.author_id ||
        publication.user_id ||
        publication.owner_id ||
        ""
    );
};

export const PublicationInfoPanel = ({
    publication,
}: PublicationInfoPanelProps) => {
    const { t, i18n } = useTranslation();

    const ownerId = getPublicationOwnerId(publication as PublicationWithOwner);

    const ownerName =
        publication.author_username || t("publication.detail.unknownAuthor");

    const categoryName =
        i18n.language === "kg"
            ? publication.category_name_kg || publication.category_name_ru
            : publication.category_name_ru || publication.category_name_kg;

    const directionName =
        i18n.language === "kg"
            ? publication.direction_name_kg || publication.direction_name_ru
            : publication.direction_name_ru || publication.direction_name_kg;

    return (
        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="flex flex-wrap gap-2">
                <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${publication.price_type === "paid"
                            ? "bg-orange-50 text-orange-700"
                            : "bg-green-50 text-green-700"
                        }`}
                >
                    {publication.price_type === "paid"
                        ? `${publication.price} ${t("publication.price.currency")}`
                        : t("publication.price.free")}
                </span>

                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                    {t(`publication.types.${publication.publication_type}`, {
                        defaultValue: publication.publication_type,
                    })}
                </span>

                {categoryName && (
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                        {categoryName}
                    </span>
                )}

                {directionName && (
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                        {directionName}
                    </span>
                )}

                {publication.option_value && (
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                        {publication.option_value}
                    </span>
                )}
            </div>

            <h1 className="mt-4 text-2xl font-black leading-tight text-slate-900 sm:text-4xl">
                {publication.title}
            </h1>

            <p className="mt-2 text-sm text-slate-500 sm:text-base">
                {t("publication.detail.author")}:{" "}
                {ownerId ? (
                    <Link
                        to={`/users/${ownerId}`}
                        className="font-bold text-blue-600 transition hover:text-blue-700 hover:underline"
                    >
                        {ownerName}
                    </Link>
                ) : (
                    <span className="font-bold text-slate-800">{ownerName}</span>
                )}
            </p>

            <div className="mt-5 grid grid-cols-2 gap-3 text-sm text-slate-500 sm:flex sm:flex-wrap sm:gap-4">
                <span className="inline-flex items-center gap-1 rounded-2xl bg-slate-50 px-3 py-2">
                    <Eye size={17} />
                    {publication.views_count || 0} {t("publication.detail.views")}
                </span>

                <span className="inline-flex items-center gap-1 rounded-2xl bg-slate-50 px-3 py-2">
                    <Download size={17} />
                    {publication.downloads_count || 0}{" "}
                    {t("publication.detail.downloads")}
                </span>

                <span className="inline-flex items-center gap-1 rounded-2xl bg-slate-50 px-3 py-2">
                    <Star size={17} />
                    {publication.average_rating || 0} / 5
                </span>

                <span className="inline-flex items-center gap-1 rounded-2xl bg-slate-50 px-3 py-2">
                    <ShoppingCart size={17} />
                    {publication.purchases_count || 0}{" "}
                    {t("publication.detail.purchases")}
                </span>
            </div>

            <div className="mt-6 rounded-2xl bg-slate-50 p-4">
                <h2 className="mb-2 text-lg font-black text-slate-900">
                    {t("publication.detail.description")}
                </h2>

                <p className="whitespace-pre-wrap text-sm leading-7 text-slate-600 sm:text-base">
                    {publication.description || t("publication.detail.noDescription")}
                </p>
            </div>
        </section>
    );
};