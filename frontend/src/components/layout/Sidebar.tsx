import React from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, CalendarSearch, Archive } from "lucide-react";

export const Sidebar: React.FC = () => {
  const navItems = [
    { label: "Daily Log", icon: <LayoutDashboard size={20} />, path: "/" },
    {
      label: "Analytics",
      icon: <CalendarSearch size={20} />,
      path: "/analytics",
    },
    { label: "Vault / Archive", icon: <Archive size={20} />, path: "/archive" },
  ];

  return (
    <aside className="fixed inset-y-0 left-0 w-64 bg-secondary-main text-secondary-contrastText shadow-xl flex flex-col p-6 z-20 transition-all">
      <div className="mb-10 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-primary-main flex items-center justify-center text-secondary-main font-bold">
          F
        </div>
        <h1 className="text-xl font-bold tracking-tight text-white">
          Finance SaaS
        </h1>
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive
                  ? "bg-primary-main text-secondary-main shadow-lg shadow-primary-main/20 font-medium"
                  : "text-gray-400 hover:bg-secondary-light hover:text-white"
              }`
            }>
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};
