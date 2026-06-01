import { Plus, RotateCcw } from "lucide-react";
import { useTranslation } from "react-i18next";

import type { AgreementFormState } from "../../lib/agreementForm";

type AgreementFormProps = {
    form: AgreementFormState;
    editingId: number | null;
    onChange: (form: AgreementFormState) => void;
    onSubmit: () => void;
    onReset: () => void;
};

export const AgreementForm = ({
    form,
    editingId,
    onChange,
    onSubmit,
    onReset,
}: AgreementFormProps) => {
    const { t } = useTranslation();

    const setField = <K extends keyof AgreementFormState>(
        field: K,
        value: AgreementFormState[K],
    ) => {
        onChange({
            ...form,
            [field]: value,
        });
    };

    return (
        <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6 lg:p-7">
            <h2 className="mb-5 text-xl font-black text-slate-900">
                {editingId
                    ? t("agreements.form.editTitle")
                    : t("agreements.form.addTitle")}
            </h2>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-slate-700">
                        {t("agreements.form.title")}
                    </span>

                    <input
                        value={form.title}
                        onChange={(event) => setField("title", event.target.value)}
                        placeholder={t("agreements.form.titlePlaceholder")}
                        className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                    />
                </label>

                <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-slate-700">
                        {t("agreements.form.audience")}
                    </span>

                    <select
                        value={form.audience}
                        onChange={(event) =>
                            setField("audience", event.target.value as AgreementFormState["audience"])
                        }
                        className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                    >
                        <option value="all">{t("agreements.audience.all")}</option>
                        <option value="reader">{t("agreements.audience.reader")}</option>
                        <option value="author">{t("agreements.audience.author")}</option>
                        <option value="organization">
                            {t("agreements.audience.organization")}
                        </option>
                        <option value="author_organization">
                            {t("agreements.audience.author_organization")}
                        </option>
                    </select>
                </label>

                <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-slate-700">
                        {t("agreements.form.context")}
                    </span>

                    <select
                        value={form.context}
                        onChange={(event) =>
                            setField("context", event.target.value as AgreementFormState["context"])
                        }
                        className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                    >
                        <option value="registration">
                            {t("agreements.context.registration")}
                        </option>
                        <option value="paid_material">
                            {t("agreements.context.paid_material")}
                        </option>
                        <option value="publication">
                            {t("agreements.context.publication")}
                        </option>
                        <option value="all">{t("agreements.context.all")}</option>
                    </select>
                </label>

                <label className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3">
                    <input
                        type="checkbox"
                        checked={form.is_active}
                        onChange={(event) => setField("is_active", event.target.checked)}
                    />

                    <span className="font-semibold text-slate-700">
                        {t("agreements.form.active")}
                    </span>
                </label>

                <label className="block lg:col-span-2">
                    <span className="mb-2 block text-sm font-semibold text-slate-700">
                        {t("agreements.form.text")}
                    </span>

                    <textarea
                        value={form.text}
                        onChange={(event) => setField("text", event.target.value)}
                        placeholder={t("agreements.form.textPlaceholder")}
                        className="min-h-[180px] w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                    />
                </label>

                <label className="block lg:col-span-2">
                    <span className="mb-2 block text-sm font-semibold text-slate-700">
                        {t("agreements.form.file")}
                    </span>

                    <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={(event) =>
                            setField("file", event.target.files?.[0] || null)
                        }
                        className="w-full text-sm text-slate-500 file:mr-4 file:rounded-xl file:border-0 file:bg-blue-50 file:px-4 file:py-3 file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
                    />

                    <p className="mt-2 text-xs text-slate-400">
                        {form.file ? form.file.name : t("agreements.form.fileHint")}
                    </p>
                </label>
            </div>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <button
                    type="button"
                    onClick={onSubmit}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-6 py-3 font-bold text-white transition hover:bg-slate-800"
                >
                    <Plus size={20} />
                    {editingId ? t("agreements.actions.save") : t("agreements.actions.add")}
                </button>

                {editingId && (
                    <button
                        type="button"
                        onClick={onReset}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 px-6 py-3 font-bold text-slate-600 transition hover:bg-slate-50"
                    >
                        <RotateCcw size={18} />
                        {t("agreements.actions.cancel")}
                    </button>
                )}
            </div>
        </section>
    );
};