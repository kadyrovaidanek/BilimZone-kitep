import { CreditCard, FileText, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import type { CartItem } from "../../lib/cartStorage";

type CartItemCardProps = {
    item: CartItem;
    buyingId: number | null;
    onBuy: (item: CartItem) => void;
    onRemove: (id: number | string) => void;
};

export const CartItemCard = ({
    item,
    buyingId,
    onBuy,
    onRemove,
}: CartItemCardProps) => {
    const { t } = useTranslation();

    return (
        <article className="flex flex-col gap-5 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5 lg:flex-row lg:items-center">
            <Link
                to={`/publications/${item.id}`}
                className="flex h-[170px] w-full shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-slate-100 lg:h-[120px] lg:w-[160px]"
            >
                {item.image ? (
                    <img
                        src={item.image}
                        alt={item.title}
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <FileText size={46} className="text-slate-300" />
                )}
            </Link>

            <div className="min-w-0 flex-1">
                <Link to={`/publications/${item.id}`}>
                    <h3 className="line-clamp-2 text-lg font-black text-slate-900 transition hover:text-blue-600">
                        {item.title}
                    </h3>
                </Link>

                <p className="mt-1 text-sm text-slate-500">{item.author}</p>

                {item.description && (
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
                        {item.description}
                    </p>
                )}

                <div className="mt-3 flex flex-wrap gap-2">
                    <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${item.priceType === "paid"
                                ? "bg-orange-50 text-orange-700"
                                : "bg-green-50 text-green-700"
                            }`}
                    >
                        {item.priceType === "paid"
                            ? `${item.price} ${t("publication.price.currency")}`
                            : t("publication.price.free")}
                    </span>
                </div>
            </div>

            <div className="grid gap-2 sm:grid-cols-2 lg:w-[180px] lg:grid-cols-1">
                <button
                    type="button"
                    onClick={() => onBuy(item)}
                    disabled={buyingId === item.id}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                    <CreditCard size={16} />
                    {buyingId === item.id
                        ? t("cart.actions.buying")
                        : t("cart.actions.buy")}
                </button>

                <button
                    type="button"
                    onClick={() => onRemove(item.id)}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-600 transition hover:bg-red-100"
                >
                    <Trash2 size={16} />
                    {t("cart.actions.remove")}
                </button>
            </div>
        </article>
    );
};