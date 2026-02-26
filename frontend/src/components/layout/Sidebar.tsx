import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarSearch,
  Archive,
  Settings,
  Menu,
  CreditCard,
} from "lucide-react";
import { useSidebarStore } from "../../store/useSidebarStore";

export const Sidebar: React.FC = () => {
  const { isCollapsed, toggleSidebar } = useSidebarStore();

  const navItems = [
    { label: "Daily Log", icon: <LayoutDashboard size={20} />, path: "/" },
    { label: "Credit Log", icon: <CreditCard size={20} />, path: "/credit" },
    {
      label: "Analytics",
      icon: <CalendarSearch size={20} />,
      path: "/analytics",
    },
    { label: "Vault / Archive", icon: <Archive size={20} />, path: "/archive" },
  ];

  return (
    <aside
      className={`fixed inset-y-0 left-0 bg-secondary-main text-secondary-contrastText shadow-xl flex flex-col z-20 transition-all duration-300 ${
        isCollapsed ? "w-20 px-4 py-6" : "w-64 p-6"
      }`}>
      <div
        className={`mb-8 flex items-center ${isCollapsed ? "justify-center" : "justify-between"}`}>
        <div
          className={`flex items-center gap-3 overflow-hidden transition-all duration-300 ${isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"}`}>
          <div className="w-8 h-8 rounded-lg bg-primary-main flex shrink-0 items-center justify-center text-secondary-main font-bold">
            T
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white whitespace-nowrap overflow-hidden">
            TrackMint
          </h1>
        </div>

        <button
          onClick={toggleSidebar}
          className={`p-2 rounded-lg text-gray-400 hover:bg-secondary-light hover:text-white transition-all shrink-0`}>
          <Menu
            className={`transition-transform duration-500 ${isCollapsed ? "rotate-180" : "rotate-0"}`}
            size={24}
          />
        </button>
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            title={isCollapsed ? item.label : undefined}
            className={({ isActive }) =>
              `flex items-center rounded-xl transition-all ${
                isCollapsed ? "justify-center p-3" : "gap-3 px-4 py-3"
              } ${
                isActive
                  ? "bg-primary-main text-secondary-main shadow-lg shadow-primary-main/20 font-medium"
                  : "text-gray-400 hover:bg-secondary-light hover:text-white"
              }`
            }>
            <div className="shrink-0">{item.icon}</div>
            {!isCollapsed && (
              <span className="whitespace-nowrap">{item.label}</span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto pt-4 border-t border-secondary-light/30">
        <NavLink
          to="/settings"
          title={isCollapsed ? "Settings" : undefined}
          className={({ isActive }) =>
            `flex items-center rounded-xl transition-all ${
              isCollapsed ? "justify-center p-3" : "gap-3 px-4 py-3"
            } ${
              isActive
                ? "bg-primary-main text-secondary-main shadow-lg shadow-primary-main/20 font-medium"
                : "text-gray-400 hover:bg-secondary-light hover:text-white"
            }`
          }>
          <div className="shrink-0">
            <Settings size={20} />
          </div>
          {!isCollapsed && <span className="whitespace-nowrap">Settings</span>}
        </NavLink>
      </div>
    </aside>
  );
};
