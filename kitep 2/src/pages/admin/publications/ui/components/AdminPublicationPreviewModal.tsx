import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import {
    Calendar,
    CheckCircle2,
    Download,
    FileText,
    Layers,
    MessageSquare,
    User,
    XCircle,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { AdminSimilarityMatches } from "./AdminSimilarityMatches";
import type { Publication } from "@/shared/api/publications";
import {
    canPreviewPublicationInBrowser,
    getPublicationFileName,
    getPublicationFormat,
    getPublicationPreviewUrl,
} from "../../lib/adminPublicationHelpers";

type AdminPublicationPreviewModalProps = {
    publication: Publication;
    comment: string;
    moderating: boolean;
    onCommentChange: (value: string) => void;
    onClose: () => void;
    onApprove: () => void;
    onReject: () => void;
};

type PublicationWithOwner = Publication & {
    author_user?: number | string | null;
    author_id?: number | string | null;
    user_id?: number | string | null;
    owner_id?: number | string | null;
};

const getPublicationOwnerId = (publication: PublicationWithOwner) => {
    return (
        publication.author_user ||
        publication.author_id ||
        publication.user_id ||
        publication.owner_id ||
        ""
    );
};

export const AdminPublicationPreviewModal = ({
    publication,
    comment,
    moderating,
    onCommentChange,
    onClose,
    onApprove,
    onReject,
}: AdminPublicationPreviewModalProps) => {
    const { t } = useTranslation();

    const ownerId = getPublicationOwnerId(publication as PublicationWithOwner);
    const ownerName =
        publication.author_username || t("publication.detail.unknownAuthor");

    const downloadFile = () => {
        const url =
            publication.file_url ||
            publication.pdf_file_url ||
            publication.preview_file_url;

        if (!url) {
            alert(t("adminPublications.messages.fileUnavailable"));
            return;
        }

        window.open(url, "_blank", "noopener,noreferrer");
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
            <div className="max-h-[92vh] w-full max-w-7xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
                <div className="grid gap-0 lg:grid-cols-[0.85fr_1.25fr]">
                    <div className="border-b border-slate-200 bg-slate-50 p-5 lg:border-b-0 lg:border-r">
                        <div className="mb-5 flex items-start justify-between gap-4">
                            <div>
                                <h2 className="text-2xl font-extrabold text-slate-900">
                                    {publication.title}
                                </h2>

                                {ownerId ? (
                                    <Link
                                        to={`/users/${ownerId}`}
                                        className="mt-1 inline-flex font-semibold text-blue-600 transition hover:text-blue-700 hover:underline"
                                    >
                                        {ownerName}
                                    </Link>
                                ) : (
                                    <p className="mt-1 text-blue-600">{ownerName}</p>
                                )}
                            </div>

                            <button
                                type="button"
                                onClick={onClose}
                                className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-bold text-slate-600 hover:bg-white"
                            >
                                {t("common.close")}
                            </button>
                        </div>

                        {publication.cover_url ? (
                            <div className="mb-5 overflow-hidden rounded-2xl border border-slate-200 bg-white">
                                <img
                                    src={publication.cover_url}
                                    alt={publication.title}
                                    className="h-56 w-full object-cover"
                                />
                            </div>
                        ) : (
                            <div className="mb-5 flex h-56 items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white text-sm text-slate-400">
                                {t("adminPublications.preview.noCover")}
                            </div>
                        )}

                        <div className="grid gap-3 sm:grid-cols-2">
                            <InfoCard
                                icon={<Layers />}
                                title={t("adminPublications.preview.type")}
                                value={publication.publication_type}
                            />

                            <InfoCard
                                icon={<FileText />}
                                title={t("adminPublications.preview.format")}
                                value={getPublicationFormat(publication)}
                            />

                            <InfoCard
                                icon={<Calendar />}
                                title={t("adminPublications.preview.date")}
                                value={
                                    publication.created_at
                                        ? new Date(publication.created_at).toLocaleDateString()
                                        : "-"
                                }
                            />

                            <InfoCard
                                icon={<User />}
                                title={t("adminPublications.preview.access")}
                                value={
                                    publication.price_type === "paid"
                                        ? t("publications.price.paid")
                                        : t("publications.price.free")
                                }
                            />
                        </div>

                        <div className="mt-5 rounded-2xl bg-white p-4">
                            <p className="text-sm font-semibold text-slate-500">
                                {t("adminPublications.preview.price")}
                            </p>

                            <p className="mt-1 text-3xl font-extrabold text-slate-900">
                                {Number(publication.price).toFixed(2)} сом
                            </p>
                        </div>

                        <div className="mt-5 rounded-2xl bg-white p-4">
                            <p className="mb-2 text-sm font-semibold text-slate-500">
                                {t("adminPublications.preview.description")}
                            </p>

                            <p className="text-slate-700">
                                {publication.description || "—"}
                            </p>
                        </div>

                        <div className="mt-5 rounded-2xl bg-white p-4">
                            <p className="mb-2 text-sm font-semibold text-slate-500">
                                {t("adminPublications.preview.file")}
                            </p>

                            <div className="flex items-center justify-between gap-3">
                                <span className="break-all font-semibold text-slate-800">
                                    {getPublicationFileName(publication)}
                                </span>

                                <button
                                    type="button"
                                    onClick={downloadFile}
                                    className="inline-flex items-center gap-2 rounded-xl bg-blue-50 px-3 py-2 text-sm font-bold text-blue-700 hover:bg-blue-100"
                                >
                                    <Download className="h-4 w-4" />
                                    {t("adminPublications.actions.download")}
                                </button>
                            </div>
                        </div>

                        <div className="mt-5 rounded-2xl bg-blue-50 p-4">
                            <p className="text-sm font-semibold text-blue-700">
                                {t("adminPublications.preview.previewPages")}
                            </p>

                            <p className="mt-1 text-2xl font-extrabold text-blue-900">
                                {publication.preview_start_page}–{publication.preview_end_page}
                            </p>

                            <p className="mt-1 text-xs text-blue-600">
                                {t("adminPublications.preview.previewHint")}
                            </p>
                        </div>
                    </div>

                    <div className="p-5">
                        <div className="mb-4">
                            <h3 className="text-xl font-extrabold text-slate-900">
                                {t("adminPublications.preview.title")}
                            </h3>

                            <p className="mt-1 text-sm text-slate-500">
                                {t("adminPublications.preview.subtitle")}
                            </p>
                        </div>

                        <PublicationPreview publication={publication} />

                        <AdminSimilarityMatches matches={publication.similarity_matches || []} />

                        <div className="mt-5">
                            <label className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-700">
                                <MessageSquare className="h-4 w-4" />
                                {t("adminPublications.preview.comment")}
                            </label>

                            <textarea
                                value={comment}
                                onChange={(event) => onCommentChange(event.target.value)}
                                placeholder={t("adminPublications.preview.commentPlaceholder")}
                                className="min-h-[120px] w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                            />
                        </div>

                        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-end">
                            <button
                                type="button"
                                onClick={onReject}
                                disabled={moderating}
                                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-5 py-3 font-bold text-rose-700 hover:bg-rose-100 disabled:opacity-60"
                            >
                                <XCircle className="h-5 w-5" />
                                {t("adminPublications.actions.reject")}
                            </button>

                            <button
                                type="button"
                                onClick={onApprove}
                                disabled={moderating}
                                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 font-bold text-white hover:bg-emerald-700 disabled:opacity-60"
                            >
                                <CheckCircle2 className="h-5 w-5" />
                                {t("adminPublications.actions.approve")}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

function PublicationPreview({ publication }: { publication: Publication }) {
    const { t } = useTranslation();
    const previewUrl = getPublicationPreviewUrl(publication);
    const format = getPublicationFormat(publication);

    if (previewUrl && canPreviewPublicationInBrowser(publication)) {
        return (
            <div className="overflow-hidden rounded-2xl border border-slate-300 bg-white">
                <iframe
                    src={previewUrl}
                    title={publication.title}
                    className="h-[520px] w-full border-0 sm:h-[620px]"
                />

                <div className="border-t border-slate-200 bg-slate-50 p-3 text-sm text-slate-500">
                    {t("adminPublications.preview.pdfShown", {
                        start: publication.preview_start_page,
                        end: publication.preview_end_page,
                    })}
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-[520px] items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-slate-500">
            <div>
                <FileText className="mx-auto mb-4 h-12 w-12 text-slate-300" />

                <p className="font-bold text-slate-700">
                    {t("adminPublications.preview.unavailable")}
                </p>

                <p className="mt-2 text-sm">
                    {t("adminPublications.preview.unavailableHint", { format })}
                </p>
            </div>
        </div>
    );
}

function InfoCard({
    icon,
    title,
    value,
}: {
    icon: ReactNode;
    title: string;
    value?: string | number | null;
}) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="mb-2 text-slate-400">{icon}</div>
            <p className="text-sm font-semibold text-slate-400">{title}</p>
            <p className="mt-1 font-extrabold text-slate-900">{value || "-"}</p>
        </div>
    );
}