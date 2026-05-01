import { create } from 'zustand';

interface User {
  id: string;
  email: string;
  username: string;
  role?: string;
  vip_status?: number;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isOwner: boolean;
  isVip: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  initialize: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isAdmin: false,
  isOwner: false,
  isVip: false,

  setAuth: (user, token) => {
    localStorage.setItem('biolink_token', token);
    localStorage.setItem('biolink_user', JSON.stringify(user));
    set({ 
      user, 
      token, 
      isAuthenticated: true,
      isAdmin: user.role === 'admin' || user.role === 'owner',
      isOwner: user.role === 'owner',
      isVip: user.vip_status === 1 || user.role === 'owner'
    });
  },

  logout: () => {
    localStorage.removeItem('biolink_token');
    localStorage.removeItem('biolink_user');
    set({ user: null, token: null, isAuthenticated: false, isAdmin: false, isOwner: false, isVip: false });
  },

  initialize: () => {
    const token = localStorage.getItem('biolink_token');
    const userStr = localStorage.getItem('biolink_user');
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        set({ 
          user, 
          token, 
          isAuthenticated: true,
          isAdmin: user.role === 'admin' || user.role === 'owner',
          isOwner: user.role === 'owner',
          isVip: user.vip_status === 1 || user.role === 'owner'
        });
      } catch {
        localStorage.removeItem('biolink_token');
        localStorage.removeItem('biolink_user');
      }
    }
  }
}));
