import React, { useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  IconButton,
} from "@mui/material";
import { X } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format, getISOWeek } from "date-fns";
import { useModalStore } from "../../store/useModalStore";

// Date picker components from MUI x-date-pickers
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import { useCreateTransaction } from "../transactions/hooks/useCreateTransaction.ts";
import { useUpdateTransaction } from "../transactions/hooks/useUpdateTransaction.ts";
import { useCategoryStore } from "../../store/useCategoryStore";
import type { CreateTransactionPayload } from "../../types";

const schema = z.object({
  date: z.date({ message: "Date is required" }),
  categoryId: z.string().min(1, "Category is required"),
  amount: z.number().min(0.01, "Amount must be greater than 0"),
  description: z.string().min(1, "Description is required"),
});

type FormData = z.infer<typeof schema>;

export const TransactionModal: React.FC = () => {
  const { isOpen, closeModal, editingTransaction, transactionType } =
    useModalStore();
  const { categories } = useCategoryStore();

  const activeType = editingTransaction
    ? editingTransaction.type
    : transactionType;

  const createTxMutation = useCreateTransaction();
  const updateTxMutation = useUpdateTransaction();

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      date: new Date(),
      categoryId: "",
      amount: 0,
      description: "",
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (editingTransaction) {
        reset({
          date: new Date(editingTransaction.date),
          categoryId: editingTransaction.categoryId,
          amount: editingTransaction.amount,
          description: editingTransaction.description || "",
        });
      } else {
        const now = new Date();
        reset({
          date: now,
          categoryId: "",
          amount: undefined,
          description: "",
        });
      }
    }
  }, [isOpen, editingTransaction, reset]);

  const handleClose = () => {
    reset();
    closeModal();
  };

  const calculateDerivedDates = (newDate: Date | null) => {
    if (!newDate) return;
    setValue("date", newDate, { shouldValidate: true });
  };

  const onSubmit = (data: FormData) => {
    const payload: CreateTransactionPayload = {
      type: activeType || "Normal",
      date: data.date.toISOString(),
      amount: Math.round(data.amount),
      categoryId: data.categoryId,
      description: data.description,
    };

    if (editingTransaction) {
      updateTxMutation.mutate(
        { id: editingTransaction.id, payload },
        {
          onSuccess: () => {
            handleClose();
          },
        },
      );
    } else {
      createTxMutation.mutate(payload, {
        onSuccess: () => {
          handleClose();
        },
      });
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: "16px", overflow: "visible" },
      }}>
      <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
        <DialogTitle className="!p-0 !text-xl !font-bold">
          {editingTransaction ? "Edit Transaction" : "Add Transaction"}
        </DialogTitle>
        <IconButton onClick={handleClose} size="small">
          <X size={20} />
        </IconButton>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent className="space-y-6 !p-6">
          <div className="grid grid-cols-2 gap-4">
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <Controller
                name="date"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    label="Transaction Date"
                    value={field.value}
                    onChange={(date) => {
                      field.onChange(date);
                      calculateDerivedDates(date);
                    }}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!errors.date,
                        helperText: errors.date?.message,
                        sx: { gridColumn: "span 2" },
                      },
                    }}
                  />
                )}
              />
            </LocalizationProvider>

            <Controller
              name="categoryId"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  label="Category"
                  fullWidth
                  error={!!errors.categoryId}
                  helperText={errors.categoryId?.message}>
                  {categories
                    .filter((c) => c.categoryType === activeType)
                    .map((cat) => (
                      <MenuItem key={cat.id} value={cat.id}>
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: cat.categoryColorCode }}
                          />
                          {cat.categoryName}
                        </div>
                      </MenuItem>
                    ))}
                </TextField>
              )}
            />

            <Controller
              name="amount"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="number"
                  label="Amount ($)"
                  fullWidth
                  error={!!errors.amount}
                  helperText={errors.amount?.message}
                  onChange={(e) =>
                    field.onChange(parseFloat(e.target.value) || "")
                  }
                />
              )}
            />
          </div>

          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Description"
                fullWidth
                multiline
                rows={4}
                error={!!errors.description}
                helperText={errors.description?.message}
              />
            )}
          />

          <div className="bg-slate-100/80 p-5 rounded-2xl flex flex-col gap-4 !mt-6 border border-slate-200 shadow-sm">
            <TextField
              label="Day Name"
              value={watch("date") ? format(watch("date"), "EEEE") : ""}
              disabled
              fullWidth
              size="small"
              sx={{
                "& .MuiInputBase-input.Mui-disabled": {
                  WebkitTextFillColor: "#475569",
                },
              }}
            />
            <div className="flex gap-4">
              <TextField
                label="Week Number"
                value={watch("date") ? getISOWeek(watch("date")) : ""}
                disabled
                fullWidth
                size="small"
                sx={{
                  "& .MuiInputBase-input.Mui-disabled": {
                    WebkitTextFillColor: "#475569",
                  },
                }}
              />
              <TextField
                label="Month Year"
                value={watch("date") ? format(watch("date"), "MMM-yyyy") : ""}
                disabled
                fullWidth
                size="small"
                sx={{
                  "& .MuiInputBase-input.Mui-disabled": {
                    WebkitTextFillColor: "#475569",
                  },
                }}
              />
            </div>
          </div>
        </DialogContent>

        <DialogActions className="px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
          <Button onClick={handleClose} color="inherit">
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={createTxMutation.isPending || updateTxMutation.isPending}
            className="!rounded-xl">
            {createTxMutation.isPending || updateTxMutation.isPending
              ? "Saving..."
              : "Save Transaction"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
