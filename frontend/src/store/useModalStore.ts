import { create } from 'zustand';
import type { Transaction } from '../types';

interface ModalState {
    isOpen: boolean;
    editingTransaction: Transaction | null;
    transactionType: "normal" | "credit";
    openModal: (tx?: Transaction, type?: "normal" | "credit") => void;
    closeModal: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
    isOpen: false,
    editingTransaction: null,
    transactionType: "normal",
    openModal: (tx?: Transaction, type: "normal" | "credit" = "normal") =>
        set({ isOpen: true, editingTransaction: tx || null, transactionType: type }),
    closeModal: () => set({ isOpen: false, editingTransaction: null, transactionType: "normal" }),
}));
