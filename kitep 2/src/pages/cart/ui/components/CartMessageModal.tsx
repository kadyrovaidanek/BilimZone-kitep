import { AlertCircle, CheckCircle2, Wallet, X } from "lucide-react";
import { useTranslation } from "react-i18next";

type CartMessageModalProps = {
    open: boolean;
    title: string;
    text: string;
    type?: "success" | "error" | "wallet";
    actionText?: string;
    onAction?: () => void;
    onClose: () => void;
};

export const CartMessageModal = ({
    open,
    title,
    text,
    type = "success",
    actionText,
    onAction,
    onClose,
}: CartMessageModalProps) => {
    const { t } = useTranslation();

    if (!open) return null;

    const iconClass =
        type === "success"
            ? "bg-green-50 text-green-600"
            : type === "wallet"
                ? "bg-orange-50 text-orange-600"
                : "bg-red-50 text-red-600";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 py-6 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-3xl bg-white p-5 shadow-2xl sm:p-6">
                <div className="mb-5 flex items-start justify-between gap-4">
                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${iconClass}`}>
                        {type === "success" && <CheckCircle2 size={24} />}
                        {type === "wallet" && <Wallet size={24} />}
                        {type === "error" && <AlertCircle size={24} />}
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
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
                        className="rounded-2xl bg-slate-100 px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-200"
                    >
                        {t("cart.modal.close")}
                    </button>

                    {actionText && onAction && (
                        <button
                            type="button"
                            onClick={onAction}
                            className="rounded-2xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
                        >
                            {actionText}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};