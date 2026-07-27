import { create } from 'zustand';

interface AdminState {
  isAuthenticated: boolean;
  token: string | null;
  activeTab: string;
  login: (token: string) => void;
  logout: () => void;
  setActiveTab: (tab: string) => void;
  checkSession: () => boolean;
}

export const useAdminStore = create<AdminState>((set, get) => ({
  isAuthenticated: false,
  token: null,
  activeTab: 'overview',

  login: (token: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('nc-admin-token', token);
      localStorage.setItem('nc-admin-login-time', Date.now().toString());
    }
    set({ isAuthenticated: true, token, activeTab: 'overview' });
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('nc-admin-token');
      localStorage.removeItem('nc-admin-login-time');
    }
    set({ isAuthenticated: false, token: null, activeTab: 'overview' });
  },

  setActiveTab: (tab: string) => {
    set({ activeTab: tab });
  },

  checkSession: () => {
    if (typeof window === 'undefined') return false;
    const token = localStorage.getItem('nc-admin-token');
    const loginTime = localStorage.getItem('nc-admin-login-time');
    if (!token || !loginTime) return false;
    
    // 8 hour session expiry
    const elapsed = Date.now() - parseInt(loginTime);
    if (elapsed > 8 * 60 * 60 * 1000) {
      get().logout();
      return false;
    }
    
    set({ isAuthenticated: true, token });
    return true;
  },
}));
