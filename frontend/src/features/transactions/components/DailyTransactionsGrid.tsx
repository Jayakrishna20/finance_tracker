import React, { useMemo } from "react";
import {
  DataGrid,
  type GridColDef,
  GridActionsCellItem,
} from "@mui/x-data-grid";
import { Edit2, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { useTransactions } from "../hooks/useTransactions";
import type { Transaction } from "../../../types";

// Simple currency formatter
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
};

export const DailyTransactionsGrid: React.FC = () => {
  const { data: transactions, isLoading } = useTransactions();

  // useMemo ensures column definition doesn't re-render heavily if grid repaints
  const columns: GridColDef<Transaction>[] = useMemo(
    () => [
      {
        field: "date",
        headerName: "Date",
        width: 130,
        valueGetter: (value: Date) => new Date(value),
        valueFormatter: (value: Date) => format(value, "MMM dd, yyyy"),
      },
      { field: "dayName", headerName: "Day", width: 100 },
      { field: "category", headerName: "Category", width: 140 },
      {
        field: "amount",
        headerName: "Amount",
        width: 130,
        type: "number",
        valueFormatter: (value: number) => formatCurrency(value),
      },
      {
        field: "description",
        headerName: "Description",
        flex: 1,
        minWidth: 200,
      },
      { field: "weekNumber", headerName: "Week", width: 80, type: "number" },
      { field: "monthYear", headerName: "Month", width: 110 },
      {
        field: "actions",
        type: "actions",
        headerName: "Actions",
        width: 100,
        getActions: (params) => [
          <GridActionsCellItem
            key="edit"
            icon={<Edit2 size={18} className="text-gray-500" />}
            label="Edit"
            onClick={() => console.log("Edit clicked", params.id)}
          />,
          <GridActionsCellItem
            key="delete"
            icon={<Trash2 size={18} className="text-red-500" />}
            label="Delete"
            onClick={() => console.log("Delete clicked", params.id)}
          />,
        ],
      },
    ],
    [],
  );

  return (
    <div className="h-full w-full flex flex-col">
      <div className="mb-4 flex justify-between items-center shrink-0">
        <h3 className="text-lg font-bold">Daily Transactions</h3>
        {/* Date bounds filter could be added here in the future */}
      </div>

      <div className="flex-1 min-h-0 w-full">
        <DataGrid
          rows={transactions || []}
          columns={columns}
          loading={isLoading}
          initialState={{
            sorting: {
              sortModel: [{ field: "date", sort: "desc" }],
            },
          }}
          hideFooter
          disableRowSelectionOnClick
          sx={{
            border: 0,
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "#F9FAFB", // Tailwind gray-50
              borderBottom: "1px solid #F3F4F6",
            },
            "& .MuiDataGrid-cell": {
              borderBottom: "1px solid #F3F4F6",
            },
          }}
        />
      </div>
    </div>
  );
};
