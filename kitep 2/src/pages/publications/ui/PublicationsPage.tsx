import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { useAuth } from "@/entities/user/model/useAuth";
import {
  deletePublication,
  getPublications,
  type Publication,
} from "@/shared/api/publications";

import {
  canUserPublish,
  getCurrentOwnerId,
  type UserLike,
} from "../lib/publicationOwner";
import {
  getPublicationsStats,
  type PublicationsStatusFilter,
} from "../lib/publicationFilters";

import { PublicationsAccessState } from "./components/PublicationsAccessState";
import { PublicationsHeader } from "./components/PublicationsHeader";
import { PublicationsStats } from "./components/PublicationsStats";
import { PublicationsToolbar } from "./components/PublicationsToolbar";
import { BackendPublicationCard } from "./components/BackendPublicationCard";
import { PublicationsEmptyState } from "./components/PublicationsEmptyState";

export const PublicationsPage = () => {
  const { user } = useAuth();
  const { t, i18n } = useTranslation();

  const typedUser = user as UserLike | null;

  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<PublicationsStatusFilter>("all");

  const currentLang = i18n.language === "kg" ? "kg" : "ru";

  const currentOwnerId = useMemo(() => {
    return getCurrentOwnerId(typedUser);
  }, [typedUser?.id, typedUser?.user_id, typedUser?.pk, typedUser?.email]);

  const loadPublications = async () => {
    if (!typedUser) {
      return;
    }

    const userId = getCurrentOwnerId(typedUser);

    if (!userId) {
      console.log("PUBLICATIONS LOAD ERROR: user id not found");
      return;
    }

    try {
      setLoading(true);

      const response = await getPublications({
        author_user: userId,
        search,
        status: statusFilter === "all" ? "" : statusFilter,
      });

      setPublications(response.data);
    } catch (error) {
      console.log("PUBLICATIONS LOAD ERROR:", error);
      alert(t("publications.messages.loadError"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = window.setTimeout(() => {
      loadPublications();
    }, 300);

    return () => window.clearTimeout(timer);
  }, [currentOwnerId, search, statusFilter]);

  const handleDelete = async (id: number) => {
    const ok = confirm(t("publications.messages.deleteConfirm"));

    if (!ok) {
      return;
    }

    try {
      await deletePublication(id);
      setPublications((prev) => prev.filter((item) => item.id !== id));
      alert(t("publications.messages.deleted"));
    } catch (error) {
      console.log("DELETE PUBLICATION ERROR:", error);
      alert(t("publications.messages.deleteError"));
    }
  };

  const stats = useMemo(() => {
    return getPublicationsStats(publications);
  }, [publications]);

  if (!typedUser) {
    return <PublicationsAccessState type="notAuthorized" />;
  }

  if (!canUserPublish(typedUser)) {
    return <PublicationsAccessState type="noAccess" />;
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <PublicationsHeader />

        <PublicationsStats stats={stats} />

        <PublicationsToolbar
          search={search}
          statusFilter={statusFilter}
          onSearchChange={setSearch}
          onStatusChange={setStatusFilter}
        />

        <section className="space-y-4">
          {loading ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-slate-500">
              {t("publications.messages.loading")}
            </div>
          ) : publications.length === 0 ? (
            <PublicationsEmptyState />
          ) : (
            publications.map((publication) => (
              <BackendPublicationCard
                key={publication.id}
                publication={publication}
                language={currentLang}
                onDelete={handleDelete}
              />
            ))
          )}
        </section>
      </div>
    </main>
  );
};

export default PublicationsPage;