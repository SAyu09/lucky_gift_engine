// src/store/useUIStore.ts
import { create } from 'zustand';

interface UIState {
    isSidebarOpen: boolean;
    activeModal: string | null;

    toggleSidebar: () => void;
    setSidebarOpen: (isOpen: boolean) => void;

    openModal: (modalId: string) => void;
    closeModal: () => void;
}

export const useUIStore = create<UIState>((set) => ({
    isSidebarOpen: true, // Default open on desktop
    activeModal: null,

    toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),

    setSidebarOpen: (isOpen: boolean) => set({ isSidebarOpen: isOpen }),

    openModal: (modalId: string) => set({ activeModal: modalId }),

    closeModal: () => set({ activeModal: null }),
}));
