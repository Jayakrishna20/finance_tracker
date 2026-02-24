import React from "react";
import { PeriodAnalytics } from "./PeriodAnalytics";
import { getISOWeek } from "date-fns";

export const WeeklyAnalyticsView: React.FC = () => {
  const currentWeek = getISOWeek(new Date()).toString();
  // Generate some dummy available weeks for the dropdown
  const availableWeeks = [
    currentWeek,
    (parseInt(currentWeek) - 1).toString(),
    (parseInt(currentWeek) - 2).toString(),
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold bg-gradient-to-r from-primary-main to-primary-dark bg-clip-text text-transparent">
        Weekly Spending
      </h2>
      <p className="text-gray-500 max-w-2xl">
        Monitor your week-over-week spending habits. The pie chart displays your
        categorical breakdown, while the grid provides exact totals.
      </p>

      <div className="mt-8 border-t border-gray-100 pt-8">
        <PeriodAnalytics
          periodType="WEEKLY"
          defaultPeriod={currentWeek}
          availablePeriods={availableWeeks}
        />
      </div>
    </div>
  );
};
