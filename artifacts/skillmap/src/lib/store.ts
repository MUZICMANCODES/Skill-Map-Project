import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserProfile, RecommendationResult } from '@workspace/api-client-react';

interface AuthState {
  user: { name: string; email: string } | null;
  login: (name: string, email: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      login: (name, email) => set({ user: { name, email } }),
      logout: () => set({ user: null }),
    }),
    {
      name: 'skillmap-auth',
    }
  )
);

interface ResultState {
  profile: UserProfile | null;
  results: RecommendationResult | null;
  setResults: (profile: UserProfile, results: RecommendationResult) => void;
  clearResults: () => void;
}

export const useResultStore = create<ResultState>()(
  persist(
    (set) => ({
      profile: null,
      results: null,
      setResults: (profile, results) => set({ profile, results }),
      clearResults: () => set({ profile: null, results: null }),
    }),
    {
      name: 'skillmap-results',
    }
  )
);
