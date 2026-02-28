import { create } from 'zustand';
import type { Transaction } from '../types';

interface ModalState {
    isOpen: boolean;
    editingTransaction: Transaction | null;
    transactionType: "Normal" | "Credit";
    openModal: (tx?: Transaction, type?: "Normal" | "Credit") => void;
    closeModal: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
    isOpen: false,
    editingTransaction: null,
    transactionType: "Normal",
    openModal: (tx?: Transaction, type: "Normal" | "Credit" = "Normal") =>
        set({ isOpen: true, editingTransaction: tx || null, transactionType: type }),
    closeModal: () => set({ isOpen: false, editingTransaction: null, transactionType: "Normal" }),
}));
