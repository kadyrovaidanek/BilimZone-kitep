import { AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

type PublicationsAccessStateProps = {
    type: "notAuthorized" | "noAccess";
};

export const PublicationsAccessState = ({
    type,
}: PublicationsAccessStateProps) => {
    const { t } = useTranslation();

    const isNoAccess = type === "noAccess";

    return (
        <div className="min-h-screen bg-slate-50 px-4 py-10">
            <div className="mx-auto max-w-4xl rounded-3xl border border-slate-200 bg-white p-8 text-center">
                <AlertCircle
                    className={`mx-auto mb-4 h-12 w-12 ${isNoAccess ? "text-red-500" : "text-orange-500"
                        }`}
                />

                <h1 className="text-2xl font-black text-slate-900">
                    {isNoAccess
                        ? t("publications.noAccess")
                        : t("publications.notAuthorized")}
                </h1>

                {isNoAccess && (
                    <p className="mt-2 text-slate-500">
                        {t("publications.noAccessText")}
                    </p>
                )}
            </div>
        </div>
    );
};