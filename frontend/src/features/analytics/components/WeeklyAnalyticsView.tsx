import React from "react";
import { getISOWeek } from "date-fns";
import { PeriodAnalytics } from "./PeriodAnalytics";
import { useTransactions } from "../../transactions/hooks/useTransactions";

export const WeeklyAnalyticsView: React.FC = () => {
  const currentWeek = getISOWeek(new Date()).toString();
  const { data: transactions } = useTransactions();

  const availableWeeks = React.useMemo(() => {
    if (!transactions) return [currentWeek];
    const weeks = Array.from(
      new Set(transactions.map((t) => getISOWeek(new Date(t.date)).toString())),
    ).sort((a, b) => parseInt(a) - parseInt(b));
    return weeks.includes(currentWeek) ? weeks : [currentWeek, ...weeks];
  }, [transactions, currentWeek]);

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
