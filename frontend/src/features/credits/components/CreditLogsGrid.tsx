import { Button } from "@mui/material";
import {
  DataGrid,
  GridActionsCellItem,
  type GridColDef,
  type GridRowSelectionModel,
} from "@mui/x-data-grid";
import { format } from "date-fns";
import { Check, Edit2, Info, Plus, Trash2, X } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { useConfirmStore } from "../../../store/useConfirmStore";
import { useModalStore } from "../../../store/useModalStore";
import type { Credit } from "../../../types";
import { TransactionTypes } from "../../../types";
import { useBatchUpdateCredits } from "../hooks/useBatchUpdateCredits";
import { useCredits } from "../hooks/useCredits";
import { useDeleteCredit } from "../hooks/useDeleteCredit";

export const CreditLogsGrid: React.FC = () => {
  const { data: credits = [], isLoading } = useCredits();
  const deleteCreditMutation = useDeleteCredit();
  const batchUpdateMutation = useBatchUpdateCredits();
  const { openModal } = useModalStore();
  const { openConfirm } = useConfirmStore();

  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>();
  const [buttonAction, setButtonAction] = useState<
    "markPaid" | "markUnpaid" | null
  >(null);
  const [buttonLabel, setButtonLabel] = useState("");
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    const selectedCredits = credits.filter((c) =>
      selectionModel?.ids.has(c.creditId),
    );
    const paidCount = selectedCredits.filter((c) => c.paidStatus).length;
    const unpaidCount = selectedCredits.filter((c) => !c.paidStatus).length;

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
  }, [selectionModel, credits]);

  const handleBatchAction = () => {
    if (!buttonAction || !selectionModel || selectionModel.ids.size === 0)
      return;

    const targetStatus = buttonAction === "markPaid";

    batchUpdateMutation.mutate({
      ids: Array.from(selectionModel.ids).map(Number),
      payload: { paidStatus: targetStatus },
    });

    setSelectionModel(undefined);
  };

  const columns: GridColDef<Credit>[] = useMemo(
    () => [
      {
        field: "description",
        headerName: "Description",
        flex: 1,
        minWidth: 150,
      },
      {
        field: "category",
        headerName: "Category",
        width: 140,
        renderCell: (params) => {
          const categoryName = params.row.category?.categoryName || "Unknown";
          const matchedColor = params.row.category?.categoryColorCode || "#ccc";
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
        field: "billedDate",
        headerName: "Billed Date",
        width: 130,
        valueGetter: (value: string | Date) => new Date(value),
        valueFormatter: (value: Date) => format(value, "dd/MM/yyyy"),
      },
      {
        field: "lastPaymentDate",
        headerName: "Last Payment",
        width: 130,
        valueGetter: (value: string | Date) => new Date(value),
        valueFormatter: (value: Date) => format(value, "dd/MM/yyyy"),
      },
      {
        field: "paidStatus",
        headerName: "Status",
        width: 120,
        renderCell: (params) => {
          const isPaid = params.value;
          return (
            <div
              className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[4px] border border-solid text-xs font-medium ${
                isPaid
                  ? "border-[#4caf50] text-[#2e7d32]"
                  : "border-[#f44336] text-[#c62828]"
              }`}>
              {isPaid ? (
                <Check size={14} strokeWidth={2.5} />
              ) : (
                <X size={14} strokeWidth={2.5} />
              )}
              {isPaid ? "Paid" : "Unpaid"}
            </div>
          );
        },
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
            onClick={() => {
              openModal(params.row, TransactionTypes.Credit);
            }}
          />,
          <GridActionsCellItem
            key="delete"
            icon={
              <Trash2 size={18} className="text-red-500 hover:text-red-600" />
            }
            label="Delete"
            onClick={() => {
              openConfirm({
                title: "Delete Credit",
                message:
                  "Are you sure you want to delete this credit log? This action cannot be undone.",
                onConfirm: () => {
                  deleteCreditMutation.mutate(params.row.creditId);
                },
              });
            }}
          />,
        ],
      },
    ],
    [],
  );

  return (
    <div className="h-full w-full flex flex-col">
      <div className="flex-1 min-h-0 w-full animate-in fade-in duration-500">
        <div className="flex items-center justify-end mb-4 gap-4">
          {!selectionModel ||
            (selectionModel.ids.size > 0 && buttonAction && (
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
                  }}>
                  {buttonAction === "markPaid" ? (
                    <Check size={16} strokeWidth={2.5} />
                  ) : (
                    <X size={16} strokeWidth={2.5} />
                  )}
                  <span className="mx-1">{buttonLabel}</span>
                </Button>
              </div>
            ))}
          <Button
            variant="contained"
            startIcon={<Plus size={18} />}
            onClick={() => openModal(undefined, TransactionTypes.Credit)}
            sx={{
              borderRadius: "8px",
              textTransform: "none",
              fontWeight: 600,
              boxShadow: "none",
              "&:hover": { boxShadow: "0 4px 12px rgba(185, 255, 102, 0.4)" },
            }}>
            Add Credit Tx
          </Button>
        </div>
        <DataGrid
          rows={credits}
          columns={columns}
          loading={isLoading}
          getRowId={(row) => row.creditId}
          checkboxSelection
          disableRowSelectionOnClick
          onRowSelectionModelChange={(newSelectionModel) => {
            setSelectionModel(newSelectionModel);
          }}
          rowSelectionModel={selectionModel}
          initialState={{
            sorting: {
              sortModel: [{ field: "billedDate", sort: "desc" }],
            },
          }}
          hideFooter
          sx={{
            border: 0,
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "#F9FAFB",
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
