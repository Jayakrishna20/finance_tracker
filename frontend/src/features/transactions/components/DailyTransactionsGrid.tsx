import React, { useMemo } from "react";
import {
  DataGrid,
  type GridColDef,
  GridActionsCellItem,
} from "@mui/x-data-grid";
import { Edit2, Trash2 } from "lucide-react";
import { format, getISOWeek } from "date-fns";
import { useTransactions } from "../hooks/useTransactions";
import { useDeleteTransaction } from "../hooks/useDeleteTransaction";
import type { DailyTransactionsGridProps, Transaction } from "../../../types";
import { useCategoryStore } from "../../../store/useCategoryStore";
import { useModalStore } from "../../../store/useModalStore";
import { useConfirmStore } from "../../../store/useConfirmStore";
import { formatCurrency } from "../../../utils/formatters";

export const DailyTransactionsGrid: React.FC<DailyTransactionsGridProps> = ({
  type = "Normal",
}) => {
  const { data: allTransactions, isLoading } = useTransactions({
    skip: 0,
    take: 10,
    categoryTypeName: type,
  });

  const deleteTxMutation = useDeleteTransaction();
  const { categories } = useCategoryStore();
  const { openModal } = useModalStore();
  const { openConfirm } = useConfirmStore();

  const columns: GridColDef<Transaction>[] = useMemo(
    () => [
      {
        field: "date",
        headerName: "Date",
        width: 130,
        valueGetter: (value: Date) => new Date(value),
        valueFormatter: (value: Date) => format(value, "dd/MM/yyyy"),
      },
      {
        field: "dayName",
        headerName: "Day",
        width: 100,
        valueGetter: (_value, row) => format(new Date(row.date), "EEEE"),
      },
      {
        field: "category",
        headerName: "Category",
        width: 140,
        valueGetter: (_value, row) =>
          row.category?.categoryName || "Uncategorized",
        renderCell: (params) => {
          const categoryName = params.value;
          const category = categories.find(
            (c) => c.categoryName === categoryName,
          );
          const matchedColor = category?.categoryColorCode || "#6B7280";
          return (
            <div className="flex items-center gap-2 h-full">
              <div
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: matchedColor }}
              />
              {categoryName}
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
      {
        field: "weekNumber",
        headerName: "Week",
        width: 80,
        type: "number",
        valueGetter: (_value, row) => getISOWeek(new Date(row.date)),
      },
      {
        field: "monthYear",
        headerName: "Month",
        width: 110,
        valueGetter: (_value, row) => format(new Date(row.date), "MMM-yyyy"),
      },
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
          rows={allTransactions || []}
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
