import { create } from 'zustand';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export interface UserProfile {
  id: string;
  email: string;
  username: string;
  avatar_url: string | null;
  created_at: string;
}

interface AuthState {
  user: UserProfile | null;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;

  initialize: () => Promise<void>;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, username: string) => Promise<boolean>;
  loginWithGitHub: () => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

// Mock user for demo/offline mode
function getMockUser(): UserProfile | null {
  const saved = localStorage.getItem('tarot-mock-user');
  if (saved) {
    try { return JSON.parse(saved); } catch { return null; }
  }
  return null;
}

function saveMockUser(user: UserProfile | null) {
  if (user) {
    localStorage.setItem('tarot-mock-user', JSON.stringify(user));
  } else {
    localStorage.removeItem('tarot-mock-user');
  }
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  isInitialized: false,
  error: null,

  initialize: async () => {
    if (!isSupabaseConfigured()) {
      // Offline mode: check localStorage
      const mockUser = getMockUser();
      set({ user: mockUser, isInitialized: true, isLoading: false });
      return;
    }

    try {
      set({ isLoading: true });
      const { data: { session } } = await supabase!.auth.getSession();
      if (session?.user) {
        const profile: UserProfile = {
          id: session.user.id,
          email: session.user.email || '',
          username: session.user.user_metadata?.username || session.user.email?.split('@')[0] || '占卜师',
          avatar_url: session.user.user_metadata?.avatar_url || null,
          created_at: session.user.created_at,
        };
        set({ user: profile });
      }
    } catch (e) {
      console.warn('Auth initialization failed:', e);
    } finally {
      set({ isInitialized: true, isLoading: false });
    }
  },

  login: async (email: string, password: string): Promise<boolean> => {
    if (!isSupabaseConfigured()) {
      // Offline mock login
      const mockUser: UserProfile = {
        id: 'mock-' + Date.now(),
        email,
        username: email.split('@')[0],
        avatar_url: null,
        created_at: new Date().toISOString(),
      };
      saveMockUser(mockUser);
      set({ user: mockUser, error: null });
      return true;
    }

    try {
      set({ isLoading: true, error: null });
      const { data, error } = await supabase!.auth.signInWithPassword({ email, password });
      if (error) {
        set({ error: error.message, isLoading: false });
        return false;
      }
      if (data.user) {
        const profile: UserProfile = {
          id: data.user.id,
          email: data.user.email || '',
          username: data.user.user_metadata?.username || data.user.email?.split('@')[0] || '占卜师',
          avatar_url: data.user.user_metadata?.avatar_url || null,
          created_at: data.user.created_at,
        };
        set({ user: profile, isLoading: false });
        return true;
      }
      return false;
    } catch (e) {
      set({ error: '登录失败，请重试', isLoading: false });
      console.error(e);
      return false;
    }
  },

  signup: async (email: string, password: string, username: string): Promise<boolean> => {
    if (!isSupabaseConfigured()) {
      // Offline mock signup
      const mockUser: UserProfile = {
        id: 'mock-' + Date.now(),
        email,
        username,
        avatar_url: null,
        created_at: new Date().toISOString(),
      };
      saveMockUser(mockUser);
      set({ user: mockUser, error: null });
      return true;
    }

    try {
      set({ isLoading: true, error: null });
      const { data, error } = await supabase!.auth.signUp({
        email,
        password,
        options: { data: { username } },
      });
      if (error) {
        set({ error: error.message, isLoading: false });
        return false;
      }
      if (data.user) {
        const profile: UserProfile = {
          id: data.user.id,
          email: data.user.email || '',
          username,
          avatar_url: null,
          created_at: data.user.created_at,
        };
        set({ user: profile, isLoading: false });
        return true;
      }
      return false;
    } catch (e) {
      set({ error: '注册失败，请重试', isLoading: false });
      console.error(e);
      return false;
    }
  },

  loginWithGitHub: async () => {
    if (!isSupabaseConfigured()) {
      set({ error: 'GitHub 登录需要配置 Supabase' });
      return;
    }
    try {
      await supabase!.auth.signInWithOAuth({
        provider: 'github',
        options: { redirectTo: window.location.origin + '/tarot/auth/callback' },
      });
    } catch (e) {
      set({ error: 'GitHub 登录失败' });
      console.error(e);
    }
  },

  logout: async () => {
    if (isSupabaseConfigured()) {
      await supabase!.auth.signOut();
    }
    saveMockUser(null);
    set({ user: null, error: null });
  },

  clearError: () => set({ error: null }),
}));
