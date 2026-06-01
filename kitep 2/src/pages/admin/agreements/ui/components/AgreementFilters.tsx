import { useTranslation } from "react-i18next";

type AgreementFiltersProps = {
    audienceFilter: string;
    contextFilter: string;
    activeFilter: string;
    onAudienceChange: (value: string) => void;
    onContextChange: (value: string) => void;
    onActiveChange: (value: string) => void;
};

export const AgreementFilters = ({
    audienceFilter,
    contextFilter,
    activeFilter,
    onAudienceChange,
    onContextChange,
    onActiveChange,
}: AgreementFiltersProps) => {
    const { t } = useTranslation();

    return (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <select
                value={audienceFilter}
                onChange={(event) => onAudienceChange(event.target.value)}
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
            >
                <option value="all_filter">{t("agreements.filters.allAudiences")}</option>
                <option value="all">{t("agreements.audience.all")}</option>
                <option value="reader">{t("agreements.audience.reader")}</option>
                <option value="author">{t("agreements.audience.author")}</option>
                <option value="organization">{t("agreements.audience.organization")}</option>
                <option value="author_organization">
                    {t("agreements.audience.author_organization")}
                </option>
            </select>

            <select
                value={contextFilter}
                onChange={(event) => onContextChange(event.target.value)}
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
            >
                <option value="all_filter">{t("agreements.filters.allContexts")}</option>
                <option value="registration">{t("agreements.context.registration")}</option>
                <option value="paid_material">{t("agreements.context.paid_material")}</option>
                <option value="publication">{t("agreements.context.publication")}</option>
                <option value="all">{t("agreements.context.all")}</option>
            </select>

            <select
                value={activeFilter}
                onChange={(event) => onActiveChange(event.target.value)}
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
            >
                <option value="all_filter">{t("agreements.filters.allStatuses")}</option>
                <option value="true">{t("agreements.status.activePlural")}</option>
                <option value="false">{t("agreements.status.inactivePlural")}</option>
            </select>
        </div>
    );
};