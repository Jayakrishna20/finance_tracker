import React, { useMemo } from "react";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { formatCurrency } from "../../../utils/formatters";
import { useArchive } from "../hooks/useArchive";
import { DataSource } from "../../../types";
import { format } from "date-fns";

interface VaultPivotTableProps {
  periodType: "WEEKLY" | "MONTHLY" | "YEARLY";
  dataSource?: DataSource;
}

export const VaultPivotTable: React.FC<VaultPivotTableProps> = ({
  periodType,
  dataSource,
}) => {
  const { data: archiveData, isLoading } = useArchive(periodType, dataSource);

  const { rows, columns, categoryGrandTotals, totalGrand } = useMemo(() => {
    if (!archiveData || !Array.isArray(archiveData))
      return {
        rows: [],
        columns: [],
        categoryGrandTotals: {},
        totalGrand: 0,
      };

    const uniqueCategories = Array.from(
      new Set(archiveData.map((d: any) => d.categoryName)),
    ).sort();

    const pivotMap = new Map<string, Record<string, any>>();
    let totalGrand = 0;
    const categoryGrandTotals: Record<string, number> = {};
    uniqueCategories.forEach((c) => (categoryGrandTotals[c] = 0));

    archiveData.forEach((d: any) => {
      let rowKey = "";
      const date = new Date(d.period);
      if (periodType === "WEEKLY") {
        rowKey = format(date, "w");
      } else if (periodType === "MONTHLY") {
        rowKey = format(date, "MMM yyyy");
      } else {
        rowKey = format(date, "yyyy");
      }

      if (!pivotMap.has(rowKey)) {
        pivotMap.set(rowKey, { rowKey, total: d.periodTotal });
        uniqueCategories.forEach((c) => (pivotMap.get(rowKey)![c] = 0));
        totalGrand += d.periodTotal;
      }

      const rowData = pivotMap.get(rowKey)!;
      rowData[d.categoryName] = d.total;
      categoryGrandTotals[d.categoryName] += d.total;
    });

    const finalRows = Array.from(pivotMap.values()).map((r, i) => ({
      id: i,
      ...r,
    }));

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
        width: 150,
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
        valueFormatter: (value) => formatCurrency(value),
        headerClassName: "pivot-header",
      });
    });

    cols.push({
      field: "total",
      headerName: "Grand Total",
      width: 140,
      type: "number",
      sortable: false,
      valueFormatter: (value) => formatCurrency(value),
      headerClassName: "pivot-header pivot-header-last",
    });

    return { rows: finalRows, columns: cols, categoryGrandTotals, totalGrand };
  }, [archiveData, periodType]);

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
                style={{ minHeight: "48px" }}
              >
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
                      }}
                    >
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
