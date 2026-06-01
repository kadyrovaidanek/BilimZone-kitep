import { FileText } from "lucide-react";
import { useTranslation } from "react-i18next";

type PublicationFileViewerProps = {
    title: string;
    isBought: boolean;
    isPaid: boolean;
    isOwner: boolean;
    readableFileUrl?: string | null;
};

export const PublicationFileViewer = ({
    title,
    isBought,
    isPaid,
    isOwner,
    readableFileUrl,
}: PublicationFileViewerProps) => {
    const { t } = useTranslation();

    const canSeeFullFile = isBought || !isPaid || isOwner;

    return (
        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <h2 className="mb-3 flex items-center gap-2 text-xl font-black text-slate-900">
                <FileText className="text-blue-600" />
                {canSeeFullFile
                    ? t("publication.detail.fullFile")
                    : t("publication.detail.preview")}
            </h2>

            {readableFileUrl ? (
                <iframe
                    src={readableFileUrl}
                    title={title}
                    className="h-[420px] w-full rounded-2xl border border-slate-200 sm:h-[620px]"
                />
            ) : (
                <div className="flex min-h-[280px] items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-500 sm:min-h-[360px] sm:text-base">
                    {t("publication.detail.fileUnavailable")}
                </div>
            )}

            {!isBought && isPaid && !isOwner && (
                <p className="mt-3 text-sm leading-6 text-slate-500">
                    {t("publication.detail.previewOnlyHint")}
                </p>
            )}
        </section>
    );
};