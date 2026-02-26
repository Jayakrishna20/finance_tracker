import React from "react";
import { Sidebar } from "./Sidebar";
import { Outlet, useLocation } from "react-router-dom";
import { GlobalFAB } from "../../features/global-modal/GlobalFAB";
import { TransactionModal } from "../../features/global-modal/TransactionModal";
import { GlobalConfirmModal } from "../../features/global-modal/GlobalConfirmModal";
import { useSidebarStore } from "../../store/useSidebarStore";

export const AppLayout: React.FC = () => {
  const location = useLocation();
  const { isCollapsed } = useSidebarStore();
  const getPageTitle = (pathname: string) => {
    if (pathname.startsWith("/settings")) {
      return "Settings";
    }

    switch (pathname) {
      case "/":
        return "Daily Log";
      case "/credit":
        return "Credit Log";
      case "/analytics":
        return "Analytics";
      case "/archive":
        return "Vault / Archive";
      default:
        return "Dashboard";
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden flex bg-background-default font-sans">
      <Sidebar />
      <main
        className={`${isCollapsed ? "ml-20" : "ml-64"} transition-all duration-300 flex-1 p-8 relative h-screen flex flex-col overflow-hidden`}>
        <div className="w-full h-full flex flex-col overflow-hidden">
          {/* Topbar/Header info could go here */}
          <header className="mb-8 flex justify-between items-center shrink-0">
            <h2 className="text-2xl font-bold text-secondary-main">
              {getPageTitle(location.pathname)}
            </h2>
          </header>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex-1 overflow-hidden flex flex-col">
            <Outlet />
          </div>
        </div>

        <GlobalFAB />
        <TransactionModal />
        <GlobalConfirmModal />
      </main>
    </div>
  );
};
