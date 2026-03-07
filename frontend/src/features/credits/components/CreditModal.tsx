import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { addMonths, setDate as setDateFn } from "date-fns";
import { useEffect, useState } from "react";
import { useCategoryStore } from "../../../store/useCategoryStore";
import type { CreateCreditPayload } from "../../../types";
import { useCreateCredit, useUpdateCredit } from "../hooks/useCreditHooks";
import { useCreditModalStore } from "../store/useCreditModalStore";

export const CreditModal: React.FC = () => {
  const { isOpen, closeModal, editingCredit } = useCreditModalStore();
  const { categories, fetchCategories } = useCategoryStore();

  const createCreditMutation = useCreateCredit();
  const updateCreditMutation = useUpdateCredit();

  const [paymentDate, setPaymentDate] = useState<Date | null>(null);
  const [billedDate, setBilledDate] = useState<Date | null>(null);
  const [lastPaymentDate, setLastPaymentDate] = useState<Date | null>(null);

  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [amount, setAmount] = useState<number>();
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
      setErrors({});
      if (editingCredit) {
        setPaymentDate(
          editingCredit.paymentDate
            ? new Date(editingCredit.paymentDate)
            : null,
        );
        setBilledDate(
          editingCredit.billedDate ? new Date(editingCredit.billedDate) : null,
        );
        setLastPaymentDate(
          editingCredit.lastPaymentDate
            ? new Date(editingCredit.lastPaymentDate)
            : null,
        );
        setCategoryId(editingCredit.categoryId || null);
        setAmount(editingCredit.amount);
        setDescription(editingCredit.description || "");
      } else {
        setPaymentDate(null);
        setBilledDate(null);
        setLastPaymentDate(null);
        setCategoryId(null);
        setAmount(0);
        setDescription("");
      }
    }
  }, [isOpen, editingCredit, fetchCategories]);

  const handlePaymentDateChange = (newDate: Date | null) => {
    setPaymentDate(newDate);

    if (newDate) {
      const nextMonth = addMonths(newDate, 1);
      const newBilledDate = setDateFn(nextMonth, 15);
      setBilledDate(newBilledDate);

      const monthAfterBilled = addMonths(newBilledDate, 1);
      const newLastPaymentDate = setDateFn(monthAfterBilled, 4);
      setLastPaymentDate(newLastPaymentDate);
    } else {
      setBilledDate(null);
      setLastPaymentDate(null);
    }
  };

  const handleClose = () => {
    setErrors({});
    closeModal();
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!paymentDate) newErrors.paymentDate = "Payment Date is required";
    if (!billedDate) newErrors.billedDate = "Billed Date is required";
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

    const payload: CreateCreditPayload = {
      billedDate: billedDate!.toISOString(),
      lastPaymentDate: lastPaymentDate!.toISOString(),
      paymentDate: paymentDate!.toISOString(),
      amount: Math.round(Number(amount)),
      categoryId: categoryId as number,
      description: description.trim(),
      paidStatus: editingCredit ? editingCredit.paidStatus : false,
    };

    if (editingCredit) {
      updateCreditMutation.mutate(
        { id: editingCredit.creditId, payload },
        {
          onSuccess: () => {
            handleClose();
          },
        },
      );
    } else {
      createCreditMutation.mutate(payload, {
        onSuccess: () => {
          handleClose();
        },
      });
    }
  };

  const disableDatesOtherThan15th = (date: Date) => {
    return date.getDate() !== 15;
  };

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          sx: { borderRadius: "16px", overflow: "visible" },
        },
      }}
    >
      <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
        <DialogTitle className="!p-0 !text-xl !font-bold">
          {editingCredit ? "Edit Credit Log" : "Add Credit Log"}
        </DialogTitle>
      </div>

      <form onSubmit={onSubmit}>
        <DialogContent className="space-y-6 !p-6">
          <div className="grid grid-cols-2 gap-4">
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Payment Date"
                value={paymentDate}
                onChange={handlePaymentDateChange}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: !!errors.paymentDate,
                    helperText: errors.paymentDate,
                    sx: { gridColumn: "span 2" },
                  },
                }}
              />

              <DatePicker
                label="Billed Date"
                value={billedDate}
                shouldDisableDate={disableDatesOtherThan15th}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: !!errors.billedDate,
                    helperText: errors.billedDate,
                  },
                }}
              />

              <DatePicker
                label="Last Payment Date"
                value={lastPaymentDate}
                slotProps={{
                  textField: {
                    fullWidth: true,
                  },
                }}
              />
            </LocalizationProvider>

            <FormControl fullWidth error={!!errors.categoryId}>
              <InputLabel id="credit-category-select-label">
                Category
              </InputLabel>
              <Select
                value={categoryId || ""}
                onChange={(e) => setCategoryId(e.target.value as number)}
                labelId="credit-category-select-label"
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
              value={amount || ""}
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
            disabled={
              createCreditMutation.isPending || updateCreditMutation.isPending
            }
            className="!rounded-xl"
          >
            {createCreditMutation.isPending || updateCreditMutation.isPending
              ? "Saving..."
              : "Save Credit Log"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
