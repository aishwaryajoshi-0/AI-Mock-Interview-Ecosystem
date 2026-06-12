import { create } from "zustand";
import * as recommendationService from "../services/recommendationService";

export const useRecommendationStore = create((set, get) => ({
  recommendations: [],
  history: [],
  loading: false,
  error: null,
  fetchRecommendations: async (userId) => {
    set({ loading: true, error: null });
    try {
      const recommendations = await recommendationService.getRecommendations(userId);
      set({ recommendations, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },
  fetchHistory: async (userId) => {
    set({ loading: true, error: null });
    try {
      const history = await recommendationService.getHistory(userId);
      set({ history, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },
  markResourceDone: async (recId, idx) => {
    const updated = await recommendationService.markResourceComplete(recId, idx);
    set({ recommendations: get().recommendations.map((rec) => (rec._id === recId ? updated : rec)) });
  },
  markTaskDone: async (recId, day) => {
    const updated = await recommendationService.markTaskComplete(recId, day);
    set({ recommendations: get().recommendations.map((rec) => (rec._id === recId ? updated : rec)) });
  },
}));
