import {
  Bell,
  BarChart3,
  FileCheck,
  FileText,
  FolderTree,
  Users,
  MessageSquare,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import { AdminDashboardCard } from "./dashboard/ui/components/AdminDashboardCard";

export const AdminDashboard = () => {
  const { t } = useTranslation();

  const cards = [
    {
      to: "/admin/materials",
      title: t("adminDashboard.cards.publications.title"),
      description: t("adminDashboard.cards.publications.description"),
      icon: <FileCheck size={24} />,
    },
    {
      to: "/admin/categories",
      title: t("adminDashboard.cards.categories.title"),
      description: t("adminDashboard.cards.categories.description"),
      icon: <FolderTree size={24} />,
    },
    {
      to: "/admin/users",
      title: t("adminDashboard.cards.users.title"),
      description: t("adminDashboard.cards.users.description"),
      icon: <Users size={24} />,
    },
    {
      to: "/admin/agreements",
      title: t("adminDashboard.cards.agreements.title"),
      description: t("adminDashboard.cards.agreements.description"),
      icon: <FileText size={24} />,
    },
    {
      to: "/admin/notifications",
      title: t("adminDashboard.cards.notifications.title"),
      description: t("adminDashboard.cards.notifications.description"),
      icon: <Bell size={24} />,
    },
    {
      to: "/reports",
      title: t("adminDashboard.cards.reports.title"),
      description: t("adminDashboard.cards.reports.description"),
      icon: <BarChart3 size={24} />,
    },
    {
      to: "/admin/reviews",
      title: t("adminDashboard.cards.reviews.title"),
      description: t("adminDashboard.cards.reviews.description"),
      icon: <MessageSquare size={24} />,
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="rounded-3xl bg-slate-900 p-6 text-white shadow-sm sm:p-8">
          <h1 className="text-2xl font-black sm:text-4xl">
            {t("adminDashboard.title")}
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
            {t("adminDashboard.subtitle")}
          </p>
        </section>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {cards.map((card) => (
            <AdminDashboardCard key={card.to} {...card} />
          ))}
        </section>
      </div>
    </main>
  );
};

export default AdminDashboard;