import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffect, useMemo, useState } from "react";
import type { ElementType } from "react";

import { useAuth } from "@/entities/user/model/useAuth";
import { useUnreadNotificationsCount } from "@/shared/lib/hooks/useUnreadNotificationsCount";
import { getBackendWalletBalance } from "@/shared/api/wallet";
import logo from "@/assets/images/logo.svg";

import {
  Home,
  BookOpen,
  ShoppingCart,
  Wallet,
  Bell,
  User,
  LayoutDashboard,
  FileText,
  FolderTree,
  ClipboardCheck,
  BarChart3,
  LibraryBig,
  Building2,
  PenTool,
  MessageSquare,
} from "lucide-react";

type MenuItem = {
  to: string;
  label: string;
  icon: ElementType;
};

type UserLike = {
  id?: number | string;
  user_id?: number | string;
  pk?: number | string;
  email?: string;
  role?: string;
};

const WALLET_BALANCE_KEY_PREFIX = "bilimzone_wallet_balance";
const WALLET_EVENT_NAME = "bilimzone-wallet-balance-updated";

const getUserId = (user: UserLike | null | undefined) => {
  if (!user) return "";

  return String(user.id || user.user_id || user.pk || user.email || "");
};

const getWalletBalanceKey = (userId: string) => {
  return `${WALLET_BALANCE_KEY_PREFIX}_${userId}`;
};

const saveWalletBalanceToLocalStorage = (userId: string, balance: number) => {
  if (!userId) return;

  localStorage.setItem(getWalletBalanceKey(userId), String(balance));
};

