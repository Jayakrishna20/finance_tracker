import { Button } from "@mui/material";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
  type RowSelectionState,
  type SortingState,
} from "@tanstack/react-table";
import { format, getISOWeek } from "date-fns";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Check,
  ChevronDown,
  ChevronRight,
  Edit2,
  Info,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { useConfirmStore } from "../../../store/useConfirmStore";
import type { Credit } from "../../../types";
import { formatCurrency } from "../../../utils/formatters";
import {
  useBatchUpdateCredits,
  useCredits,
  useDeleteCredit,
} from "../hooks/useCreditHooks";
import { useCreditModalStore } from "../store/useCreditModalStore";

export const CreditLogsGrid: React.FC = () => {
  const { data: credits = [], isLoading } = useCredits({ skip: 0, take: 50 });
  const deleteCreditMutation = useDeleteCredit();
  const batchUpdateMutation = useBatchUpdateCredits();
  const { openModal } = useCreditModalStore();
  const { openConfirm } = useConfirmStore();

  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [sorting, setSorting] = useState<SortingState>([
    { id: "paymentDate", desc: true },
  ]);

  const [buttonAction, setButtonAction] = useState<
    "markPaid" | "markUnpaid" | null
  >(null);
  const [buttonLabel, setButtonLabel] = useState("");
  const [showWarning, setShowWarning] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(
    {},
  );

  useEffect(() => {
    const selectedIds = Object.keys(rowSelection);
    const selectedCredits = credits.filter((c: Credit) =>
      selectedIds.includes(c.creditId.toString()),
    );

    const paidCount = selectedCredits.filter(
      (c: Credit) => c.paidStatus,
    ).length;
    const unpaidCount = selectedCredits.filter(
      (c: Credit) => !c.paidStatus,
    ).length;

    let action: "markPaid" | "markUnpaid" | null = null;
    let label = "";
    let warning = false;

    if (selectedCredits.length > 0) {
      if (paidCount === 0) {
        action = "markPaid";
        label = "Mark as Paid";
      } else if (unpaidCount === 0) {
        action = "markUnpaid";
        label = "Mark as Unpaid";
      } else {
        warning = true;
        if (paidCount > unpaidCount) {
          action = "markUnpaid";
          label = "Mark as Unpaid";
        } else if (unpaidCount > paidCount) {
          action = "markPaid";
          label = "Mark as Paid";
        } else {
          action = "markPaid";
          label = "Mark as Paid";
        }
      }
    }

    setButtonAction(action);
    setButtonLabel(label);
    setShowWarning(warning);
  }, [rowSelection, credits]);

  const toggleGroup = (month: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [month]: !prev[month],
    }));
  };

  const handleBatchAction = () => {
    if (!buttonAction || Object.keys(rowSelection).length === 0) return;

    const targetStatus = buttonAction === "markPaid";

    batchUpdateMutation.mutate({
      ids: Object.keys(rowSelection).map(Number),
      paidStatus: targetStatus,
    });

    setRowSelection({});
  };

  const sortedCredits = useMemo(() => {
    const sorted = [...credits];
    if (sorting.length > 0) {
      const { id, desc } = sorting[0];
      sorted.sort((a, b) => {
        let valA: any = a[id as keyof Credit];
        let valB: any = b[id as keyof Credit];

        if (id === "categoryName") {
          valA = a.categoryName || "";
          valB = b.categoryName || "";
        } else if (
          id === "billedDate" ||
          id === "lastPaymentDate" ||
          id === "paymentDate"
        ) {
          valA = valA ? new Date(valA).getTime() : 0;
          valB = valB ? new Date(valB).getTime() : 0;
        }

        if (valA === valB) return 0;
        if (valA === null || valA === undefined) return desc ? 1 : -1;
        if (valB === null || valB === undefined) return desc ? -1 : 1;

        const res = valA > valB ? 1 : -1;
        return desc ? -res : res;
      });
    } else {
      sorted.sort((a, b) => {
        const dateA = new Date(a.billedDate).getTime();
        const dateB = new Date(b.billedDate).getTime();
        return dateB - dateA;
      });
    }
    return sorted;
  }, [credits, sorting]);

  const groupedRows = useMemo(() => {
    const groups: Record<string, Credit[]> = {};
    const groupOrder: string[] = [];

    sortedCredits.forEach((credit) => {
      const monthKey = format(new Date(credit.billedDate), "MMMM yyyy");
      if (!groupOrder.includes(monthKey)) groupOrder.push(monthKey);

      if (!groups[monthKey]) groups[monthKey] = [];
      groups[monthKey].push(credit);
    });

    const result: any[] = [];

    groupOrder.forEach((month) => {
      const items = groups[month];
      const isAllPaid =
        items.length > 0 && items.every((item) => item.paidStatus === true);

      result.push({
        id: `group-${month}`,
        isGroup: true,
        groupMonth: month,
        isAllPaid,
        itemsCount: items.length,
      });

      if (expandedGroups[month] !== false) {
        result.push(...items);
      }
    });

    return result;
  }, [sortedCredits, expandedGroups]);

  const columns: ColumnDef<any>[] = useMemo(
    () => [
      {
        id: "select",
        header: ({ table }) => {
          const nonGroupSelected = table
            .getRowModel()
            .rows.filter(
              (r) => !r.original.isGroup && r.getIsSelected(),
            ).length;
          const nonGroupTotal = table
            .getRowModel()
            .rows.filter((r) => !r.original.isGroup).length;
          const allSelected =
            nonGroupTotal > 0 && nonGroupSelected === nonGroupTotal;
          const isIndeterminate =
            nonGroupSelected > 0 && nonGroupSelected < nonGroupTotal;

          return (
            <div className="flex items-center justify-center w-full h-full">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-gray-300 text-primary-main focus:ring-primary-main cursor-pointer"
                checked={allSelected}
                ref={(input) => {
                  if (input) input.indeterminate = isIndeterminate;
                }}
                onChange={table.getToggleAllRowsSelectedHandler()}
              />
            </div>
          );
        },
        cell: ({ row }) => {
          if (row.original.isGroup) return null;
          return (
            <div className="flex items-center justify-center w-full h-full">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-gray-300 text-primary-main focus:ring-primary-main cursor-pointer"
                checked={row.getIsSelected()}
                disabled={!row.getCanSelect()}
                onChange={(e) => {
                  e.stopPropagation();
                  row.toggleSelected();
                }}
              />
            </div>
          );
        },
        size: 50,
      },
      {
        accessorKey: "description",
        header: "Description",
        size: 250,
        cell: (info) => {
          if (info.row.original.isGroup) return null;
          return (
            <span className="text-gray-900">{info.getValue() as string}</span>
          );
        },
      },
      {
        accessorKey: "categoryName",
        header: "Category",
        size: 140,
        cell: (info) => {
          if (info.row.original.isGroup) return null;
          const categoryName = (info.getValue() as string) || "Unknown";
          const matchedColor = info.row.original.categoryColorCode || "#ccc";
          return (
            <div className="flex items-center gap-2 h-full">
              <div
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: matchedColor }}
              />
              <span className="truncate">{categoryName}</span>
            </div>
          );
        },
      },
      {
        accessorKey: "amount",
        header: "Amount",
        size: 130,
        cell: (info) => {
          if (info.row.original.isGroup) {
            const items = info.row.original.items || [];
            if (items.length === 0) return null;
            return null;
          }
          const val = info.getValue() as number;
          return (
            <span className="text-gray-900 font-medium">
              {formatCurrency(val || 0)}
            </span>
          );
        },
      },
      {
        accessorKey: "billedDate",
        header: "Billed Date",
        size: 160,
        cell: (info) => {
          if (info.row.original.isGroup) {
            const month = info.row.original.groupMonth;
            const expanded = expandedGroups[month] !== false;
            const isAllPaid = info.row.original.isAllPaid;

            return (
              <div className="flex items-center gap-4">
                <div
                  className="flex items-center gap-2 font-semibold text-gray-800 cursor-pointer py-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleGroup(month);
                  }}
                >
                  <span className="text-gray-500">
                    {expanded ? (
                      <ChevronDown size={14} />
                    ) : (
                      <ChevronRight size={14} />
                    )}
                  </span>
                  <span>{month}</span>
                </div>
                <div
                  className={`inline-flex items-center gap-1.5 pl-2 pr-0.5 py-0.5 rounded-[3px] border border-solid text-xs font-medium ${
                    isAllPaid
                      ? "border-[#4caf50] text-[#00796b] bg-white"
                      : "border-[#ef5350] text-[#c62828] bg-white"
                  }`}
                >
                  {isAllPaid ? (
                    <Check
                      size={14}
                      strokeWidth={2.5}
                      className="text-[#00796b]"
                    />
                  ) : (
                    <X size={14} strokeWidth={2.5} className="text-[#c62828]" />
                  )}
                  <span className="mr-1">{isAllPaid ? "Paid" : "Unpaid"}</span>
                </div>
              </div>
            );
          }
          const value = info.getValue() as string;
          return (
            <span className="text-gray-700">
              {format(new Date(value), "dd/MM/yyyy")}
            </span>
          );
        },
      },
      {
        accessorKey: "lastPaymentDate",
        header: "Last Payment",
        size: 130,
        cell: (info) => {
          if (info.row.original.isGroup) return null;
          const value = info.getValue() as string;
          if (!value) return <span className="text-gray-500">-</span>;
          return (
            <span className="text-gray-700">
              {format(new Date(value), "dd/MM/yyyy")}
            </span>
          );
        },
      },
      {
        accessorKey: "paymentDate",
        header: "Payment Date",
        size: 130,
        cell: (info) => {
          if (info.row.original.isGroup) return null;
          const value = info.getValue() as string;
          if (!value) return <span className="text-gray-500">-</span>;
          return (
            <span className="text-gray-700">
              {format(new Date(value), "dd/MM/yyyy")}
            </span>
          );
        },
      },
      {
        id: "weekNumber",
        header: "Week",
        size: 80,
        accessorFn: (row) => getISOWeek(new Date(row.paymentDate)),
        cell: (info) => (
          <span className="text-gray-700">{info.getValue() as number}</span>
        ),
      },
      {
        id: "monthYear",
        header: "Month",
        size: 110,
        accessorFn: (row) => format(new Date(row.paymentDate), "MMM-yyyy"),
        cell: (info) => (
          <span className="text-gray-700">{info.getValue() as string}</span>
        ),
      },
      {
        accessorKey: "paidStatus",
        header: "Status",
        size: 120,
        cell: (info) => {
          if (info.row.original.isGroup) return null;
          const isPaid = info.getValue() as boolean;
          return (
            <div
              className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[3px] border border-solid text-xs font-medium ${
                isPaid
                  ? "border-[#4caf50] text-[#00796b] bg-white"
                  : "border-[#ef5350] text-[#c62828] bg-white"
              }`}
            >
              {isPaid ? (
                <Check size={14} strokeWidth={2.5} className="text-[#00796b]" />
              ) : (
                <X size={14} strokeWidth={2.5} className="text-[#c62828]" />
              )}
              {isPaid ? "Paid" : "Unpaid"}
            </div>
          );
        },
      },
      {
        id: "actions",
        header: "Actions",
        size: 100,
        enableSorting: false,
        cell: ({ row }) => {
          if (row.original.isGroup) return null;
          return (
            <div className="flex items-center gap-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  openModal(row.original);
                }}
                className="text-gray-500 hover:text-primary-main transition-colors p-1 rounded-md hover:bg-gray-100"
                title="Edit"
              >
                <Edit2 size={16} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  openConfirm({
                    title: "Delete Credit",
                    message:
                      "Are you sure you want to delete this credit log? This action cannot be undone.",
                    onConfirm: () => {
                      deleteCreditMutation.mutate(row.original.creditId);
                    },
                  });
                }}
                className="text-red-500 hover:text-red-600 transition-colors p-1 rounded-md hover:bg-red-50"
                title="Delete"
              >
                <Trash2 size={16} />
              </button>
            </div>
          );
        },
      },
    ],
    [expandedGroups, openModal, openConfirm, deleteCreditMutation],
  );

  const table = useReactTable({
    data: groupedRows,
    columns,
    state: {
      sorting,
      rowSelection,
    },
    enableRowSelection: (row) => !row.original.isGroup,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    manualSorting: true,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row.creditId?.toString() ?? row.id,
  });

  return (
    <div className="h-full w-full flex flex-col">
      <div className="flex-1 min-h-0 w-full animate-in fade-in duration-500 flex flex-col">
        <div className="flex items-center justify-end mb-4 gap-4 shrink-0">
          {Object.keys(rowSelection).length > 0 && buttonAction && (
            <div className="flex items-center gap-3 animate-in fade-in slide-in-from-left-4 duration-300">
              {showWarning && (
                <span className="text-sm text-amber-600 font-medium flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-md border border-amber-100">
                  <Info size={16} /> Mixed paid/unpaid selection. Proceed with
                  caution.
                </span>
              )}
              <Button
                variant="outlined"
                color={buttonAction === "markPaid" ? "success" : "error"}
                size="small"
                onClick={handleBatchAction}
                disabled={batchUpdateMutation.isPending}
                sx={{
                  borderRadius: "4px",
                  textTransform: "none",
                  fontWeight: 500,
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  padding: "4px 8px",
                }}
              >
                {buttonAction === "markPaid" ? (
                  <Check size={16} strokeWidth={2.5} />
                ) : (
                  <X size={16} strokeWidth={2.5} />
                )}
                <span className="mx-1">{buttonLabel}</span>
              </Button>
            </div>
          )}
          <Button
            variant="contained"
            startIcon={<Plus size={18} />}
            onClick={() => openModal()}
            sx={{
              borderRadius: "8px",
              textTransform: "none",
              fontWeight: 600,
              boxShadow: "none",
              "&:hover": { boxShadow: "0 4px 12px rgba(185, 255, 102, 0.4)" },
            }}
          >
            Add Credit Tx
          </Button>
        </div>

        <div className="flex-1 min-h-0 border border-[#F3F4F6] rounded-lg overflow-hidden flex flex-col bg-white shadow-sm">
          <div className="overflow-auto flex-1 h-full min-h-0 relative">
            <table className="w-full text-sm text-left border-collapse">
              <thead className="bg-[#F9FAFB] sticky top-0 z-10">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      const styleWidth =
                        header.getSize() !== 150
                          ? { width: header.getSize() }
                          : {};
                      return (
                        <th
                          key={header.id}
                          className={`px-4 py-3 text-xs font-semibold text-gray-600 tracking-wider ${header.column.getCanSort() ? "cursor-pointer hover:bg-gray-100 transition-colors" : ""} border-b border-[#F3F4F6] shadow-[0_1px_0_0_#F3F4F6]`}
                          style={styleWidth}
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          <div
                            className={`flex items-center gap-1.5 ${header.id === "select" ? "justify-center" : ""}`}
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                            {header.column.getCanSort() && (
                              <span className="text-gray-400">
                                {{
                                  asc: (
                                    <ArrowUp
                                      size={14}
                                      className="text-gray-700"
                                    />
                                  ),
                                  desc: (
                                    <ArrowDown
                                      size={14}
                                      className="text-gray-700"
                                    />
                                  ),
                                }[header.column.getIsSorted() as string] ?? (
                                  <ArrowUpDown
                                    size={14}
                                    className="opacity-50"
                                  />
                                )}
                              </span>
                            )}
                          </div>
                        </th>
                      );
                    })}
                  </tr>
                ))}
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td
                      colSpan={columns.length}
                      className="px-4 py-8 text-center text-gray-500"
                    >
                      Loading credits...
                    </td>
                  </tr>
                ) : table.getRowModel().rows.length === 0 ? (
                  <tr>
                    <td
                      colSpan={columns.length}
                      className="px-4 py-8 text-center text-gray-500"
                    >
                      No credits found.
                    </td>
                  </tr>
                ) : (
                  table.getRowModel().rows.map((row) => {
                    const isGroup = row.original.isGroup;
                    return (
                      <tr
                        key={row.id}
                        className={`border-b border-[#F3F4F6] transition-colors ${
                          isGroup
                            ? "bg-gray-50/80 hover:bg-gray-100"
                            : row.getIsSelected()
                              ? "bg-primary-main/15 hover:bg-primary-main/25"
                              : "hover:bg-gray-100"
                        }`}
                        onClick={() => {
                          if (!isGroup && row.getCanSelect()) {
                            row.toggleSelected();
                          }
                        }}
                      >
                        {isGroup ? (
                          <td
                            colSpan={columns.length}
                            className="px-4 py-2 border-b border-[#F3F4F6]"
                          >
                            {flexRender(
                              row
                                .getVisibleCells()
                                .find((c) => c.column.id === "billedDate")
                                ?.column.columnDef.cell,
                              row
                                .getVisibleCells()
                                .find((c) => c.column.id === "billedDate")
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                ?.getContext() as any,
                            )}
                          </td>
                        ) : (
                          row.getVisibleCells().map((cell) => (
                            <td
                              key={cell.id}
                              className={`px-4 py-3 text-sm ${!isGroup ? "cursor-pointer" : ""}`}
                              onClick={(e) => {
                                if (
                                  cell.column.id === "select" ||
                                  cell.column.id === "actions"
                                ) {
                                  e.stopPropagation();
                                }
                              }}
                            >
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext(),
                              )}
                            </td>
                          ))
                        )}
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
