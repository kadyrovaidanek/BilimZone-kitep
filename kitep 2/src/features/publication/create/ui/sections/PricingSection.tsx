import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import {
    getActiveAgreement,
    type Agreement,
} from "@/shared/api/agreements";

import type { PublicationAgreementAudience } from "../../lib/getPublicationAudience";
import type {
    CreatePublicationErrors,
    CreatePublicationField,
    CreatePublicationFormState,
    PublicationPriceType,
} from "../../model/types";

import { PublicationAgreementBox } from "./PublicationAgreementBox";

type PricingSectionProps = {
    form: CreatePublicationFormState;
    errors: CreatePublicationErrors;
    agreementAudience: PublicationAgreementAudience | null;
    onChange: <K extends CreatePublicationField>(
        field: K,
        value: CreatePublicationFormState[K],
    ) => void;
};

export const PricingSection = ({
    form,
    errors,
    agreementAudience,
    onChange,
}: PricingSectionProps) => {
    const { t } = useTranslation();

    const [agreement, setAgreement] = useState<Agreement | null>(null);
    const [agreementLoading, setAgreementLoading] = useState(false);

    useEffect(() => {
        const loadAgreement = async () => {
            if (form.price_type !== "paid" || !agreementAudience) {
                setAgreement(null);
                onChange("agreement_id", null);
                onChange("agreement_accepted", false);
                return;
            }

            try {
                setAgreementLoading(true);

                const response = await getActiveAgreement({
                    audience: agreementAudience,
                    context: "paid_material",
                });

                const activeAgreement = response.data.agreement;

                setAgreement(activeAgreement);
                onChange("agreement_id", activeAgreement ? activeAgreement.id : null);
                onChange("agreement_accepted", false);
            } catch (error) {
                console.log("ACTIVE AGREEMENT LOAD ERROR:", error);
                setAgreement(null);
                onChange("agreement_id", null);
                onChange("agreement_accepted", false);
            } finally {
                setAgreementLoading(false);
            }
        };

        loadAgreement();
    }, [form.price_type, agreementAudience]);

    return (
        <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
            <h2 className="mb-5 text-xl font-black text-slate-900">
                {t("publicationCreate.sections.price", "Стоимость")}
            </h2>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <label className="block">
                    <span className="mb-2 block text-sm font-bold text-slate-700">
                        {t("publicationCreate.fields.priceType", "Тип доступа")}
                    </span>

                    <select
                        value={form.price_type}
                        onChange={(event) =>
                            onChange("price_type", event.target.value as PublicationPriceType)
                        }
                        className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                    >
                        <option value="free">
                            {t("publicationCreate.priceTypes.free", "Бесплатно")}
                        </option>
                        <option value="paid">
                            {t("publicationCreate.priceTypes.paid", "Платно")}
                        </option>
                    </select>
                </label>

                <label className="block">
                    <span className="mb-2 block text-sm font-bold text-slate-700">
                        {t("publicationCreate.fields.price", "Цена")}
                    </span>

                    <input
                        type="number"
                        min="0"
                        value={form.price}
                        disabled={form.price_type === "free"}
                        onChange={(event) => onChange("price", event.target.value)}
                        placeholder="0"
                        className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100 disabled:text-slate-400"
                    />

                    {errors.price && (
                        <p className="mt-2 text-sm font-semibold text-red-500">
                            {errors.price}
                        </p>
                    )}
                </label>
            </div>

            {form.price_type === "paid" && (
                <div className="mt-5">
                    <PublicationAgreementBox
                        agreement={agreement}
                        loading={agreementLoading}
                        accepted={form.agreement_accepted}
                        error={errors.agreement_accepted || errors.agreement_id}
                        onAcceptedChange={(value) => onChange("agreement_accepted", value)}
                    />
                </div>
            )}
        </section>
    );
};