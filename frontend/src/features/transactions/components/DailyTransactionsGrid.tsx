import React, { useMemo } from "react";
import {
  DataGrid,
  type GridColDef,
  GridActionsCellItem,
} from "@mui/x-data-grid";
import { Edit2, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { useTransactions } from "../hooks/useTransactions";
import { useDeleteTransaction } from "../hooks/useDeleteTransaction";
import type { Transaction } from "../../../types";
import { useCategoryStore } from "../../../store/useCategoryStore";
import { useModalStore } from "../../../store/useModalStore";
import { useConfirmStore } from "../../../store/useConfirmStore";

// Simple currency formatter
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
};

interface DailyTransactionsGridProps {
  type?: "normal" | "credit" | "all";
}

export const DailyTransactionsGrid: React.FC<DailyTransactionsGridProps> = ({
  type = "normal",
}) => {
  const { data: allTransactions, isLoading } = useTransactions();

  const transactions = React.useMemo(() => {
    if (!allTransactions) return [];
    if (type === "all") return allTransactions;
    return allTransactions.filter((t) => (t.type || "normal") === type);
  }, [allTransactions, type]);
  const deleteTxMutation = useDeleteTransaction();
  const { categories } = useCategoryStore();
  const { openModal } = useModalStore();
  const { openConfirm } = useConfirmStore();

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
      {
        field: "category",
        headerName: "Category",
        width: 140,
        renderCell: (params) => {
          const matchedColor =
            categories.find((c) => c.name === params.value)?.color || "#6B7280";
          return (
            <div className="flex items-center gap-2 h-full">
              <div
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: matchedColor }}
              />
              {params.value}
            </div>
          );
        },
      },
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
            icon={
              <Edit2
                size={18}
                className="text-gray-500 hover:text-primary-main"
              />
            }
            label="Edit"
            onClick={() => openModal(params.row)}
          />,
          <GridActionsCellItem
            key="delete"
            icon={
              <Trash2 size={18} className="text-red-500 hover:text-red-600" />
            }
            label="Delete"
            onClick={() => {
              openConfirm({
                title: "Delete Transaction",
                message:
                  "Are you sure you want to delete this transaction? This action cannot be undone.",
                onConfirm: () => {
                  deleteTxMutation.mutate(params.id as string);
                },
              });
            }}
          />,
        ],
      },
    ],
    [categories],
  );

  return (
    <div className="h-full w-full flex flex-col">
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
