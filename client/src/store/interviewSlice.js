// MODIFIED
import { create } from "zustand";

export const useInterviewStore = create((set) => ({
  sessions: [],
  currentSession: null,
  feedback: null,
  // NEW: Company Intelligence
  targetCompany: null,
  targetRole: null,
  companyProfile: null,
  // NEW: Adaptive Difficulty + Follow-Up Question Engine
  currentDifficulty: "medium",
  pendingFollowUp: null,
  followUpHistory: [],
  setSessions: (sessions) => set({ sessions }),
  setCurrentSession: (session) => set({ currentSession: session }),
  setFeedback: (feedback) => set({ feedback }),
  setCompanyTarget: (company, role, profile) =>
    set({ targetCompany: company, targetRole: role, companyProfile: profile }),
  setDifficulty: (currentDifficulty) => set({ currentDifficulty }),
  setPendingFollowUp: (pendingFollowUp) => set({ pendingFollowUp }),
  clearFollowUp: () => set({ pendingFollowUp: null }),
  addFollowUpHistory: (followUp) =>
    set((state) => ({ followUpHistory: [...state.followUpHistory, followUp] })),
  resetInterviewState: () =>
    set({
      currentSession: null,
      feedback: null,
      pendingFollowUp: null,
      followUpHistory: [],
      currentDifficulty: "medium",
    }),
}));
