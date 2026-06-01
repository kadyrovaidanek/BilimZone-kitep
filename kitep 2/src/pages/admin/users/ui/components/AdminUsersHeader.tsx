import { Users } from "lucide-react";
import { useTranslation } from "react-i18next";
import { AdminPageHeader } from "../../../shared/ui/AdminPageHeader";

type AdminUsersHeaderProps = {
    total: number;
};

export const AdminUsersHeader = ({ total }: AdminUsersHeaderProps) => {
    const { t } = useTranslation();

    return (
        <AdminPageHeader
            badge={t("adminUsers.badge")}
            icon={<Users size={20} />}
            title={t("adminUsers.title")}
            subtitle={t("adminUsers.subtitle")}
            rightSlot={
                <div className="rounded-2xl bg-slate-900 px-5 py-4 text-white">
                    <p className="text-sm text-slate-300">{t("adminUsers.total")}</p>
                    <p className="text-3xl font-black">{total}</p>
                </div>
            }
        />
    );
};