export const Sidebar = () => {
  const { user } = useAuth();
  const { t, i18n } = useTranslation();
  const { count: unreadNotificationsCount } = useUnreadNotificationsCount();

  const userId = useMemo(() => {
    return getUserId(user as UserLike | null);
  }, [user]);

  const [walletBalance, setWalletBalance] = useState(0);

  const loadBackendWalletBalance = async () => {
    if (!userId) {
      setWalletBalance(0);
      return;
    }

    try {
      const response = await getBackendWalletBalance(userId);
      const backendBalance = Number(response.data.balance || 0);

      setWalletBalance(backendBalance);
      saveWalletBalanceToLocalStorage(userId, backendBalance);
    } catch (error) {
      console.log("SIDEBAR WALLET BALANCE LOAD ERROR:", error);
      setWalletBalance(0);
    }
  };

  useEffect(() => {
    loadBackendWalletBalance();

    const updateBalance = (event?: Event) => {
      if (event instanceof CustomEvent) {
        const eventUserId = event.detail?.userId;

        if (eventUserId && String(eventUserId) !== userId) {
          return;
        }
      }

      loadBackendWalletBalance();
    };

    window.addEventListener(WALLET_EVENT_NAME, updateBalance);
    window.addEventListener("storage", updateBalance);
    window.addEventListener("focus", updateBalance);

    const intervalId = window.setInterval(loadBackendWalletBalance, 15000);

    return () => {
      window.removeEventListener(WALLET_EVENT_NAME, updateBalance);
      window.removeEventListener("storage", updateBalance);
      window.removeEventListener("focus", updateBalance);
      window.clearInterval(intervalId);
    };
  }, [userId]);

  const formattedWalletBalance = useMemo(() => {
    const locale =
      i18n.language.startsWith("kg") || i18n.language.startsWith("ky")
        ? "ky-KG"
        : "ru-RU";

    const currency = t("sidebar.currency", {
      defaultValue: "сом",
    });

    return `${new Intl.NumberFormat(locale).format(walletBalance)} ${currency}`;
  }, [walletBalance, i18n.language, t]);

  if (!user) return null;

  const role = user.role;
  const isAuthor = role === "author";
  const isOrganization = role === "organization";
  const isAdmin = role === "manager_admin";

  const readerMenu: MenuItem[] = [
    { to: "/", label: t("sidebar.reader.home"), icon: Home },
    { to: "/catalog", label: t("sidebar.reader.catalog"), icon: BookOpen },
    {
      to: "/collection",
      label: t("sidebar.reader.collection"),
      icon: LibraryBig,
    },
    { to: "/cart", label: t("sidebar.reader.cart"), icon: ShoppingCart },
    { to: "/wallet", label: t("sidebar.reader.wallet"), icon: Wallet },
    {
      to: "/notifications",
      label: t("sidebar.reader.notifications"),
      icon: Bell,
    },
    { to: "/profile", label: t("sidebar.reader.profile"), icon: User },
  ];

  const authorMenu: MenuItem[] = [
    { to: "/", label: t("sidebar.author.home"), icon: Home },
    { to: "/catalog", label: t("sidebar.author.catalog"), icon: BookOpen },
    {
      to: "/collection",
      label: t("sidebar.author.collection", {
        defaultValue: "Моя коллекция",
      }),
      icon: LibraryBig,
    },
    {
      to: "/publications",
      label: t("sidebar.author.publications"),
      icon: FileText,
    },
    { to: "/wallet", label: t("sidebar.author.wallet"), icon: Wallet },
    { to: "/reports", label: t("sidebar.author.reports"), icon: BarChart3 },
    {
      to: "/notifications",
      label: t("sidebar.author.notifications"),
      icon: Bell,
    },
    { to: "/profile", label: t("sidebar.author.profile"), icon: User },
  ];

  const organizationMenu: MenuItem[] = [
    { to: "/", label: t("sidebar.organization.home"), icon: Home },
    {
      to: "/catalog",
      label: t("sidebar.organization.catalog"),
      icon: BookOpen,
    },
    {
      to: "/collection",
      label: t("sidebar.organization.collection", {
        defaultValue: "Моя коллекция",
      }),
      icon: LibraryBig,
    },
    {
      to: "/publications",
      label: t("sidebar.organization.publications"),
      icon: FileText,
    },
    { to: "/wallet", label: t("sidebar.organization.wallet"), icon: Wallet },
    {
      to: "/reports",
      label: t("sidebar.organization.reports"),
      icon: BarChart3,
    },
    {
      to: "/notifications",
      label: t("sidebar.organization.notifications"),
      icon: Bell,
    },
    {
      to: "/profile",
      label: t("sidebar.organization.profile"),
      icon: Building2,
    },
  ];

  const adminMenu: MenuItem[] = [
    {
      to: "/admin/agreements",
      label: t("sidebar.admin.agreements"),
      icon: FileText,
    },
    {
      to: "/admin/categories",
      label: t("sidebar.admin.categories"),
      icon: FolderTree,
    },
    {
      to: "/admin/materials",
      label: t("sidebar.admin.materials"),
      icon: ClipboardCheck,
    },
    { to: "/wallet", label: t("sidebar.admin.wallet"), icon: Wallet },
    { to: "/reports", label: t("sidebar.admin.reports"), icon: BarChart3 },
    {
      to: "/admin/reviews",
      label: t("sidebar.admin.reviews"),
      icon: MessageSquare,
    },
    {
      to: "/admin/notifications",
      label: t("sidebar.admin.notifications"),
      icon: Bell,
    },
    { to: "/profile", label: t("sidebar.admin.profile"), icon: User },
  ];

  const getMenu = () => {
    if (isAdmin) return adminMenu;
    if (isOrganization) return organizationMenu;
    if (isAuthor) return authorMenu;
    return readerMenu;
  };

  const getRoleLabel = () => {
    if (isAdmin) return t("sidebar.admin.role");
    if (isOrganization) return t("sidebar.organization.role");
    if (isAuthor) return t("sidebar.author.role");
    return t("sidebar.reader.role");
  };

  const getRoleIcon = () => {
    if (isAdmin) {
      return <LayoutDashboard className="h-5 w-5 text-blue-700" />;
    }

    if (isOrganization) {
      return <Building2 className="h-5 w-5 text-blue-700" />;
    }

    if (isAuthor) {
      return <PenTool className="h-5 w-5 text-blue-700" />;
    }

    return <Wallet className="h-5 w-5 text-blue-700" />;
  };

  const menu = getMenu();

  return (
    <aside className="w-full border-r border-slate-200 bg-white md:min-h-screen md:w-[280px]">
      <div className="p-4 sm:p-5 md:p-6">
        <div className="mb-6 flex items-center gap-3">
          <img
            src={logo}
            alt="Bilimzone"
            className="h-11 w-11 object-contain sm:h-12 sm:w-12"
          />

          <div className="min-w-0">
            <h2 className="text-lg font-extrabold tracking-tight sm:text-xl">
              <span className="text-blue-900">BILIM</span>
              <span className="text-orange-500">ZONE</span>
            </h2>

            <p className="truncate text-xs text-slate-400">{getRoleLabel()}</p>
          </div>
        </div>

        <div className="mb-6">
          <NavLink
            to="/wallet"
            className="block rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:border-blue-200 hover:bg-blue-50"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-100">
                {getRoleIcon()}
              </div>

              <div className="min-w-0">
                <p className="text-sm text-slate-500">
                  {t("sidebar.balance")}
                </p>

                <p className="truncate text-base font-bold text-slate-800">
                  {formattedWalletBalance}
                </p>
              </div>
            </div>
          </NavLink>
        </div>

        <nav className="space-y-2">
          {menu.map((item) => {
            const Icon = item.icon;
            const isNotificationItem =
              item.to === "/notifications" || item.to === "/admin/notifications";

            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/" || item.to === "/admin"}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all sm:text-base ${isActive
                    ? "bg-orange-50 text-orange-600"
                    : "text-slate-800 hover:bg-slate-50"
                  }`
                }
              >
                <span className="relative inline-flex shrink-0">
                  <Icon className="h-5 w-5" />

                  {isNotificationItem && unreadNotificationsCount > 0 && (
                    <span
                      className="
                        absolute -right-3 -top-3
                        flex h-5 min-w-5 items-center justify-center
                        rounded-full bg-red-500 px-1
                        text-[11px] font-black leading-none text-white
                        ring-2 ring-white
                      "
                    >
                      {unreadNotificationsCount > 99
                        ? "99+"
                        : unreadNotificationsCount}
                    </span>
                  )}
                </span>

                <span className="truncate">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;