import { Routes, Route } from "react-router-dom";
import { AppLayout } from "@/app/layouts/AppLayout";

import { RootPage } from "@/pages/public/root/RootPage";
import { AboutPage } from "@/pages/public/about/AboutPage";
import { SupportPage } from "@/pages/public/support/SupportPage";

import { LoginPage } from "@/pages/public/auth/login/ui/LoginPage";
import { RegisterPage } from "@/pages/public/auth/register/ui/RegisterPage";
import { ForgotPasswordPage } from "@/pages/public/auth/forgot-password/ui/ForgotPasswordPage";

import { NotFoundPage } from "@/pages/note-found/ui/NotFoundPage";

import { CatalogPage } from "@/pages/public/catalog/CatalogPage";
import { CollectionPage } from "@/pages/library/ui/CollectionPage";
import { FavoritesPage } from "@/pages/public/favorites/ui/FavoritesPage";
import { ProfilePage } from "@/pages/profile/ui/ProfilePage";
import { PublicationsPage } from "@/pages/publications/ui/PublicationsPage";
import CreatePublicationPage from "@/pages/publications/create/CreatePublicationPage";
import { EditPublicationPage } from "@/pages/publications/edit/EditPublicationPage";
import { NotificationsPage } from "@/pages/notifications/ui/NotificationsPage";
import { CartPage } from "@/pages/cart/ui/CartPage";
import { WalletPage } from "@/pages/wallet/ui/WalletPage";
import PublicationDetailPage from "@/pages/publications/detail/PublicationDetailPage";

import { OwnerReportsPage } from "@/pages/reports/owner/ui/OwnerReportsPage";
import { AdminReportsPage } from "@/pages/reports/admin/ui/AdminReportsPage";
import { MaterialReportPage } from "@/pages/reports/material/ui/MaterialReportPage";

import { AdminRoute } from "@/shared/lib/AdminRoute";
import { AdminDashboard } from "@/pages/admin/AdminDashboard";
import { AdminMaterialsPage } from "@/pages/admin/AdminMaterialsPage";
import { AdminAgreementsPage } from "@/pages/admin/AdminAgreementsPage";
import { AdminNotificationsPage } from "@/pages/admin/AdminNotificationsPage";
import { AdminCategoriesPage } from "@/pages/admin/AdminCategoriesPage";
import { UserProfilePage } from "@/pages/users/UserProfilePage";
import { AdminUsersPage } from "@/pages/admin/users/AdminUsersPage";
import { AdminReviewsPage } from "@/pages/admin/reviews/ui/AdminReviewsPage";

export const Router = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      <Route element={<AppLayout />}>
        <Route path="/" element={<RootPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/support" element={<SupportPage />} />
        <Route path="/catalog" element={<CatalogPage />} />
        <Route path="/publications/:id" element={<PublicationDetailPage />} />
        <Route path="/material/:id" element={<PublicationDetailPage />} />
        <Route path="/users/:id" element={<UserProfilePage />} />

        <Route path="/collection" element={<CollectionPage />} />
        <Route path="/favorites" element={<FavoritesPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/publications" element={<PublicationsPage />} />
        <Route path="/publications/create" element={<CreatePublicationPage />} />
        <Route path="/publications/edit/:id" element={<EditPublicationPage />} />

        <Route path="/reports" element={<OwnerReportsPage />} />
        <Route
          path="/reports/material/:id"
          element={<MaterialReportPage role="owner" />}
        />

        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/wallet" element={<WalletPage />} />

        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/reports"
          element={
            <AdminRoute>
              <AdminReportsPage />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/reports/material/:id"
          element={
            <AdminRoute>
              <MaterialReportPage role="admin" />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/materials"
          element={
            <AdminRoute>
              <AdminMaterialsPage />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/agreements"
          element={
            <AdminRoute>
              <AdminAgreementsPage />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/categories"
          element={
            <AdminRoute>
              <AdminCategoriesPage />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/notifications"
          element={
            <AdminRoute>
              <AdminNotificationsPage />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/reviews"
          element={
            <AdminRoute>
              <AdminReviewsPage />
            </AdminRoute>
          }
        />
      </Route>

      <Route path="/admin/users" element={<AdminUsersPage />} />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};