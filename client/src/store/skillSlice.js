import { create } from "zustand";
import * as skillProfileService from "../services/skillProfileService";

export const useSkillStore = create((set) => ({
  profile: null,
  history: {},
  weakTopics: [],
  loading: false,
  fetchProfile: async (userId) => {
    set({ loading: true });
    try {
      const profile = await skillProfileService.getSkillProfile(userId);
      set({ profile, loading: false });
    } catch {
      set({ loading: false });
    }
  },
  fetchHistory: async (userId, topic) => {
    set({ loading: true });
    try {
      const topicHistory = await skillProfileService.getSkillHistory(userId, topic);
      set((state) => ({ history: { ...state.history, [topic]: topicHistory }, loading: false }));
    } catch {
      set({ loading: false });
    }
  },
  fetchWeakTopics: async (userId) => {
    set({ loading: true });
    try {
      const weakTopics = await skillProfileService.getWeakestTopics(userId);
      set({ weakTopics, loading: false });
    } catch {
      set({ loading: false });
    }
  },
}));
