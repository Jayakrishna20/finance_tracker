import React from "react";
import { Sidebar } from "./Sidebar";
import { Outlet, useLocation } from "react-router-dom";
import { GlobalFAB } from "../../features/global-modal/GlobalFAB";
import { TransactionModal } from "../../features/global-modal/TransactionModal";

export const AppLayout: React.FC = () => {
  const location = useLocation();
  const getPageTitle = (pathname: string) => {
    switch (pathname) {
      case "/":
        return "Daily Log";
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
      <main className="ml-64 flex-1 p-8 relative h-screen flex flex-col overflow-hidden">
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
      </main>
    </div>
  );
};
