import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import {
  checkPublication,
  getPublications,
  type Publication,
} from "@/shared/api/publications";

import type { AdminPublicationFilter } from "./publications/lib/adminPublicationHelpers";
import { AdminPublicationsHeader } from "./publications/ui/components/AdminPublicationsHeader";
import { AdminPublicationsToolbar } from "./publications/ui/components/AdminPublicationsToolbar";
import { AdminPublicationsList } from "./publications/ui/components/AdminPublicationsList";
import { AdminPublicationPreviewModal } from "./publications/ui/components/AdminPublicationPreviewModal";

export type AdminAuthorRoleFilter = "all" | "author" | "organization";

const getPublicationAuthorRole = (publication: Publication) => {
  return (
    publication.author_role ||
    publication.author_role_name ||
    publication.role_name ||
    ""
  );
};

const getDateValue = (date?: string) => {
  if (!date) return "";

  return date.slice(0, 10);
};

const filterByDate = (
  publication: Publication,
  dateFrom: string,
  dateTo: string,
) => {
  const createdDate = getDateValue(publication.created_at);

  if (!createdDate) return true;

  if (dateFrom && createdDate < dateFrom) {
    return false;
  }

  if (dateTo && createdDate > dateTo) {
    return false;
  }

  return true;
};

const filterByAuthorRole = (
  publication: Publication,
  authorRoleFilter: AdminAuthorRoleFilter,
) => {
  if (authorRoleFilter === "all") {
    return true;
  }

  const role = getPublicationAuthorRole(publication);

  if (!role) {
    return true;
  }

  return role === authorRoleFilter;
};

export const AdminMaterialsPage = () => {
  const { t } = useTranslation();

  const [publications, setPublications] = useState<Publication[]>([]);
  const [selectedPublication, setSelectedPublication] =
    useState<Publication | null>(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<AdminPublicationFilter>("all");

  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [authorRoleFilter, setAuthorRoleFilter] =
    useState<AdminAuthorRoleFilter>("all");

  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [moderating, setModerating] = useState(false);

  const loadPublications = async () => {
    try {
      setLoading(true);

      const response = await getPublications({
        search,
        status: statusFilter === "all" ? "" : statusFilter,
      });

      setPublications(response.data);
    } catch (error) {
      console.log("ADMIN PUBLICATIONS LOAD ERROR:", error);
      alert(t("adminPublications.messages.loadError"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = window.setTimeout(() => {
      loadPublications();
    }, 300);

    return () => window.clearTimeout(timer);
  }, [search, statusFilter]);

  const filteredPublications = useMemo(() => {
    return publications.filter((publication) => {
      return (
        filterByDate(publication, dateFrom, dateTo) &&
        filterByAuthorRole(publication, authorRoleFilter)
      );
    });
  }, [publications, dateFrom, dateTo, authorRoleFilter]);

  const stats = useMemo(() => {
    return {
      total: filteredPublications.length,
      pending: filteredPublications.filter((item) => item.status === "pending")
        .length,
      published: filteredPublications.filter(
        (item) => item.status === "published",
      ).length,
      rejected: filteredPublications.filter(
        (item) => item.status === "rejected",
      ).length,
    };
  }, [filteredPublications]);

  const resetExtraFilters = () => {
    setDateFrom("");
    setDateTo("");
    setAuthorRoleFilter("all");
  };

  const openPreview = (publication: Publication) => {
    setSelectedPublication(publication);
    setComment(publication.reject_reason || "");
  };

  const closePreview = () => {
    setSelectedPublication(null);
    setComment("");
  };

  const approvePublication = async () => {
    if (!selectedPublication) return;

    try {
      setModerating(true);

      await checkPublication(selectedPublication.id, {
        status: "published",
      });

      alert(t("adminPublications.messages.approved"));

      closePreview();
      await loadPublications();
    } catch (error) {
      console.log("APPROVE PUBLICATION ERROR:", error);
      alert(t("adminPublications.messages.moderationError"));
    } finally {
      setModerating(false);
    }
  };

  const rejectPublication = async () => {
    if (!selectedPublication) return;

    if (!comment.trim()) {
      alert(t("adminPublications.messages.rejectReasonRequired"));
      return;
    }

    try {
      setModerating(true);

      await checkPublication(selectedPublication.id, {
        status: "rejected",
        reject_reason: comment.trim(),
      });

      alert(t("adminPublications.messages.rejected"));

      closePreview();
      await loadPublications();
    } catch (error) {
      console.log("REJECT PUBLICATION ERROR:", error);
      alert(t("adminPublications.messages.moderationError"));
    } finally {
      setModerating(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 p-4 sm:p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <AdminPublicationsHeader stats={stats} />

        <AdminPublicationsToolbar
          search={search}
          statusFilter={statusFilter}
          dateFrom={dateFrom}
          dateTo={dateTo}
          authorRoleFilter={authorRoleFilter}
          onSearchChange={setSearch}
          onStatusChange={setStatusFilter}
          onDateFromChange={setDateFrom}
          onDateToChange={setDateTo}
          onAuthorRoleChange={setAuthorRoleFilter}
          onResetExtraFilters={resetExtraFilters}
          onRefresh={loadPublications}
        />

        <AdminPublicationsList
          publications={filteredPublications}
          loading={loading}
          onOpenPreview={openPreview}
        />

        {selectedPublication && (
          <AdminPublicationPreviewModal
            publication={selectedPublication}
            comment={comment}
            moderating={moderating}
            onCommentChange={setComment}
            onClose={closePreview}
            onApprove={approvePublication}
            onReject={rejectPublication}
          />
        )}
      </div>
    </main>
  );
};

export default AdminMaterialsPage;