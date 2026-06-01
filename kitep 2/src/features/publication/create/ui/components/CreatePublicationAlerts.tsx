import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";

type CreatePublicationAlertsProps = {
    isCategoriesLoading: boolean;
    submitError: string;
    submitSuccess: string;
};

export const CreatePublicationAlerts = ({
    isCategoriesLoading,
    submitError,
    submitSuccess,
}: CreatePublicationAlertsProps) => {
    const { t } = useTranslation();

    return (
        <div className="mb-5 grid gap-3">
            {isCategoriesLoading && (
                <div className="flex items-center gap-3 rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-700">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    {t(
                        "publicationCreate.messages.categoriesLoading",
                        "Категории загружаются...",
                    )}
                </div>
            )}

            {submitError && (
                <div className="flex items-start gap-3 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                    <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
                    <span>{submitError}</span>
                </div>
            )}

            {submitSuccess && (
                <div className="flex items-start gap-3 rounded-2xl border border-green-100 bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
                    <span>{submitSuccess}</span>
                </div>
            )}
        </div>
    );
};