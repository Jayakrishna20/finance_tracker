import React, { useMemo } from "react";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { useTransactions } from "../../transactions/hooks/useTransactions";
import { formatCurrency } from "../../../utils/formatters";
import { useCategoryStore } from "../../../store/useCategoryStore";

interface VaultPivotTableProps {
  periodType: "WEEKLY" | "MONTHLY" | "YEARLY";
}

export const VaultPivotTable: React.FC<VaultPivotTableProps> = ({
  periodType,
}) => {
  const { data: transactions, isLoading } = useTransactions();
  const { categories } = useCategoryStore();
  const { rows, columns, categoryGrandTotals, totalGrand } = useMemo(() => {
    if (!transactions)
      return {
        rows: [],
        columns: [],
        categoryGrandTotals: {},
        totalGrand: 0,
      };

    // Extract unique categories for columns
    const uniqueCategories = Array.from(
      new Set(
        transactions.map(
          (t) =>
            t.category?.categoryName ||
            "Uncategorized",
        ),
      ),
    ).sort();

    const pivotMap = new Map<string, Record<string, number | string>>();
    let totalGrand = 0;
    const categoryGrandTotals: Record<string, number> = {};

    uniqueCategories.forEach((c) => (categoryGrandTotals[c] = 0));

    transactions.forEach((t) => {
      const catName =       
        t.category?.categoryName ||
        "Uncategorized";
      let rowKey = "";
      if (periodType === "WEEKLY") rowKey = (t.weekNumber || 0).toString();
      else if (periodType === "MONTHLY") rowKey = t.monthYear || "";
      else if (periodType === "YEARLY")
        rowKey = new Date(t.date).getFullYear().toString();

      if (!pivotMap.has(rowKey)) {
        pivotMap.set(rowKey, { rowKey, total: 0 });
        uniqueCategories.forEach((c) => (pivotMap.get(rowKey)![c] = 0));
      }

      const rowData = pivotMap.get(rowKey)!;
      (rowData[catName] as number) += t.amount;
      (rowData.total as number) += t.amount;

      categoryGrandTotals[catName] += t.amount;
      totalGrand += t.amount;
    });

    let rowList = Array.from(pivotMap.values());

    // Sort rows appropriately
    rowList.sort((a, b) => {
      if (periodType === "WEEKLY" || periodType === "YEARLY") {
        return parseInt(a.rowKey as string) - parseInt(b.rowKey as string);
      }
      // Basic string fallback for MONTHLY
      return (b.rowKey as string).localeCompare(a.rowKey as string);
    });

    const finalRows = rowList.map((r, i) => ({ id: i, ...r }));

    const periodLabel =
      periodType === "WEEKLY"
        ? "Week"
        : periodType === "MONTHLY"
          ? "Month"
          : "Year";

    const cols: GridColDef[] = [
      {
        field: "rowKey",
        headerName: periodLabel,
        width: 120,
        sortable: false,
        headerClassName: "pivot-header pivot-header-first",
      },
    ];

    uniqueCategories.forEach((c) => {
      cols.push({
        field: c,
        headerName: c,
        flex: 1,
        minWidth: 160,
        type: "number",
        sortable: false,
        valueFormatter: (val) => formatCurrency(val),
        headerClassName: "pivot-header",
      });
    });

    cols.push({
      field: "total",
      headerName: "Grand Total",
      width: 140,
      type: "number",
      sortable: false,
      valueFormatter: (val) => formatCurrency(val),
      headerClassName: "pivot-header pivot-header-last",
    });

    return { rows: finalRows, columns: cols, categoryGrandTotals, totalGrand };
  }, [transactions, periodType, categories]);

  const summaryData = useMemo(() => {
    return {
      rowKey: "Grand Total",
      ...categoryGrandTotals,
      total: totalGrand,
    };
  }, [categoryGrandTotals, totalGrand]);

  const sharedGridSx = {
    border: 0,
    "& .pivot-header": {
      backgroundColor: "#a3e65a",
      color: "white",
      fontWeight: 700,
      borderBottom: "2px solid #6b9e30",
    },
    "& .MuiDataGrid-columnHeaders": {
      borderRadius: 0,
      minHeight: "48px !important",
      maxHeight: "48px !important",
    },
    "& .MuiDataGrid-cell": {
      borderBottom: "1px solid #E5E7EB",
      fontSize: "14px",
    },
  };

  return (
    <div className="h-full w-full flex flex-col">
      <DataGrid
        rows={rows}
        columns={columns}
        loading={isLoading}
        disableRowSelectionOnClick
        disableColumnMenu
        hideFooter={false}
        getRowId={(row) => row.id}
        slots={{
          footer: () => {
            if (rows.length === 0) return null;
            return (
              <div
                className="flex border-t-2 border-black font-bold bg-[#F9FAFB] items-center shrink-0 pr-[10px]"
                style={{ minHeight: "48px" }}>
                {columns.map((col) => {
                  const rawVal =
                    summaryData[col.field as keyof typeof summaryData];
                  const cellValue =
                    col.type === "number" && typeof rawVal === "number"
                      ? formatCurrency(rawVal)
                      : rawVal;

                  return (
                    <div
                      key={col.field}
                      className="px-[10px] truncate text-[14px]"
                      style={{
                        width: col.width ? `${col.width}px` : undefined,
                        flex: col.flex ? `${col.flex} 1 0%` : undefined,
                        minWidth: col.minWidth
                          ? `${col.minWidth}px`
                          : undefined,
                        textAlign: col.type === "number" ? "right" : "left",
                      }}>
                      {cellValue as React.ReactNode}
                    </div>
                  );
                })}
              </div>
            );
          },
        }}
        sx={sharedGridSx}
      />
    </div>
  );
};
