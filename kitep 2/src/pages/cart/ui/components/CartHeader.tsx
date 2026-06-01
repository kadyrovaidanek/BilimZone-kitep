import { Search, ShoppingCart } from "lucide-react";
import { useTranslation } from "react-i18next";

type CartHeaderProps = {
    search: string;
    onSearchChange: (value: string) => void;
};

export const CartHeader = ({ search, onSearchChange }: CartHeaderProps) => {
    const { t } = useTranslation();

    return (
        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <h1 className="flex items-center gap-3 text-2xl font-black text-slate-900 sm:text-3xl">
                        <ShoppingCart className="text-blue-600" size={30} />
                        {t("cart.title")}
                    </h1>

                    <p className="mt-2 text-sm leading-6 text-slate-500 sm:text-base">
                        {t("cart.subtitle")}
                    </p>
                </div>

                <div className="relative w-full lg:w-[340px]">
                    <Search
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                        value={search}
                        onChange={(event) => onSearchChange(event.target.value)}
                        placeholder={t("cart.searchPlaceholder")}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm font-medium outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                    />
                </div>
            </div>
        </section>
    );
};