import { ArrowLeft, UploadCloud } from "lucide-react";
import { useTranslation } from "react-i18next";

type EditPublicationHeaderProps = {
    onBack: () => void;
};

export const EditPublicationHeader = ({
    onBack,
}: EditPublicationHeaderProps) => {
    const { t } = useTranslation();

    return (
        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <button
                type="button"
                onClick={onBack}
                className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-slate-500 transition hover:text-slate-900"
            >
                <ArrowLeft size={18} />
                {t("publication_edit.buttons.back")}
            </button>

            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 sm:text-3xl">
                        {t("publication_edit.title")}
                    </h1>

                    <p className="mt-2 text-sm text-slate-500 sm:text-base">
                        {t("publication_edit.subtitle")}
                    </p>
                </div>

                <div className="inline-flex w-fit items-center gap-2 rounded-2xl bg-blue-50 px-4 py-3 text-sm font-bold text-blue-600 sm:text-base">
                    <UploadCloud size={20} />
                    {t("publication_edit.badge")}
                </div>
            </div>
        </section>
    );
};