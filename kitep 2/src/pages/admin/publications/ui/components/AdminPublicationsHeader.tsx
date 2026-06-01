import { useTranslation } from "react-i18next";
import { AdminStatCard } from "../../../shared/ui/AdminStatCard";

type AdminPublicationsHeaderProps = {
    stats: {
        total: number;
        pending: number;
        published: number;
        rejected: number;
    };
};

export const AdminPublicationsHeader = ({
    stats,
}: AdminPublicationsHeaderProps) => {
    const { t } = useTranslation();

    return (
        <>
            <section>
                <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">
                    {t("adminPublications.title")}
                </h1>

                <p className="mt-2 text-sm text-slate-500">
                    {t("adminPublications.subtitle")}
                </p>
            </section>

            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <AdminStatCard label={t("adminPublications.stats.total")} value={stats.total} />
                <AdminStatCard
                    label={t("adminPublications.stats.pending")}
                    value={stats.pending}
                    colorClass="text-amber-600"
                />
                <AdminStatCard
                    label={t("adminPublications.stats.published")}
                    value={stats.published}
                    colorClass="text-emerald-600"
                />
                <AdminStatCard
                    label={t("adminPublications.stats.rejected")}
                    value={stats.rejected}
                    colorClass="text-rose-600"
                />
            </section>
        </>
    );
};