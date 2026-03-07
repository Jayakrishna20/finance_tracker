import { create } from "zustand";

interface CreditModalState {
  isOpen: boolean;
  editingCredit: Record<string, any> | null;
  openModal: (credit?: Record<string, any>) => void;
  closeModal: () => void;
}

export const useCreditModalStore = create<CreditModalState>((set) => ({
  isOpen: false,
  editingCredit: null,
  openModal: (credit?: Record<string, any>) =>
    set({
      isOpen: true,
      editingCredit: credit || null,
    }),
  closeModal: () =>
    set({
      isOpen: false,
      editingCredit: null,
    }),
}));
