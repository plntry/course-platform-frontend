import { create } from "zustand";
import { AuthUser } from "../models/User";
import { authApi } from "../api/auth";

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  setUser: (user: AuthUser | null) => void;
  checkAuth: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,

  setUser: (user) => set({ user, isAuthenticated: !!user }),

  checkAuth: async () => {
    try {
      const { data } = await authApi.getToken();
      set({ user: data, isAuthenticated: true });
    } catch (error: any) {
      if (error.response?.status === 401) {
        try {
          await authApi.refreshToken();

          const { data } = await authApi.getToken();
          set({ user: data, isAuthenticated: true });
        } catch {
          set({ user: null, isAuthenticated: false });
        }
      }
    }
  },

  logout: async () => {
    await authApi.logout();
    set({ user: null, isAuthenticated: false });
  },
}));
