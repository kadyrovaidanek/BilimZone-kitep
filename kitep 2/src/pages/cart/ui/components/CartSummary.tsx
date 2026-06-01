import { CreditCard, XCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

type CartSummaryProps = {
    total: number;
    buyingAll: boolean;
    onClear: () => void;
    onBuyAll: () => void;
};

export const CartSummary = ({
    total,
    buyingAll,
    onClear,
    onBuyAll,
}: CartSummaryProps) => {
    const { t } = useTranslation();

    return (
        <section className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
                <p className="text-sm text-slate-500">{t("cart.totalLabel")}</p>

                <p className="text-2xl font-black text-slate-900">
                    {total} {t("publication.price.currency")}
                </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
                <button
                    type="button"
                    onClick={onClear}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-red-50 px-5 py-3 text-sm font-bold text-red-600 transition hover:bg-red-100 sm:text-base"
                >
                    <XCircle size={18} />
                    {t("cart.actions.clear")}
                </button>

                <button
                    type="button"
                    onClick={onBuyAll}
                    disabled={buyingAll}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300 sm:text-base"
                >
                    <CreditCard size={18} />
                    {buyingAll ? t("cart.actions.buying") : t("cart.actions.buyAll")}
                </button>
            </div>
        </section>
    );
};