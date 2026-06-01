import {
    BookOpen,
    CheckCircle,
    CreditCard,
    Download,
    Heart,
    ShoppingCart,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import type { Publication } from "@/shared/api/publications";

type PublicationCoverPanelProps = {
    publication: Publication;
    isOwner: boolean;
    isBought: boolean;
    isPaid: boolean;
    buying: boolean;
    cartAdded: boolean;
    favorite: boolean;
    readableFileUrl?: string | null;

    onBuy: () => void;
    onAddToCart: () => void;
    onToggleFavorite: () => void;
};

export const PublicationCoverPanel = ({
    publication,
    isOwner,
    isBought,
    isPaid,
    buying,
    cartAdded,
    favorite,
    readableFileUrl,
    onBuy,
    onAddToCart,
    onToggleFavorite,
}: PublicationCoverPanelProps) => {
    const { t } = useTranslation();

    return (
        <aside className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <div className="flex h-[260px] items-center justify-center overflow-hidden rounded-3xl bg-slate-100 sm:h-[360px] lg:h-[420px]">
                {publication.cover_url ? (
                    <img
                        src={publication.cover_url}
                        alt={publication.title}
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <div className="flex flex-col items-center gap-3 text-slate-300">
                        <BookOpen size={82} />
                        <span className="text-sm font-semibold text-slate-400">
                            {t("publication.detail.noCover")}
                        </span>
                    </div>
                )}
            </div>

            <div className="mt-5 grid gap-3">
                {isBought && (
                    <div className="flex items-center justify-center gap-2 rounded-2xl bg-green-50 px-4 py-3 text-sm font-bold text-green-700 sm:text-base">
                        <CheckCircle size={18} />
                        {t("publication.detail.alreadyBought")}
                    </div>
                )}

                {!isOwner && !isBought && isPaid && (
                    <>
                        <button
                            type="button"
                            onClick={onBuy}
                            disabled={buying}
                            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300 sm:text-base"
                        >
                            <CreditCard size={20} />
                            {buying
                                ? t("publication.detail.buying")
                                : t("publication.detail.buyNow")}
                        </button>

                        <button
                            type="button"
                            onClick={onAddToCart}
                            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50 sm:text-base"
                        >
                            <ShoppingCart size={20} />
                            {cartAdded
                                ? t("publication.detail.inCart")
                                : t("publication.detail.addToCart")}
                        </button>
                    </>
                )}

                {!isBought && !isPaid && (
                    <button
                        type="button"
                        onClick={onBuy}
                        disabled={buying}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-green-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-slate-300 sm:text-base"
                    >
                        <BookOpen size={20} />
                        {buying
                            ? t("publication.detail.adding")
                            : t("publication.detail.addFreeToCollection")}
                    </button>
                )}

                <button
                    type="button"
                    onClick={onToggleFavorite}
                    className={`inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-bold transition sm:text-base ${favorite
                        ? "bg-rose-50 text-rose-600 hover:bg-rose-100"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        }`}
                >
                    <Heart size={20} fill={favorite ? "currentColor" : "none"} />
                    {favorite
                        ? t("publication.detail.inFavorites")
                        : t("publication.detail.addToFavorites")}
                </button>

                {readableFileUrl && (isBought || !isPaid || isOwner) && (
                    <a
                        href={readableFileUrl}
                        download
                        className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50 sm:text-base"
                    >
                        <Download size={20} />
                        {t("publication.detail.download")}
                    </a>
                )}
            </div>
        </aside>
    );
};