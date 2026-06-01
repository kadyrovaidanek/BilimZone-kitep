import { Outlet } from "react-router-dom";

import { useAuth } from "@/entities/user/model/useAuth";
import { Sidebar } from "@/widgets/Sidebar/ui/Sidebar";
import { Header } from "@/widgets/Header/ui/Header";
import { Footer } from "@/widgets/Footer/ui/Footer";

export const AppLayout = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex min-h-screen">
        {user && (
          <aside className="hidden shrink-0 border-r border-slate-200 bg-white md:block md:w-[280px]">
            <div className="sticky top-0 h-screen overflow-y-auto">
              <Sidebar />
            </div>
          </aside>
        )}

        <div className="flex min-w-0 flex-1 flex-col">
          <Header />

          <main className="min-w-0 flex-1">
            <div className="w-full px-4 py-4 sm:px-6 lg:px-8">
              <Outlet />
            </div>
          </main>

          <Footer />
        </div>
      </div>
    </div>
  );
};