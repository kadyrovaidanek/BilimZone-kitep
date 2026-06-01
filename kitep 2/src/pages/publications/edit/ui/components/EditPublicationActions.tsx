import { Save } from "lucide-react";
import { useTranslation } from "react-i18next";

type EditPublicationActionsProps = {
    saving: boolean;
    onCancel: () => void;
    onSubmit: () => void;
};

export const EditPublicationActions = ({
    saving,
    onCancel,
    onSubmit,
}: EditPublicationActionsProps) => {
    const { t } = useTranslation();

    return (
        <div className="flex flex-col gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-end">
            <button
                type="button"
                onClick={onCancel}
                className="rounded-2xl border border-slate-200 px-6 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50 sm:text-base"
            >
                {t("publication_edit.buttons.cancel")}
            </button>

            <button
                type="button"
                onClick={onSubmit}
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-6 py-3 text-sm font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400 sm:text-base"
            >
                <Save size={20} />
                {saving
                    ? t("publication_edit.buttons.saving")
                    : t("publication_edit.buttons.submit")}
            </button>
        </div>
    );
};