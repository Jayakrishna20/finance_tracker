import React from "react";
import { PeriodAnalytics } from "./PeriodAnalytics";
import { format } from "date-fns";
import { useTransactions } from "../../transactions/hooks/useTransactions";

export const MonthlyAnalyticsView: React.FC = () => {
  const currentMonth = format(new Date(), "MMM-yyyy");
  const { data: transactions } = useTransactions();

  const availableMonths = React.useMemo(() => {
    if (!transactions) return [currentMonth];
    const months = Array.from(
      new Set(
        transactions.map(
          (t) => t.monthYear || format(new Date(t.date), "MMM-yyyy"),
        ),
      ),
    ).sort((a, b) => b.localeCompare(a)); // Simple sort, maybe better to sort by date
    return months.includes(currentMonth) ? months : [currentMonth, ...months];
  }, [transactions, currentMonth]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold bg-gradient-to-r from-primary-main to-primary-dark bg-clip-text text-transparent">
        Monthly Spending
      </h2>
      <p className="text-gray-500 max-w-2xl">
        Monitor your monthly spending habits. The pie chart displays your
        categorical breakdown, while the grid provides exact totals.
      </p>

      <div className="mt-8 border-t border-gray-100 pt-8">
        <PeriodAnalytics
          periodType="MONTHLY"
          defaultPeriod={currentMonth}
          availablePeriods={availableMonths}
        />
      </div>
    </div>
  );
};
