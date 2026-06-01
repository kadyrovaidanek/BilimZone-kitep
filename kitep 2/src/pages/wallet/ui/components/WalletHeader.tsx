import { Wallet } from "lucide-react";
import { useTranslation } from "react-i18next";

export const WalletHeader = () => {
    const { t } = useTranslation();

    return (
        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                    <Wallet size={26} />
                </div>

                <div>
                    <h1 className="text-2xl font-black text-slate-900 sm:text-3xl">
                        {t("wallet.title")}
                    </h1>

                    <p className="mt-2 text-sm leading-6 text-slate-500 sm:text-base">
                        {t("wallet.subtitle")}
                    </p>
                </div>
            </div>
        </section>
    );
};