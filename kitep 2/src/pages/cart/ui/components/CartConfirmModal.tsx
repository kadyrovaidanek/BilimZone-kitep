import { AlertTriangle, CreditCard, X } from "lucide-react";
import { useTranslation } from "react-i18next";

type CartConfirmModalProps = {
    open: boolean;
    title: string;
    text: string;
    confirmText?: string;
    cancelText?: string;
    loading?: boolean;
    variant?: "primary" | "danger";
    onConfirm: () => void;
    onClose: () => void;
};

export const CartConfirmModal = ({
    open,
    title,
    text,
    confirmText,
    cancelText,
    loading = false,
    variant = "primary",
    onConfirm,
    onClose,
}: CartConfirmModalProps) => {
    const { t } = useTranslation();

    if (!open) return null;

    const isDanger = variant === "danger";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 py-6 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-3xl bg-white p-5 shadow-2xl sm:p-6">
                <div className="mb-5 flex items-start justify-between gap-4">
                    <div
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${isDanger ? "bg-red-50 text-red-600" : "bg-blue-50 text-blue-600"
                            }`}
                    >
                        {isDanger ? <AlertTriangle size={24} /> : <CreditCard size={24} />}
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 disabled:cursor-not-allowed"
                    >
                        <X size={20} />
                    </button>
                </div>

                <h3 className="text-xl font-black text-slate-900 sm:text-2xl">
                    {title}
                </h3>

                <p className="mt-3 whitespace-pre-line text-sm leading-6 text-slate-500 sm:text-base">
                    {text}
                </p>

                <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="rounded-2xl bg-slate-100 px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                        {cancelText || t("cart.modal.cancel")}
                    </button>

                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={loading}
                        className={`rounded-2xl px-5 py-3 text-sm font-bold text-white transition disabled:cursor-not-allowed disabled:bg-slate-300 ${isDanger ? "bg-red-600 hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700"
                            }`}
                    >
                        {loading ? t("cart.actions.buying") : confirmText || t("cart.modal.confirm")}
                    </button>
                </div>
            </div>
        </div>
    );
};