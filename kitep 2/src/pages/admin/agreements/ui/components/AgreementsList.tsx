import { CheckCircle, Edit, Eye, Trash2, XCircle } from "lucide-react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import type { Agreement } from "@/shared/api/agreements";
import {
    getAgreementAudienceLabels,
    getAgreementContextLabels,
} from "../../lib/agreementLabels";
import { AgreementFilters } from "./AgreementFilters";

type AgreementsListProps = {
    agreements: Agreement[];
    loading: boolean;
    audienceFilter: string;
    contextFilter: string;
    activeFilter: string;
    onAudienceChange: (value: string) => void;
    onContextChange: (value: string) => void;
    onActiveChange: (value: string) => void;
    onEdit: (agreement: Agreement) => void;
    onDelete: (id: number) => void;
    onToggleActive: (agreement: Agreement) => void;
};

export const AgreementsList = ({
    agreements,
    loading,
    audienceFilter,
    contextFilter,
    activeFilter,
    onAudienceChange,
    onContextChange,
    onActiveChange,
    onEdit,
    onDelete,
    onToggleActive,
}: AgreementsListProps) => {
    const { t } = useTranslation();

    const audienceLabels = useMemo(() => getAgreementAudienceLabels(t), [t]);
    const contextLabels = useMemo(() => getAgreementContextLabels(t), [t]);

    return (
        <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6 lg:p-7">
            <div className="mb-5 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                <h2 className="text-xl font-black text-slate-900">
                    {t("agreements.list.title")}
                </h2>

                <AgreementFilters
                    audienceFilter={audienceFilter}
                    contextFilter={contextFilter}
                    activeFilter={activeFilter}
                    onAudienceChange={onAudienceChange}
                    onContextChange={onContextChange}
                    onActiveChange={onActiveChange}
                />
            </div>

            {loading ? (
                <div className="rounded-2xl bg-slate-50 p-6 text-center text-slate-500">
                    {t("agreements.messages.loading")}
                </div>
            ) : agreements.length === 0 ? (
                <div className="rounded-2xl bg-slate-50 p-6 text-center text-slate-500">
                    {t("agreements.list.empty")}
                </div>
            ) : (
                <div className="space-y-4">
                    {agreements.map((agreement) => (
                        <div
                            key={agreement.id}
                            className="rounded-2xl border border-slate-200 p-4 transition hover:bg-slate-50 sm:p-5"
                        >
                            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                                <div className="flex-1">
                                    <div className="mb-2 flex flex-wrap items-center gap-2">
                                        <h3 className="text-lg font-black text-slate-900">
                                            {agreement.title}
                                        </h3>

                                        <span
                                            className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold ${agreement.is_active
                                                    ? "bg-green-50 text-green-600"
                                                    : "bg-red-50 text-red-600"
                                                }`}
                                        >
                                            {agreement.is_active ? (
                                                <CheckCircle size={14} />
                                            ) : (
                                                <XCircle size={14} />
                                            )}
                                            {agreement.is_active
                                                ? t("agreements.status.active")
                                                : t("agreements.status.inactive")}
                                        </span>
                                    </div>

                                    <div className="flex flex-wrap gap-2 text-xs font-semibold">
                                        <span className="rounded-full bg-blue-50 px-3 py-1 text-blue-600">
                                            {audienceLabels[agreement.audience]}
                                        </span>

                                        <span className="rounded-full bg-purple-50 px-3 py-1 text-purple-600">
                                            {contextLabels[agreement.context]}
                                        </span>
                                    </div>

                                    {agreement.text && (
                                        <p className="mt-3 line-clamp-2 text-sm text-slate-500">
                                            {agreement.text}
                                        </p>
                                    )}

                                    {agreement.file_url && (
                                        <a
                                            href={agreement.file_url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:underline"
                                        >
                                            <Eye size={16} />
                                            {t("agreements.actions.openFile")}
                                        </a>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:grid-cols-1">
                                    <button
                                        type="button"
                                        onClick={() => onEdit(agreement)}
                                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-white"
                                    >
                                        <Edit size={16} />
                                        {t("agreements.actions.edit")}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => onToggleActive(agreement)}
                                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-white"
                                    >
                                        {agreement.is_active
                                            ? t("agreements.actions.disable")
                                            : t("agreements.actions.enable")}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => onDelete(agreement.id)}
                                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-50 px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-100"
                                    >
                                        <Trash2 size={16} />
                                        {t("agreements.actions.delete")}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
};