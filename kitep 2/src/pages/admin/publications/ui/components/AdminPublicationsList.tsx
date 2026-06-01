import { Link } from "react-router-dom";
import { CalendarDays, Eye } from "lucide-react";
import { useTranslation } from "react-i18next";

import type { Publication } from "@/shared/api/publications";
import {
    getPublicationFormat,
    getStatusClass,
} from "../../lib/adminPublicationHelpers";

type AdminPublicationsListProps = {
    publications: Publication[];
    loading: boolean;
    onOpenPreview: (publication: Publication) => void;
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

const formatDate = (value?: string) => {
    if (!value) return "-";

    return new Date(value).toLocaleDateString("ru-RU", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
};

export const AdminPublicationsList = ({
    publications,
    loading,
    onOpenPreview,
}: AdminPublicationsListProps) => {
    const { t } = useTranslation();

    return (
        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="hidden border-b border-slate-200 bg-slate-50 px-5 py-4 text-sm font-bold text-slate-500 lg:grid lg:grid-cols-[1.35fr_0.9fr_0.8fr_0.75fr_0.75fr_130px]">
                <div>{t("adminPublications.table.publication")}</div>
                <div>{t("adminPublications.table.author")}</div>
                <div>{t("adminPublications.table.date", "Дата")}</div>
                <div>{t("adminPublications.table.format")}</div>
                <div>{t("adminPublications.table.status")}</div>
                <div className="text-right">{t("adminPublications.table.action")}</div>
            </div>

            <div className="divide-y divide-slate-100">
                {loading ? (
                    <div className="p-8 text-center text-slate-500">
                        {t("adminPublications.messages.loading")}
                    </div>
                ) : publications.length === 0 ? (
                    <div className="p-8 text-center text-slate-500">
                        {t("adminPublications.messages.empty")}
                    </div>
                ) : (
                    publications.map((publication) => {
                        const ownerId = getPublicationOwnerId(
                            publication as PublicationWithOwner,
                        );

                        const ownerName =
                            publication.author_username ||
                            t("publication.detail.unknownAuthor");

                        return (
                            <div
                                key={publication.id}
                                className="grid gap-4 px-5 py-4 lg:grid-cols-[1.35fr_0.9fr_0.8fr_0.75fr_0.75fr_130px] lg:items-center"
                            >
                                <div>
                                    <p className="font-bold text-slate-900">
                                        {publication.title}
                                    </p>

                                    {publication.description && (
                                        <p className="mt-1 line-clamp-2 text-sm text-slate-500">
                                            {publication.description}
                                        </p>
                                    )}

                                    <p className="mt-1 text-xs text-slate-400">
                                        {publication.category_name_ru || "Без категории"} ·{" "}
                                        {publication.direction_name_ru || "Без направления"}
                                    </p>
                                </div>

                                <div className="text-sm text-slate-700">
                                    <p className="mb-1 text-xs font-bold uppercase tracking-wide text-slate-400 lg:hidden">
                                        {t("adminPublications.table.author")}
                                    </p>

                                    {ownerId ? (
                                        <Link
                                            to={`/users/${ownerId}`}
                                            className="font-semibold text-blue-600 transition hover:text-blue-700 hover:underline"
                                        >
                                            {ownerName}
                                        </Link>
                                    ) : (
                                        <span>{ownerName}</span>
                                    )}
                                </div>

                                <div className="text-sm text-slate-700">
                                    <p className="mb-1 text-xs font-bold uppercase tracking-wide text-slate-400 lg:hidden">
                                        {t("adminPublications.table.date", "Дата")}
                                    </p>

                                    <span className="inline-flex items-center gap-2 rounded-2xl bg-slate-50 px-3 py-2 font-semibold text-slate-700">
                                        <CalendarDays className="h-4 w-4 text-slate-400" />
                                        {formatDate(publication.created_at)}
                                    </span>
                                </div>

                                <div className="text-sm font-semibold text-slate-700">
                                    <p className="mb-1 text-xs font-bold uppercase tracking-wide text-slate-400 lg:hidden">
                                        {t("adminPublications.table.format")}
                                    </p>

                                    {getPublicationFormat(publication)}
                                </div>

                                <div>
                                    <p className="mb-1 text-xs font-bold uppercase tracking-wide text-slate-400 lg:hidden">
                                        {t("adminPublications.table.status")}
                                    </p>

                                    <span
                                        className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${getStatusClass(
                                            publication.status,
                                        )}`}
                                    >
                                        {t(`adminPublications.status.${publication.status}`)}
                                    </span>
                                </div>

                                <div className="lg:text-right">
                                    <button
                                        type="button"
                                        onClick={() => onOpenPreview(publication)}
                                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700"
                                    >
                                        <Eye className="h-4 w-4" />
                                        {t("adminPublications.actions.view")}
                                    </button>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </section>
    );
};