import { FolderTree } from "lucide-react";
import { useTranslation } from "react-i18next";

type AdminCategoriesHeaderProps = {
    count: number;
};

export const AdminCategoriesHeader = ({ count }: AdminCategoriesHeaderProps) => {
    const { t } = useTranslation();

    return (
        <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6 lg:p-7">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 sm:text-3xl">
                        {t("adminCatalog.page.title")}
                    </h1>

                    <p className="mt-2 text-sm text-slate-500 sm:text-base">
                        {t("adminCatalog.page.description")}
                    </p>
                </div>

                <div className="inline-flex w-fit items-center gap-2 rounded-2xl bg-orange-50 px-4 py-3 font-bold text-orange-600">
                    <FolderTree size={20} />
                    {count} {t("adminCatalog.page.count")}
                </div>
            </div>
        </section>
    );
};