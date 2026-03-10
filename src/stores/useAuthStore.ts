import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

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

async function fetchOrCreateProfile(user: User): Promise<UserProfile> {
  // Try to fetch existing profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (profile) {
    return {
      id: profile.id,
      email: profile.email || user.email || '',
      username: profile.username || user.user_metadata?.username || user.email?.split('@')[0] || '占卜师',
      avatar_url: profile.avatar_url || user.user_metadata?.avatar_url || null,
      created_at: profile.created_at,
    };
  }

  // Profile doesn't exist yet — create one
  const username = user.user_metadata?.username
    || user.user_metadata?.user_name      // GitHub OAuth provides user_name
    || user.user_metadata?.full_name
    || user.email?.split('@')[0]
    || '占卜师';

  const newProfile = {
    id: user.id,
    username,
    email: user.email || '',
    avatar_url: user.user_metadata?.avatar_url || null,
  };

  const { data: created, error } = await supabase
    .from('profiles')
    .upsert(newProfile, { onConflict: 'id' })
    .select()
    .single();

  if (error) {
    console.warn('Failed to create profile:', error);
    // Return a fallback profile from auth data
    return {
      id: user.id,
      email: user.email || '',
      username,
      avatar_url: user.user_metadata?.avatar_url || null,
      created_at: user.created_at,
    };
  }

  return {
    id: created.id,
    email: created.email || user.email || '',
    username: created.username,
    avatar_url: created.avatar_url,
    created_at: created.created_at,
  };
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  isInitialized: false,
  error: null,

  initialize: async () => {
    try {
      set({ isLoading: true });
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const profile = await fetchOrCreateProfile(session.user);
        set({ user: profile });
      }

      // Listen for auth state changes (e.g. OAuth callback, token refresh)
      supabase.auth.onAuthStateChange(async (_event, session) => {
        if (session?.user) {
          const profile = await fetchOrCreateProfile(session.user);
          set({ user: profile });
        } else {
          set({ user: null });
        }
      });
    } catch (e) {
      console.warn('Auth initialization failed:', e);
    } finally {
      set({ isInitialized: true, isLoading: false });
    }
  },

  login: async (email: string, password: string): Promise<boolean> => {
    try {
      set({ isLoading: true, error: null });
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        set({ error: error.message, isLoading: false });
        return false;
      }
      if (data.user) {
        const profile = await fetchOrCreateProfile(data.user);
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
    try {
      set({ isLoading: true, error: null });
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { username } },
      });
      if (error) {
        set({ error: error.message, isLoading: false });
        return false;
      }
      if (data.user) {
        // Create profile record
        await supabase.from('profiles').upsert({
          id: data.user.id,
          username,
          email,
          avatar_url: null,
        }, { onConflict: 'id' });

        const profile: UserProfile = {
          id: data.user.id,
          email,
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
    try {
      await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: 'https://sunshine-1dev.github.io/tarot/auth/callback',
        },
      });
    } catch (e) {
      set({ error: 'GitHub 登录失败' });
      console.error(e);
    }
  },

  logout: async () => {
    await supabase.auth.signOut();
    set({ user: null, error: null });
  },

  clearError: () => set({ error: null }),
}));
