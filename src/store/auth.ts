import { create } from 'zustand';

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
  checkAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  isAuthenticated: false,
  
  login: (token: string) => {
    localStorage.setItem('pdf-agent-token', token);
    set({ token, isAuthenticated: true });
  },
  
  logout: () => {
    localStorage.removeItem('pdf-agent-token');
    set({ token: null, isAuthenticated: false });
  },
  
  checkAuth: () => {
    const token = localStorage.getItem('pdf-agent-token');
    if (token) {
      set({ token, isAuthenticated: true });
    }
  },
}));