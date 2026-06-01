import { create } from 'zustand';
import type { User } from './types';

interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

const getSavedUser = (): User | null => {
  if (typeof window === 'undefined') return null;

  try {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const savedUser = getSavedUser();

export const useUserStore = create<UserState>((set) => ({
  user: savedUser,
  isAuthenticated: !!savedUser,
  isLoading: false,

  setUser: (user) => {
    if (typeof window !== 'undefined') {
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
      } else {
        localStorage.removeItem('user');
      }
    }

    set({
      user,
      isAuthenticated: !!user,
      isLoading: false,
    });
  },

  setLoading: (loading) => set({ isLoading: loading }),

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
      localStorage.removeItem('authToken');
    }

    set({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  },
}));