import { create } from "zustand";

interface ModalState {
  isOpen: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  editingTransaction: Record<string, any> | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  openModal: (tx?: Record<string, any>) => void;
  closeModal: () => void;
}

export const useTransactionModalStore = create<ModalState>((set) => ({
  isOpen: false,
  editingTransaction: null,
  openModal: (tx?: Record<string, any>) =>
    set({
      isOpen: true,
      editingTransaction: tx || null,
    }),
  closeModal: () =>
    set({
      isOpen: false,
      editingTransaction: null,
    }),
}));
