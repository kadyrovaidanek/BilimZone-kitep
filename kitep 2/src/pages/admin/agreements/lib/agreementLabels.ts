import type { TFunction } from "i18next";

export const getAgreementAudienceLabels = (t: TFunction) => ({
    all: t("agreements.audience.all"),
    reader: t("agreements.audience.reader"),
    author: t("agreements.audience.author"),
    organization: t("agreements.audience.organization"),
    author_organization: t("agreements.audience.author_organization"),
});

export const getAgreementContextLabels = (t: TFunction) => ({
    registration: t("agreements.context.registration"),
    paid_material: t("agreements.context.paid_material"),
    publication: t("agreements.context.publication"),
    all: t("agreements.context.all"),
});