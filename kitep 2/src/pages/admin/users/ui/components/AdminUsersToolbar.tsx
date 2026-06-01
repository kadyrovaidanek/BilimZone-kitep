import { Search } from "lucide-react";
import { useTranslation } from "react-i18next";

type AdminUsersToolbarProps = {
    search: string;
    role: string;
    onSearchChange: (value: string) => void;
    onRoleChange: (value: string) => void;
    onApply: () => void;
};

export const AdminUsersToolbar = ({
    search,
    role,
    onSearchChange,
    onRoleChange,
    onApply,
}: AdminUsersToolbarProps) => {
    const { t } = useTranslation();

    return (
        <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_220px_auto]">
                <div className="relative">
                    <Search
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                        value={search}
                        onChange={(event) => onSearchChange(event.target.value)}
                        placeholder={t("adminUsers.search")}
                        className="w-full rounded-2xl border border-slate-200 py-3 pl-11 pr-4 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                    />
                </div>

                <select
                    value={role}
                    onChange={(event) => onRoleChange(event.target.value)}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                >
                    <option value="">{t("adminUsers.allRoles")}</option>
                    <option value="reader">{t("roles.reader")}</option>
                    <option value="author">{t("roles.author")}</option>
                    <option value="organization">{t("roles.organization")}</option>
                    <option value="manager_admin">{t("roles.manager_admin")}</option>
                </select>

                <button
                    type="button"
                    onClick={onApply}
                    className="rounded-2xl bg-slate-900 px-6 py-3 font-bold text-white transition hover:bg-slate-800"
                >
                    {t("adminUsers.apply")}
                </button>
            </div>
        </section>
    );
};