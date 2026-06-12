import { create } from "zustand";

export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  setAuthState: (user, token) => set({ user, token }),
  clearAuth: () => set({ user: null, token: null }),
}));
