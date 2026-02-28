import React from "react";
import { Fab } from "@mui/material";
import { Plus } from "lucide-react";
import { useModalStore } from "../../store/useModalStore";
import { useLocation } from "react-router-dom";

export const GlobalFAB: React.FC = () => {
  const location = useLocation();
  const openModal = useModalStore((state) => state.openModal);

  const isCreditPage = location.pathname === "/credit";
  const handleOpen = () => {
    openModal(undefined, isCreditPage ? "Credit" : "Normal");
  };

  return (
    <Fab
      variant="extended"
      color="primary"
      aria-label="add transaction"
      onClick={handleOpen}
      className="group"
      sx={{
        position: "fixed",
        top: 32,
        right: 32,
        height: 56,
        minWidth: 56,
        borderRadius: 28,
        padding: 0,
        boxShadow: "0 8px 24px rgba(185, 255, 102, 0.4)",
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        "&.MuiFab-extended": {
          paddingLeft: "16px",
          paddingRight: "16px",
        },
      }}>
      <Plus size={24} className="text-secondary-main shrink-0" />
      <span className="text-secondary-main font-bold whitespace-nowrap overflow-hidden transition-all duration-300 w-0 opacity-0 group-hover:w-[124px] group-hover:opacity-100 group-hover:ml-2 text-sm">
        {isCreditPage ? "Add Credit Tx" : "Add Transaction"}
      </span>
    </Fab>
  );
};
