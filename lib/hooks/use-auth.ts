"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { loginAPI, type AuthResponse } from '@/lib/api/auth-service';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  name: string; // ← Ajouter ce champ
  role: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });

        try {
          const response: AuthResponse = await loginAPI({ email, password });

          // Formater le user avec le champ name
          const user: User = {
            ...response.user,
            name: `${response.user.firstName} ${response.user.lastName}`,
          };

          set({
            user,
            token: response.token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });

          localStorage.setItem('auth_token', response.token);

          return true;
        } catch (error: any) {
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: error.message || 'Erreur de connexion',
          });
          return false;
        }
      },

      logout: () => {
        localStorage.removeItem('auth_token');
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        });
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
