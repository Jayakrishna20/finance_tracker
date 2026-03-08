import { Button } from "@mui/material";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import { format, getISOWeek } from "date-fns";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Edit2,
  Plus,
  Trash2,
} from "lucide-react";
import React, { useMemo, useState } from "react";
import { useConfirmStore } from "../../../store/useConfirmStore";
import {
  type DailyTransactionsGridProps,
  type Transaction,
} from "../../../types";
import { formatCurrency } from "../../../utils/formatters";
import {
  useDeleteTransaction,
  useTransactions,
} from "../hooks/useTransactionHooks";
import { useTransactionModalStore } from "../store/useTransactionModalStore";

export const DailyTransactionsGrid: React.FC<
  DailyTransactionsGridProps
> = ({}) => {
  const { data: allTransactions = [], isLoading } = useTransactions({
    skip: 0,
    take: 50,
  });

  const deleteTxMutation = useDeleteTransaction();
  const { openModal } = useTransactionModalStore();
  const { openConfirm } = useConfirmStore();

  const [sorting, setSorting] = useState<SortingState>([
    { id: "date", desc: true },
  ]);

  const sortedTransactions = useMemo(() => {
    const sorted = [...allTransactions];
    if (sorting.length > 0) {
      const { id, desc } = sorting[0];
      sorted.sort((a, b) => {
        let valA: any = a[id as keyof Transaction];
        let valB: any = b[id as keyof Transaction];

        if (id === "dayName") {
          valA = new Date(a.date).getDay();
          valB = new Date(b.date).getDay();
        } else if (id === "categoryName") {
          valA = a.categoryName || "";
          valB = b.categoryName || "";
        } else if (id === "date") {
          valA = new Date(a.date).getTime();
          valB = new Date(b.date).getTime();
        } else if (id === "weekNumber") {
          valA = getISOWeek(new Date(a.date));
          valB = getISOWeek(new Date(b.date));
        } else if (id === "monthYear") {
          valA = new Date(a.date).getTime();
          valB = new Date(b.date).getTime();
        }

        if (valA === valB) return 0;
        if (valA === null || valA === undefined) return desc ? 1 : -1;
        if (valB === null || valB === undefined) return desc ? -1 : 1;

        const res = valA > valB ? 1 : -1;
        return desc ? -res : res;
      });
    } else {
      sorted.sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return dateB - dateA;
      });
    }
    return sorted;
  }, [allTransactions, sorting]);

  const columns: ColumnDef<Transaction>[] = useMemo(
    () => [
      {
        accessorKey: "date",
        header: "Date",
        size: 130,
        cell: (info) => {
          const value = info.getValue() as Date | string;
          return (
            <span className="text-gray-700">
              {format(new Date(value), "dd/MM/yyyy")}
            </span>
          );
        },
      },
      {
        id: "dayName",
        header: "Day",
        size: 100,
        accessorFn: (row) => format(new Date(row.date), "EEEE"),
        cell: (info) => (
          <span className="text-gray-700">{info.getValue() as string}</span>
        ),
      },
      {
        accessorKey: "categoryName",
        header: "Category",
        size: 140,
        cell: (info) => {
          const categoryName = info.row.original.categoryName || "Unknown";
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
          const val = info.getValue() as number;
          return (
            <span className="text-gray-900 font-medium">
              {formatCurrency(val)}
            </span>
          );
        },
      },
      {
        accessorKey: "description",
        header: "Description",
        size: 200,
        cell: (info) => {
          const desc = info.getValue() as string;
          return <span className="text-gray-900">{desc}</span>;
        },
      },
      {
        id: "weekNumber",
        header: "Week",
        size: 80,
        accessorFn: (row) => getISOWeek(new Date(row.date)),
        cell: (info) => (
          <span className="text-gray-700">{info.getValue() as number}</span>
        ),
      },
      {
        id: "monthYear",
        header: "Month",
        size: 110,
        accessorFn: (row) => format(new Date(row.date), "MMM-yyyy"),
        cell: (info) => (
          <span className="text-gray-700">{info.getValue() as string}</span>
        ),
      },
      {
        id: "actions",
        header: "Actions",
        size: 100,
        enableSorting: false,
        cell: ({ row }) => {
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
                    title: "Delete Transaction",
                    message:
                      "Are you sure you want to delete this transaction? This action cannot be undone.",
                    onConfirm: () => {
                      deleteTxMutation.mutate(row.original.transactionId);
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
    [openModal, openConfirm, deleteTxMutation],
  );

  const table = useReactTable({
    data: sortedTransactions,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    manualSorting: true,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row.transactionId.toString(),
  });

  return (
    <div className="h-full w-full flex flex-col">
      <div className="flex-1 min-h-0 w-full animate-in fade-in duration-500 flex flex-col">
        <div className="flex justify-end mb-4 shrink-0">
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
            Add Transaction
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
                          <div className="flex items-center gap-1.5">
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
                      Loading transactions...
                    </td>
                  </tr>
                ) : table.getRowModel().rows.length === 0 ? (
                  <tr>
                    <td
                      colSpan={columns.length}
                      className="px-4 py-8 text-center text-gray-500"
                    >
                      No transactions found.
                    </td>
                  </tr>
                ) : (
                  table.getRowModel().rows.map((row) => (
                    <tr
                      key={row.id}
                      className="border-b border-[#F3F4F6] transition-colors hover:bg-gray-100"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className="px-4 py-3 text-sm">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
