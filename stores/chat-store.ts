import { create } from "zustand";

interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  createdAt: Date;
}

interface ChatState {
  messages: Message[];
  isLoading: boolean;
  currentSessionId: string | null;
  addMessage: (message: Message) => void;
  setLoading: (loading: boolean) => void;
  setSessionId: (id: string | null) => void;
  clearMessages: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  isLoading: false,
  currentSessionId: null,
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
  setLoading: (isLoading) => set({ isLoading }),
  setSessionId: (currentSessionId) => set({ currentSessionId }),
  clearMessages: () => set({ messages: [] }),
}));
