import { create } from 'zustand';

interface ConfirmState {
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    openConfirm: (options: { title: string; message: string; onConfirm: () => void }) => void;
    closeConfirm: () => void;
}

export const useConfirmStore = create<ConfirmState>((set) => ({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => { },
    openConfirm: ({ title, message, onConfirm }) =>
        set({ isOpen: true, title, message, onConfirm }),
    closeConfirm: () => set({ isOpen: false }),
}));
