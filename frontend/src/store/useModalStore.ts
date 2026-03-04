import { create } from 'zustand';
import { TransactionTypes, type TransactionType } from '../types';

interface ModalState {
    isOpen: boolean;
    editingTransaction: Record<string, any> | null;
    transactionType: TransactionType;
    openModal: (tx?: Record<string, any>, type?: TransactionType) => void;
    closeModal: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
    isOpen: false,
    editingTransaction: null,
    transactionType: TransactionTypes.Normal,
    openModal: (tx?: Record<string, any>, type: TransactionType = TransactionTypes.Normal) =>
        set({ isOpen: true, editingTransaction: tx || null, transactionType: type }),
    closeModal: () => set({ isOpen: false, editingTransaction: null, transactionType: TransactionTypes.Normal }),
}));
