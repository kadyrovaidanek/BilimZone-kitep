import { CheckCircle2, X } from "lucide-react";
import { useTranslation } from "react-i18next";

type Props = {
    message: string;
    onClose: () => void;
};

export const CreatePublicationSuccessModal = ({
    message,
    onClose,
}: Props) => {
    const { t } = useTranslation();

    if (!message) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/50 px-3 py-4 backdrop-blur-sm sm:items-center sm:px-4">
            <div className="w-full max-w-md rounded-3xl bg-white p-5 text-center shadow-2xl sm:p-6">
                <button
                    type="button"
                    onClick={onClose}
                    className="ml-auto flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200 hover:text-slate-900"
                    aria-label={t("publicationCreate.successModal.close", "Закрыть")}
                >
                    <X className="h-5 w-5" />
                </button>

                <div className="mx-auto mt-2 flex h-16 w-16 items-center justify-center rounded-full bg-green-50 text-green-600 sm:h-20 sm:w-20">
                    <CheckCircle2 className="h-9 w-9 sm:h-11 sm:w-11" />
                </div>

                <h2 className="mt-5 text-xl font-black text-slate-900 sm:text-2xl">
                    {t(
                        "publicationCreate.successModal.title",
                        "Публикация отправлена",
                    )}
                </h2>

                <p className="mt-3 text-sm font-semibold leading-6 text-slate-600 sm:text-base sm:leading-7">
                    {message}
                </p>

                <p className="mt-3 text-xs font-semibold leading-5 text-slate-400 sm:text-sm">
                    {t(
                        "publicationCreate.successModal.description",
                        "Администратор проверит материал и изменит статус публикации после модерации.",
                    )}
                </p>

                <button
                    type="button"
                    onClick={onClose}
                    className="mt-6 w-full rounded-2xl bg-green-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-green-700 active:scale-[0.99]"
                >
                    {t("publicationCreate.successModal.ok", "Понятно")}
                </button>
            </div>
        </div>
    );
};