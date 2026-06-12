import { create } from "zustand";
import * as memoryService from "../services/memoryService";

export const useMemoryStore = create((set) => ({
  memory: null,
  loading: false,
  error: null,
  fetchMemory: async (userId) => {
    set({ loading: true, error: null });
    try {
      const memory = await memoryService.getMemory(userId);
      set({ memory, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },
  resetMemory: async (userId) => {
    set({ loading: true, error: null });
    try {
      await memoryService.resetMemory(userId);
      set({ memory: null, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },
  clearMemory: () => set({ memory: null, loading: false, error: null }),
}));
