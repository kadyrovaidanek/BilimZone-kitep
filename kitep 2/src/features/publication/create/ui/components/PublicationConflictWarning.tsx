import { AlertTriangle, ExternalLink } from "lucide-react";
import { useTranslation } from "react-i18next";

export type PublicationConflictWarningData = {
    code: string;
    message: string;
    publication_id?: number;
    publication_title?: string;
    redirect_url?: string;
    detail?: string;
    similarity_percent?: number;
};

type Props = {
    warning: PublicationConflictWarningData;
    isSubmitting: boolean;
    onView: () => void;
    onContinue: () => void;
    onCancel: () => void;
};

export const PublicationConflictWarning = ({
    warning,
    isSubmitting,
    onView,
    onContinue,
    onCancel,
}: Props) => {
    const { t } = useTranslation();

    const percent =
        warning.similarity_percent ??
        (warning.code === "duplicate_file" || warning.code === "duplicate_text"
            ? 100
            : null);

    return (
        <div className="mb-5 rounded-3xl border border-orange-200 bg-orange-50 p-4 text-orange-900 sm:p-5">
            <div className="flex items-start gap-3">
                <AlertTriangle className="mt-1 h-6 w-6 shrink-0" />

                <div className="min-w-0 flex-1">
                    <h3 className="text-lg font-black">
                        {t("publicationCreate.conflict.title")}
                    </h3>

                    <p className="mt-2 text-sm font-semibold leading-6">
                        {t("publicationCreate.conflict.description")}
                    </p>

                    {percent !== null && (
                        <p className="mt-1 text-sm font-bold">
                            {t("publicationCreate.conflict.percent", {
                                percent,
                            })}
                        </p>
                    )}

                    {warning.publication_title && (
                        <p className="mt-2 text-sm">
                            {t("publicationCreate.conflict.foundMaterial")}:{" "}
                            <span className="font-bold">
                                {warning.publication_title}
                            </span>
                        </p>
                    )}

                    {warning.detail && (
                        <p className="mt-2 text-sm leading-6 text-orange-800">
                            {warning.detail}
                        </p>
                    )}

                    <p className="mt-3 text-sm font-semibold">
                        {t("publicationCreate.conflict.question")}
                    </p>

                    <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                        <button
                            type="button"
                            onClick={onView}
                            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-orange-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-orange-700"
                        >
                            <ExternalLink className="h-4 w-4" />
                            {t("publicationCreate.conflict.view")}
                        </button>

                        <button
                            type="button"
                            onClick={onContinue}
                            disabled={isSubmitting}
                            className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800 disabled:bg-slate-300"
                        >
                            {isSubmitting
                                ? t("publicationCreate.submit.saving")
                                : t("publicationCreate.conflict.continue")}
                        </button>

                        <button
                            type="button"
                            onClick={onCancel}
                            className="rounded-2xl border border-orange-200 bg-white px-5 py-3 text-sm font-bold text-orange-700 transition hover:bg-orange-100"
                        >
                            {t("common.cancel")}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};