import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured, UserProfile, DEMO_USER, DEMO_ADMIN, saveProfileToSupabase } from '../lib/supabase.js';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  isDemoMode: boolean;
  login: (
    email: string,
    password?: string,
    requestedRole?: 'user' | 'admin',
    customName?: string
  ) => Promise<{ success: boolean; error?: string }>;
  signup: (
    email: string,
    password?: string,
    fullName?: string,
    requestedRole?: 'user' | 'admin'
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  switchDemoRole: (role: 'user' | 'admin') => void;
  updateProfile: (updated: Partial<UserProfile>) => void;
  setDemoMode: (enabled: boolean) => void;
}

interface StoredAccount {
  password?: string;
  profile: UserProfile;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_STORAGE_KEY = 'jobshield_user';
const ACCOUNTS_REGISTRY_KEY = 'jobshield_accounts_registry';

function formatNameFromEmail(email: string): string {
  const prefix = (email.split('@')[0] || 'User').replace(/[^a-zA-Z0-9._-]/g, '');
  return prefix
    .split(/[._-]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(' ') || 'User';
}

function getStoredAccounts(): Record<string, StoredAccount> {
  try {
    const raw = localStorage.getItem(ACCOUNTS_REGISTRY_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveStoredAccount(profile: UserProfile, password?: string) {
  try {
    const registry = getStoredAccounts();
    const key = profile.email.toLowerCase();
    const existing = registry[key];
    registry[key] = {
      password: password !== undefined ? password : existing?.password,
      profile,
    };
    localStorage.setItem(ACCOUNTS_REGISTRY_KEY, JSON.stringify(registry));
  } catch (e) {
    console.error('Failed to save profile registry:', e);
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem(USER_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as UserProfile;
        // Only restore explicit sign-in sessions (skip stale auto-demo objects)
        if (parsed && parsed.email && !parsed.isDemo) {
          return parsed;
        }
        localStorage.removeItem(USER_STORAGE_KEY);
      }
    } catch {
      localStorage.removeItem(USER_STORAGE_KEY);
    }
    return null;
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(false);

  useEffect(() => {
    if (isSupabaseConfigured && supabase) {
      supabase.auth.getSession().then(({ data }) => {
        if (data.session?.user) {
          const u = data.session.user;
          const role = (u.user_metadata?.role as 'user' | 'admin') || (u.email?.toLowerCase().includes('admin') ? 'admin' : 'user');
          const profile: UserProfile = {
            id: u.id,
            email: u.email || '',
            fullName: u.user_metadata?.full_name || formatNameFromEmail(u.email || ''),
            role,
            careerSafetyScore: role === 'admin' ? 99 : 88,
            totalScansCount: 0,
            isDemo: false,
          };
          setUser(profile);
          setIsDemoMode(false);
          saveProfileToSupabase(profile).catch(() => {});
        }
      }).catch(() => {});
    }
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
      saveStoredAccount(user);
      saveProfileToSupabase(user).catch(() => {});
    } else {
      localStorage.removeItem(USER_STORAGE_KEY);
    }
  }, [user]);

  const login = async (
    email: string,
    password?: string,
    requestedRole?: 'user' | 'admin',
    customName?: string
  ) => {
    setLoading(true);
    const cleanEmail = email.trim();
    const cleanPassword = (password || '').trim();

    if (!cleanEmail || !cleanEmail.includes('@')) {
      setLoading(false);
      return { success: false, error: 'Please enter a valid email address.' };
    }
    if (!cleanPassword || cleanPassword.length < 4) {
      setLoading(false);
      return { success: false, error: 'Please enter your password (at least 4 characters).' };
    }

    const role: 'user' | 'admin' =
      requestedRole || (cleanEmail.toLowerCase().includes('admin') ? 'admin' : 'user');

    try {
      // Check local registered account password if user previously signed up
      const registry = getStoredAccounts();
      const existingEntry = registry[cleanEmail.toLowerCase()];
      if (existingEntry?.password && existingEntry.password !== cleanPassword) {
        setLoading(false);
        return { success: false, error: 'Incorrect password for this account. Please try again.' };
      }

      // Attempt Supabase Auth silently if configured; fall back seamlessly to frontend session
      if (isSupabaseConfigured && supabase) {
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email: cleanEmail,
            password: cleanPassword,
          });
          if (!error && data.user) {
            const profile: UserProfile = {
              id: data.user.id,
              email: data.user.email || cleanEmail,
              fullName:
                customName?.trim() ||
                data.user.user_metadata?.full_name ||
                existingEntry?.profile?.fullName ||
                formatNameFromEmail(cleanEmail),
              role,
              careerSafetyScore: role === 'admin' ? 99 : 88,
              totalScansCount: role === 'admin' ? 42 : 5,
              isDemo: false,
            };
            saveStoredAccount(profile, cleanPassword);
            setUser(profile);
            setIsDemoMode(false);
            setLoading(false);
            return { success: true };
          }
        } catch {
          // Continue with frontend account session
        }
      }

      const resolvedName =
        customName?.trim() ||
        existingEntry?.profile?.fullName ||
        (cleanEmail.toLowerCase() === DEMO_ADMIN.email.toLowerCase()
          ? 'CyberSec Lead'
          : cleanEmail.toLowerCase() === DEMO_USER.email.toLowerCase()
          ? 'Atharv Tripathi'
          : formatNameFromEmail(cleanEmail));

      const profile: UserProfile = {
        id: existingEntry?.profile?.id || `usr-${Date.now()}`,
        email: cleanEmail,
        fullName: resolvedName,
        role,
        careerSafetyScore: role === 'admin' ? 99 : (existingEntry?.profile?.careerSafetyScore || 88),
        totalScansCount: role === 'admin' ? 42 : (existingEntry?.profile?.totalScansCount || 0),
        isDemo: false,
      };

      saveStoredAccount(profile, cleanPassword);
      setUser(profile);
      setIsDemoMode(false);
      setLoading(false);
      return { success: true };
    } catch (err: any) {
      setLoading(false);
      return { success: false, error: err?.message || 'Sign in failed.' };
    }
  };

  const signup = async (
    email: string,
    password?: string,
    fullName?: string,
    requestedRole?: 'user' | 'admin'
  ) => {
    setLoading(true);
    const cleanEmail = email.trim();
    const cleanPassword = (password || '').trim();

    if (!cleanEmail || !cleanEmail.includes('@')) {
      setLoading(false);
      return { success: false, error: 'Please enter a valid email address.' };
    }
    if (!cleanPassword || cleanPassword.length < 6) {
      setLoading(false);
      return { success: false, error: 'Password must be at least 6 characters.' };
    }

    const role: 'user' | 'admin' =
      requestedRole || (cleanEmail.toLowerCase().includes('admin') ? 'admin' : 'user');
    const name = fullName?.trim() || formatNameFromEmail(cleanEmail);

    try {
      let userId = `usr-${Date.now()}`;

      if (isSupabaseConfigured && supabase) {
        try {
          const { data } = await supabase.auth.signUp({
            email: cleanEmail,
            password: cleanPassword,
            options: {
              data: { full_name: name, role },
            },
          });
          if (data?.user?.id) {
            userId = data.user.id;
          }
        } catch {
          // Continue with frontend account creation
        }
      }

      const profile: UserProfile = {
        id: userId,
        email: cleanEmail,
        fullName: name,
        role,
        careerSafetyScore: role === 'admin' ? 99 : 88,
        totalScansCount: 0,
        isDemo: false,
      };

      saveStoredAccount(profile, cleanPassword);
      setUser(profile);
      setIsDemoMode(false);
      setLoading(false);
      return { success: true };
    } catch (err: any) {
      setLoading(false);
      return { success: false, error: err?.message || 'Registration failed.' };
    }
  };

  const logout = async () => {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.auth.signOut();
      } catch (e) {
        console.error(e);
      }
    }
    setUser(null);
    setIsDemoMode(false);
    localStorage.removeItem(USER_STORAGE_KEY);
  };

  const switchDemoRole = (role: 'user' | 'admin') => {
    const profile: UserProfile =
      role === 'admin'
        ? { ...DEMO_ADMIN, fullName: 'CyberSec Lead', isDemo: false }
        : { ...DEMO_USER, fullName: 'Atharv Tripathi', isDemo: false };
    setUser(profile);
    setIsDemoMode(false);
  };

  const updateProfile = (updated: Partial<UserProfile>) => {
    setUser((prev) => {
      if (!prev) return prev;
      const next = { ...prev, ...updated, isDemo: false };
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(next));
      saveStoredAccount(next);
      saveProfileToSupabase(next).catch(() => {});
      return next;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isDemoMode,
        login,
        signup,
        logout,
        switchDemoRole,
        updateProfile,
        setDemoMode: setIsDemoMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
