import { create } from "zustand";
import api from "../api";
import { authApi } from "../api/auth";

interface User {
  id: number;
  email: string;
  role: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
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
    await api.post("/auth/logout");
    set({ user: null, isAuthenticated: false });
  },
}));
