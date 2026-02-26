import React from "react";
import { NavLink } from "react-router-dom";
import { LayoutList } from "lucide-react";

export const SettingsPage: React.FC = () => {
  return (
    <div className="space-y-6">

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <NavLink
          to="/settings/categories"
          className="flex items-center gap-4 p-6 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-primary-light/20 flex items-center justify-center rounded-xl text-primary-main bg-blue-50">
            <LayoutList size={24} className="text-blue-500" />
          </div>
          <div>
            <h3 className="font-bold text-gray-800 text-lg">
              Category
            </h3>
            <p className="text-sm text-gray-500">Manage names and colors</p>
          </div>
        </NavLink>
      </div>
    </div>
  );
};
