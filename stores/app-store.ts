import { create } from "zustand";

interface AppState {
  sidebarOpen: boolean;
  activeModel: string;
  toggleSidebar: () => void;
  setActiveModel: (model: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  sidebarOpen: true,
  activeModel: "gpt-4o",
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setActiveModel: (activeModel) => set({ activeModel }),
}));
