import React, { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { usePeriodAnalytics } from "../hooks/usePeriodAnalytics";
import { useCategoryStore } from "../../../store/useCategoryStore";

interface PeriodAnalyticsProps {
  periodType: "WEEKLY" | "MONTHLY" | "YEARLY";
  defaultPeriod: string;
  availablePeriods: string[];
}

const COLORS = [
  "#B9FF66",
  "#191A23",
  "#A3E65A",
  "#292A32",
  "#F3F3F3",
  "#CCCCCC",
];

export const PeriodAnalytics: React.FC<PeriodAnalyticsProps> = ({
  periodType,
  defaultPeriod,
  availablePeriods,
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState(defaultPeriod);
  const { chartData, gridData, total, isLoading } = usePeriodAnalytics(
    periodType,
    selectedPeriod,
  );
  const { categories } = useCategoryStore();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const columns: GridColDef[] = [
    { field: "category", headerName: "Category", flex: 1 },
    {
      field: "amount",
      headerName: "Total Spent",
      flex: 1,
      type: "number",
      valueFormatter: (value: number) => formatCurrency(value),
    },
  ];

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold capitalize">
          {periodType.toLowerCase()} Analytics
        </h3>

        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Select Period</InputLabel>
          <Select
            value={selectedPeriod}
            label="Select Period"
            onChange={(e) => setSelectedPeriod(e.target.value)}>
            {availablePeriods.map((p) => (
              <MenuItem key={p} value={p}>
                {p}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-[400px]">
        {/* Recharts Pie Chart container */}
        <div className="bg-gray-50 rounded-2xl p-6 flex items-center justify-center relative">
          {chartData.length === 0 && !isLoading ? (
            <div className="text-gray-400">No data for this period</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value">
                  {chartData.map((_entry, index) => {
                    const matchedColor = categories.find(
                      (c) => c.name === _entry.name,
                    )?.color;
                    return (
                      <Cell
                        key={`cell-${index}`}
                        fill={matchedColor || COLORS[index % COLORS.length]}
                      />
                    );
                  })}
                </Pie>
                <Tooltip
                  formatter={(value: number | undefined) =>
                    formatCurrency(value ?? 0)
                  }
                />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          )}

          {chartData.length > 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none mt-[-36px]">
              <div className="text-center">
                <div className="text-sm text-gray-500 font-medium">Total</div>
                <div className="text-2xl font-bold text-secondary-main">
                  {formatCurrency(total)}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* DataGrid container */}
        <div className="h-full w-full bg-white rounded-xl overflow-hidden border border-gray-100">
          <DataGrid
            rows={gridData}
            columns={columns}
            loading={isLoading}
            hideFooter
            disableRowSelectionOnClick
            sx={{ border: 0 }}
          />
          {gridData.length > 0 && (
            <div className="px-4 py-3 bg-gray-50 flex justify-between items-center border-t border-gray-100 font-bold">
              <span>Grand Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
