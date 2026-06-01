import { useTranslation } from "react-i18next";

import type {
    EditPublicationFormState,
} from "../../lib/editPublicationTypes";
import type { PublicationPriceType } from "@/shared/api/publications";
import { EditFormField } from "./EditFormField";

type EditPricingSectionProps = {
    form: EditPublicationFormState;
    errors: Partial<Record<keyof EditPublicationFormState, string>>;
    onChange: <K extends keyof EditPublicationFormState>(
        field: K,
        value: EditPublicationFormState[K],
    ) => void;
};

export const EditPricingSection = ({
    form,
    errors,
    onChange,
}: EditPricingSectionProps) => {
    const { t } = useTranslation();

    const isPaid = form.price_type === "paid";

    return (
        <section className="border-t border-slate-100 pt-6">
            <h2 className="mb-4 text-xl font-black text-slate-900">
                {t("publication_edit.sections.price")}
            </h2>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-slate-700">
                        {t("publication_edit.fields.priceType")}
                    </span>

                    <select
                        value={form.price_type}
                        onChange={(event) => {
                            const value = event.target.value as PublicationPriceType;

                            onChange("price_type", value);

                            if (value === "free") {
                                onChange("price", "0");
                                onChange("agreement_accepted", false);
                            }
                        }}
                        className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                    >
                        <option value="free">
                            {t("publication.price.free")}
                        </option>
                        <option value="paid">
                            {t("publication.price.paid")}
                        </option>
                    </select>
                </label>

                {isPaid && (
                    <EditFormField
                        label={t("publication_edit.fields.price")}
                        error={errors.price}
                    >
                        <input
                            value={form.price}
                            onChange={(event) => {
                                const value = event.target.value;

                                if (/^\d*$/.test(value)) {
                                    onChange("price", value);
                                }
                            }}
                            type="text"
                            inputMode="numeric"
                            placeholder="500"
                            className={`w-full rounded-2xl border px-4 py-3 outline-none transition focus:ring-2 ${errors.price
                                ? "border-red-300 focus:ring-red-100"
                                : "border-slate-200 focus:border-blue-400 focus:ring-blue-100"
                                }`}
                        />
                    </EditFormField>
                )}
            </div>
        </section>
    );
};