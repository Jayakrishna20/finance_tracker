import React, { useState } from "react";
import { WeeklyAnalyticsView } from "./WeeklyAnalyticsView";
import { MonthlyAnalyticsView } from "./MonthlyAnalyticsView";
import { YearlyAnalyticsView } from "./YearlyAnalyticsView";
import { DataSource } from "../../../types";

export const AnalyticsContainer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"weekly" | "monthly" | "yearly">(
    "weekly",
  );
  const [dataSource, setDataSource] = useState<DataSource>(
    DataSource.Transactions,
  );

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between shrink-0 mb-4">
        <div className="flex bg-gray-100/80 p-1 rounded-xl w-fit">
          <button
            onClick={() => setDataSource(DataSource.Transactions)}
            className={`py-1.5 px-5 rounded-lg text-sm font-semibold transition-all ${
              dataSource === DataSource.Transactions
                ? "bg-secondary-main text-white shadow-sm"
                : "text-gray-500 hover:text-gray-900 hover:bg-gray-200/50"
            }`}
          >
            Transactions
          </button>
          <button
            onClick={() => setDataSource(DataSource.Credits)}
            className={`py-1.5 px-5 rounded-lg text-sm font-semibold transition-all ${
              dataSource === DataSource.Credits
                ? "bg-secondary-main text-white shadow-sm"
                : "text-gray-500 hover:text-gray-900 hover:bg-gray-200/50"
            }`}
          >
            Credits
          </button>
        </div>

        <div className="flex bg-secondary-light/5 p-1 rounded-xl max-w-md">
          <button
            onClick={() => setActiveTab("weekly")}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-all ${
              activeTab === "weekly"
                ? "bg-white text-secondary-main shadow-sm"
                : "text-gray-500 hover:text-secondary-main hover:bg-white/50"
            }`}
          >
            Weekly
          </button>
          <button
            onClick={() => setActiveTab("monthly")}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-all ${
              activeTab === "monthly"
                ? "bg-white text-secondary-main shadow-sm"
                : "text-gray-500 hover:text-secondary-main hover:bg-white/50"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setActiveTab("yearly")}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-all ${
              activeTab === "yearly"
                ? "bg-white text-secondary-main shadow-sm"
                : "text-gray-500 hover:text-secondary-main hover:bg-white/50"
            }`}
          >
            Yearly
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 pb-6 min-h-0">
        {activeTab === "weekly" && (
          <WeeklyAnalyticsView dataSource={dataSource} />
        )}
        {activeTab === "monthly" && (
          <MonthlyAnalyticsView dataSource={dataSource} />
        )}
        {activeTab === "yearly" && (
          <YearlyAnalyticsView dataSource={dataSource} />
        )}
      </div>
    </div>
  );
};
