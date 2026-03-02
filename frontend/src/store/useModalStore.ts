import { create } from 'zustand';
import { TransactionTypes, type Transaction, type TransactionType } from '../types';

interface ModalState {
    isOpen: boolean;
    editingTransaction: Transaction | null;
    transactionType: TransactionType;
    openModal: (tx?: Transaction, type?: TransactionType) => void;
    closeModal: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
    isOpen: false,
    editingTransaction: null,
    transactionType: TransactionTypes.Normal,
    openModal: (tx?: Transaction, type: TransactionType = TransactionTypes.Normal) =>
        set({ isOpen: true, editingTransaction: tx || null, transactionType: type }),
    closeModal: () => set({ isOpen: false, editingTransaction: null, transactionType: TransactionTypes.Normal }),
}));
