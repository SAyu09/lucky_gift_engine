// src/store/useUIStore.ts
import { create } from "zustand";

interface UIState {
  isSidebarOpen: boolean;
  activeModal: string | null;
  theme: "light" | "dark";

  toggleSidebar: () => void;
  setSidebarOpen: (isOpen: boolean) => void;

  openModal: (modalId: string) => void;
  closeModal: () => void;

  toggleTheme: () => void;
  setTheme: (theme: "light" | "dark") => void;
}

export const useUIStore = create<UIState>((set) => ({
  isSidebarOpen: true,
  activeModal: null,
  theme: "dark", // Default theme

  toggleSidebar: () =>
    set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),

  setSidebarOpen: (isOpen: boolean) => set({ isSidebarOpen: isOpen }),

  openModal: (modalId: string) => set({ activeModal: modalId }),

  closeModal: () => set({ activeModal: null }),

  toggleTheme: () =>
    set((state) => {
      const newTheme = state.theme === "dark" ? "light" : "dark";
      if (typeof window !== "undefined") {
        localStorage.setItem("theme", newTheme);
      }
      return { theme: newTheme };
    }),

  setTheme: (theme: "light" | "dark") => {
    if (typeof window !== "undefined") {
      localStorage.setItem("theme", theme);
    }
    set({ theme });
  },
}));
