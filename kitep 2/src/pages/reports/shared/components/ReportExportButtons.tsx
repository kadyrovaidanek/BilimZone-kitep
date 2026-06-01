import type { ReactNode } from "react";
import { Download, FileSpreadsheet, FileText } from "lucide-react";
import { useTranslation } from "react-i18next";

import type { ExportFormat } from "../../model/types";

type Props = {
    isExporting: boolean;
    onExport: (format: ExportFormat) => void;
};

type ExportButtonItem = {
    format: ExportFormat;
    label: string;
    icon: ReactNode;
};

export const ReportExportButtons = ({ isExporting, onExport }: Props) => {
    const { t } = useTranslation();

    const buttons: ExportButtonItem[] = [
        {
            format: "pdf",
            label: t("reports.export.pdf"),
            icon: <FileText size={18} />,
        },
        {
            format: "excel",
            label: t("reports.export.excel"),
            icon: <FileSpreadsheet size={18} />,
        },
        {
            format: "docx",
            label: t("reports.export.docx"),
            icon: <Download size={18} />,
        },
    ];

    return (
        <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <div className="mb-4">
                <h2 className="text-base font-black text-slate-900 sm:text-lg">
                    {t("reports.export.title")}
                </h2>
                <p className="mt-1 text-sm font-medium text-slate-500">
                    {t("reports.export.subtitle")}
                </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
                {buttons.map((button) => (
                    <button
                        key={button.format}
                        type="button"
                        disabled={isExporting}
                        onClick={() => onExport(button.format)}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-black text-white transition hover:bg-slate-800 disabled:bg-slate-300"
                    >
                        {button.icon}
                        {isExporting ? t("reports.export.loading") : button.label}
                    </button>
                ))}
            </div>
        </section>
    );
};