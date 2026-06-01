import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";

type EditFormFieldProps = {
    label: string;
    error?: string;
    className?: string;
    children: ReactNode;
};

export const EditFormField = ({
    label,
    error,
    className = "",
    children,
}: EditFormFieldProps) => {
    const { t } = useTranslation();

    return (
        <label className={`block ${className}`}>
            <span className="mb-2 block text-sm font-semibold text-slate-700">
                {label}
            </span>

            {children}

            {error && (
                <p className="mt-2 text-sm text-red-500">
                    {error.includes(".") ? t(error) : error}
                </p>
            )}
        </label>
    );
};