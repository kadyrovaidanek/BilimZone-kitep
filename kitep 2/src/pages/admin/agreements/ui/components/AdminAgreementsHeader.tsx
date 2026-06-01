import { FileText } from "lucide-react";
import { useTranslation } from "react-i18next";
import { AdminPageHeader } from "../../../shared/ui/AdminPageHeader";

type AdminAgreementsHeaderProps = {
    count: number;
};

export const AdminAgreementsHeader = ({ count }: AdminAgreementsHeaderProps) => {
    const { t } = useTranslation();

    return (
        <AdminPageHeader
            title={t("agreements.page.title")}
            subtitle={t("agreements.page.description")}
            rightSlot={
                <div className="inline-flex w-fit items-center gap-2 rounded-2xl bg-orange-50 px-4 py-3 font-bold text-orange-600">
                    <FileText size={20} />
                    {count} {t("agreements.page.count")}
                </div>
            }
        />
    );
};