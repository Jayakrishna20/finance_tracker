import { create } from "zustand";

interface CreditModalState {
  isOpen: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  editingCredit: Record<string, any> | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
