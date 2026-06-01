import { BookOpen, Download } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import type { PublicationPurchase } from "@/shared/api/purchases";

type CollectionCardProps = {
    item: PublicationPurchase;
};

export const CollectionCard = ({ item }: CollectionCardProps) => {
    const { t, i18n } = useTranslation();

    const publicationId = item.publication;

    const categoryName =
        i18n.language === "kg"
            ? item.category_name_kg || item.category_name_ru
            : item.category_name_ru || item.category_name_kg;

    return (
        <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <Link to={`/publications/${publicationId}`}>
                <div className="flex h-[200px] items-center justify-center overflow-hidden bg-slate-100 sm:h-[220px]">
                    {item.publication_cover_url ? (
                        <img
                            src={item.publication_cover_url}
                            alt={item.publication_title}
                            className="h-full w-full object-cover transition duration-300 hover:scale-105"
                        />
                    ) : (
                        <div className="flex flex-col items-center gap-2 text-slate-300">
                            <BookOpen size={64} />
                            <span className="text-sm text-slate-400">
                                {t("collection.noCover")}
                            </span>
                        </div>
                    )}
                </div>
            </Link>

            <div className="p-5">
                <div className="mb-3 flex flex-wrap gap-2">
                    <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${item.publication_price_type === "paid"
                            ? "bg-orange-50 text-orange-700"
                            : "bg-green-50 text-green-700"
                            }`}
                    >
                        {item.publication_price_type === "paid"
                            ? `${item.publication_price} ${t("publication.price.currency")}`
                            : t("publication.price.free")}
                    </span>

                    <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-600">
                        {t("collection.inCollection")}
                    </span>

                    {categoryName && (
                        <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                            {categoryName}
                        </span>
                    )}
                </div>

                <Link to={`/publications/${publicationId}`}>
                    <h3 className="line-clamp-2 text-lg font-black text-slate-900 transition hover:text-blue-600">
                        {item.publication_title}
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                        {item.author_username || t("publication.detail.unknownAuthor")}
                    </p>
                </Link>

                {item.publication_description && (
                    <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-500">
                        {item.publication_description}
                    </p>
                )}

                <div className="mt-5 grid grid-cols-1 gap-2">
                    {(item.publication_pdf_file_url || item.publication_file_url) && (
                        <a
                            href={item.publication_pdf_file_url || item.publication_file_url || ""}
                            download
                            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                        >
                            <Download size={16} />
                            {t("collection.download")}
                        </a>
                    )}

                    <Link
                        to={`/publications/${publicationId}`}
                        className="inline-flex items-center justify-center rounded-2xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-blue-700"
                    >
                        {t("collection.openPublication")}
                    </Link>
                </div>
            </div>
        </article>
    );
};