import React, { useState } from "react";
import { WeeklyAnalyticsView } from "./WeeklyAnalyticsView";
import { MonthlyAnalyticsView } from "./MonthlyAnalyticsView";
import { YearlyAnalyticsView } from "./YearlyAnalyticsView";

export const AnalyticsContainer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"weekly" | "monthly" | "yearly">(
    "weekly",
  );

  return (
    <div className="flex flex-col h-full">
      <div className="flex bg-secondary-light/5 p-1 rounded-xl mb-6 shrink-0 max-w-md">
        <button
          onClick={() => setActiveTab("weekly")}
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-all ${
            activeTab === "weekly"
              ? "bg-white text-secondary-main shadow-sm"
              : "text-gray-500 hover:text-secondary-main hover:bg-white/50"
          }`}>
          Weekly
        </button>
        <button
          onClick={() => setActiveTab("monthly")}
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-all ${
            activeTab === "monthly"
              ? "bg-white text-secondary-main shadow-sm"
              : "text-gray-500 hover:text-secondary-main hover:bg-white/50"
          }`}>
          Monthly
        </button>
        <button
          onClick={() => setActiveTab("yearly")}
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-all ${
            activeTab === "yearly"
              ? "bg-white text-secondary-main shadow-sm"
              : "text-gray-500 hover:text-secondary-main hover:bg-white/50"
          }`}>
          Yearly
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 pb-6 min-h-0">
        {activeTab === "weekly" && <WeeklyAnalyticsView />}
        {activeTab === "monthly" && <MonthlyAnalyticsView />}
        {activeTab === "yearly" && <YearlyAnalyticsView />}
      </div>
    </div>
  );
};
