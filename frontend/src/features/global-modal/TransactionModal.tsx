import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { format, getISOWeek } from "date-fns";
import { X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useModalStore } from "../../store/useModalStore";

import { useCategoryStore } from "../../store/useCategoryStore";
import type { CreateTransactionPayload } from "../../types";
import { useCreateTransaction } from "../transactions/hooks/useCreateTransaction.ts";
import { useUpdateTransaction } from "../transactions/hooks/useUpdateTransaction.ts";

export const TransactionModal: React.FC = () => {
  const { isOpen, closeModal, editingTransaction, transactionType } =
    useModalStore();
  const { categories, fetchCategories } = useCategoryStore();

  const activeType = transactionType;

  const createTxMutation = useCreateTransaction();
  const updateTxMutation = useUpdateTransaction();

  const [date, setDate] = useState<Date | null>(new Date());
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [amount, setAmount] = useState<number>();
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
      setErrors({});
      if (editingTransaction) {
        setDate(new Date(editingTransaction.date));
        setCategoryId(editingTransaction.categoryId || null);
        setAmount(editingTransaction.amount);
        setDescription(editingTransaction.description || "");
      } else {
        setDate(new Date());
        setCategoryId(null);
        setAmount(0);
        setDescription("");
      }
    }
  }, [isOpen, editingTransaction]);

  const handleClose = () => {
    setErrors({});
    closeModal();
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!date) newErrors.date = "Date is required";
    if (!categoryId) newErrors.categoryId = "Category is required";
    if (!amount || Number(amount) <= 0)
      newErrors.amount = "Amount must be greater than 0";
    if (!description.trim()) newErrors.description = "Description is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const payload: CreateTransactionPayload = {
      type: activeType,
      date: date!.toISOString(),
      amount: Math.round(Number(amount)),
      categoryId: categoryId as number,
      description: description.trim(),
    };

    if (editingTransaction) {
      updateTxMutation.mutate(
        { id: editingTransaction.transactionId, payload },
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
      }}
    >
      <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
        <DialogTitle className="!p-0 !text-xl !font-bold">
          {editingTransaction ? "Edit Transaction" : "Add Transaction"}
        </DialogTitle>
        <IconButton onClick={handleClose} size="small">
          <X size={20} />
        </IconButton>
      </div>

      <form onSubmit={onSubmit}>
        <DialogContent className="space-y-6 !p-6">
          <div className="grid grid-cols-2 gap-4">
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Transaction Date"
                value={date}
                onChange={(newDate) => setDate(newDate)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: !!errors.date,
                    helperText: errors.date,
                    sx: { gridColumn: "span 2" },
                  },
                }}
              />
            </LocalizationProvider>

            <FormControl fullWidth error={!!errors.categoryId}>
              <InputLabel id="category-select-label">Category</InputLabel>
              <Select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value as number)}
                labelId="category-select-label"
                label="Category"
              >
                {categories.map((cat) => (
                  <MenuItem key={cat.categoryId} value={cat.categoryId}>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: cat.categoryColorCode }}
                      />
                      {cat.categoryName}
                    </div>
                  </MenuItem>
                ))}
              </Select>
              {errors.categoryId && (
                <FormHelperText>{errors.categoryId}</FormHelperText>
              )}
            </FormControl>

            <TextField
              type="number"
              label="Amount ($)"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              fullWidth
              error={!!errors.amount}
              helperText={errors.amount}
            />
          </div>

          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            multiline
            rows={4}
            error={!!errors.description}
            helperText={errors.description}
          />

          <div className="bg-slate-100/80 p-5 rounded-2xl flex flex-col gap-4 !mt-6 border border-slate-200 shadow-sm">
            <TextField
              label="Day Name"
              value={date ? format(date, "EEEE") : ""}
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
                value={date ? getISOWeek(date) : ""}
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
                value={date ? format(date, "MMM-yyyy") : ""}
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
          <Button
            onClick={handleClose}
            variant="outlined"
            color="inherit"
            className="border-2"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={createTxMutation.isPending || updateTxMutation.isPending}
            className="!rounded-xl"
          >
            {createTxMutation.isPending || updateTxMutation.isPending
              ? "Saving..."
              : "Save Transaction"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
