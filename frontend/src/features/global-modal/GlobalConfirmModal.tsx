import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
} from "@mui/material";
import { X, AlertTriangle } from "lucide-react";
import { useConfirmStore } from "../../store/useConfirmStore";

export const GlobalConfirmModal: React.FC = () => {
  const { isOpen, closeConfirm, title, message, onConfirm } = useConfirmStore();

  const handleConfirm = () => {
    onConfirm();
    closeConfirm();
  };

  return (
    <Dialog
      open={isOpen}
      onClose={closeConfirm}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: { borderRadius: "16px" },
      }}>
      <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
        <DialogTitle className="!p-0 !text-lg !font-bold flex items-center gap-2 text-gray-800">
          <AlertTriangle className="text-red-500" size={24} />
          {title}
        </DialogTitle>
        <IconButton onClick={closeConfirm} size="small">
          <X size={20} />
        </IconButton>
      </div>

      <DialogContent className="!p-6 text-gray-600">{message}</DialogContent>

      <DialogActions className="px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl gap-2">
        <Button onClick={closeConfirm} color="inherit" className="!font-medium">
          Cancel
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          className="!bg-red-500 hover:!bg-red-600 !rounded-xl text-white shadow-sm">
          Confirm Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};
