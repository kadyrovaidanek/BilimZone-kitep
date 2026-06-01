import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
    BookOpen,
    Building2,
    Calendar,
    CheckCircle,
    Mail,
    Phone,
    Shield,
    User,
    XCircle,
} from "lucide-react";

import type { PublicUser } from "@/shared/api/users";
import {
    formatAdminDate,
    getRoleLabel,
    getUserDisplayName,
} from "../../lib/adminUsersHelpers";

type AdminUsersListProps = {
    users: PublicUser[];
    loading: boolean;
};

export const AdminUsersList = ({ users, loading }: AdminUsersListProps) => {
    const { t } = useTranslation();

    if (loading) {
        return (
            <section className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-slate-500 shadow-sm">
                {t("common.loading")}
            </section>
        );
    }

    if (users.length === 0) {
        return (
            <section className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-slate-400 shadow-sm">
                <User className="mx-auto mb-3 h-12 w-12 text-slate-300" />
                {t("adminUsers.empty")}
            </section>
        );
    }

    return (
        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="hidden grid-cols-[1.6fr_1.4fr_1fr_1fr_1fr_1fr] gap-4 border-b bg-slate-50 px-5 py-4 text-xs font-black uppercase text-slate-500 xl:grid">
                <div>{t("adminUsers.table.user")}</div>
                <div>{t("adminUsers.table.contacts")}</div>
                <div>{t("adminUsers.table.role")}</div>
                <div>{t("adminUsers.table.status")}</div>
                <div>{t("adminUsers.table.materials")}</div>
                <div>{t("adminUsers.table.date")}</div>
            </div>

            <div className="divide-y divide-slate-100">
                {users.map((item) => {
                    const displayName = getUserDisplayName(item);
                    const isOrganization = item.role_name === "organization";
                    const materialsCount =
                        item.all_materials_count ?? item.materials_count ?? 0;

                    return (
                        <Link
                            key={item.id}
                            to={`/admin/users/${item.id}`}
                            className="block transition hover:bg-slate-50"
                        >
                            <div className="hidden grid-cols-[1.6fr_1.4fr_1fr_1fr_1fr_1fr] items-center gap-4 px-5 py-4 xl:grid">
                                <div className="flex min-w-0 items-center gap-3">
                                    <Avatar
                                        photoUrl={item.photo_url}
                                        displayName={displayName}
                                        isOrganization={isOrganization}
                                    />

                                    <div className="min-w-0">
                                        <p className="truncate font-black text-slate-900">
                                            {displayName}
                                        </p>
                                        <p className="truncate text-sm text-slate-500">
                                            @{item.username}
                                        </p>
                                    </div>
                                </div>

                                <div className="min-w-0 space-y-1">
                                    {item.email ? (
                                        <p className="flex items-center gap-2 truncate text-sm text-slate-500">
                                            <Mail size={14} className="shrink-0" />
                                            {item.email}
                                        </p>
                                    ) : (
                                        <p className="text-sm text-slate-400">Email: -</p>
                                    )}

                                    {item.phone && (
                                        <p className="flex items-center gap-2 truncate text-sm text-slate-500">
                                            <Phone size={14} className="shrink-0" />
                                            {item.phone}
                                        </p>
                                    )}
                                </div>

                                <span className="inline-flex w-fit items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                                    <Shield size={13} />
                                    {getRoleLabel(item.role_name, t)}
                                </span>

                                <StatusBadge isActive={Boolean(item.is_active)} />
                                <span className="inline-flex w-fit items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-600">
                                    <BookOpen size={13} />
                                    {materialsCount}
                                </span>

                                <span className="inline-flex items-center gap-1 text-sm text-slate-500">
                                    <Calendar size={14} />
                                    {formatAdminDate(item.created_at)}
                                </span>
                            </div>

                            <div className="p-4 xl:hidden">
                                <div className="flex items-start gap-3">
                                    <Avatar
                                        photoUrl={item.photo_url}
                                        displayName={displayName}
                                        isOrganization={isOrganization}
                                        mobile
                                    />

                                    <div className="min-w-0 flex-1">
                                        <p className="truncate font-black text-slate-900">
                                            {displayName}
                                        </p>

                                        <p className="truncate text-sm text-slate-500">
                                            @{item.username}
                                        </p>

                                        {item.email && (
                                            <p className="mt-2 flex items-center gap-2 truncate text-sm text-slate-500">
                                                <Mail size={14} className="shrink-0" />
                                                {item.email}
                                            </p>
                                        )}

                                        {item.phone && (
                                            <p className="mt-1 flex items-center gap-2 truncate text-sm text-slate-500">
                                                <Phone size={14} className="shrink-0" />
                                                {item.phone}
                                            </p>
                                        )}

                                        <div className="mt-3 flex flex-wrap gap-2">
                                            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                                                {getRoleLabel(item.role_name, t)}
                                            </span>

                                            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-600">
                                                {t("adminUsers.materialsShort", {
                                                    count: materialsCount,
                                                })}
                                            </span>

                                            {typeof item.is_active === "boolean" && (
                                                <span
                                                    className={`rounded-full px-3 py-1 text-xs font-bold ${item.is_active
                                                        ? "bg-green-50 text-green-600"
                                                        : "bg-red-50 text-red-600"
                                                        }`}
                                                >
                                                    {item.is_active
                                                        ? t("adminUsers.active")
                                                        : t("adminUsers.inactive")}
                                                </span>
                                            )}

                                            <span className="rounded-full bg-slate-50 px-3 py-1 text-xs font-bold text-slate-500">
                                                {formatAdminDate(item.created_at)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </section>
    );
};

function Avatar({
    photoUrl,
    displayName,
    isOrganization,
    mobile = false,
}: {
    photoUrl?: string | null;
    displayName: string;
    isOrganization: boolean;
    mobile?: boolean;
}) {
    const sizeClass = mobile ? "h-14 w-14" : "h-12 w-12";

    return (
        <div
            className={`${sizeClass} flex shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-blue-50 text-blue-600`}
        >
            {photoUrl ? (
                <img
                    src={photoUrl}
                    alt={displayName}
                    className="h-full w-full object-cover"
                />
            ) : isOrganization ? (
                <Building2 size={mobile ? 26 : 22} />
            ) : (
                <User size={mobile ? 26 : 22} />
            )}
        </div>
    );
}

function StatusBadge({ isActive }: { isActive?: boolean }) {
    const { t } = useTranslation();

    if (typeof isActive !== "boolean") {
        return <span className="text-sm text-slate-400">-</span>;
    }

    return isActive ? (
        <span className="inline-flex w-fit items-center gap-1 rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-600">
            <CheckCircle size={13} />
            {t("adminUsers.active")}
        </span>
    ) : (
        <span className="inline-flex w-fit items-center gap-1 rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-600">
            <XCircle size={13} />
            {t("adminUsers.inactive")}
        </span>
    );
}