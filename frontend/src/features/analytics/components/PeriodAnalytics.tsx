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
import { DataSource } from "../../../types";
import { useCategoryStore } from "../../../store/useCategoryStore";
import { formatCurrency } from "../../../utils/formatters";
import { CHART_COLORS, type PeriodType } from "../../../config/constants";

interface PeriodAnalyticsProps {
  periodType: PeriodType;
  defaultPeriod: string;
  availablePeriods: string[];
  dataSource?: DataSource;
}

export const PeriodAnalytics: React.FC<PeriodAnalyticsProps> = ({
  periodType,
  defaultPeriod,
  availablePeriods,
  dataSource = "transactions",
}) => {
  const currentYear = new Date().getFullYear();
  const [selectedPeriod, setSelectedPeriod] = useState(defaultPeriod);
  const [selectedYear, setSelectedYear] = useState(currentYear);

  const { chartData, gridData, total, isLoading } = usePeriodAnalytics(
    periodType,
    selectedPeriod,
    periodType === "WEEKLY" ? selectedYear : undefined,
    dataSource,
  );
  const { categories } = useCategoryStore();

  const availableYears = React.useMemo(() => {
    const years = [];
    for (let y = currentYear; y >= currentYear - 5; y--) {
      years.push(y);
    }
    return years;
  }, [currentYear]);

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

        <div className="flex gap-4">
          {periodType === "WEEKLY" && (
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Year</InputLabel>
              <Select
                value={selectedYear}
                label="Year"
                onChange={(e) => setSelectedYear(e.target.value as number)}
              >
                {availableYears.map((y) => (
                  <MenuItem key={y} value={y}>
                    {y}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>
              {periodType === "WEEKLY" ? "Select Week" : "Select Period"}
            </InputLabel>
            <Select
              value={selectedPeriod}
              label={periodType === "WEEKLY" ? "Select Week" : "Select Period"}
              onChange={(e) => setSelectedPeriod(e.target.value)}
            >
              {availablePeriods.map((p) => (
                <MenuItem key={p} value={p}>
                  {periodType === "WEEKLY" ? `Week ${p}` : p}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
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
                  dataKey="value"
                >
                  {chartData.map((entry: any, index: number) => {
                    const matchedColor = categories.find(
                      (c) => c.categoryName === entry.name,
                    )?.categoryColorCode;
                    return (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          matchedColor ||
                          CHART_COLORS[index % CHART_COLORS.length]
                        }
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
