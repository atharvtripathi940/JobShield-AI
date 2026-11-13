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

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function formatNameFromEmail(email: string): string {
  const prefix = (email.split('@')[0] || 'User').replace(/[^a-zA-Z0-9._-]/g, '');
  return prefix
    .split(/[._-]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(' ') || 'User';
}

function getKnownProfiles(): Record<string, UserProfile> {
  try {
    const raw = localStorage.getItem('jobshield_known_profiles');
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveKnownProfile(profile: UserProfile) {
  try {
    const registry = getKnownProfiles();
    registry[profile.email.toLowerCase()] = profile;
    localStorage.setItem('jobshield_known_profiles', JSON.stringify(registry));
  } catch (e) {
    console.error('Failed to save profile registry:', e);
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('jobshield_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return DEMO_USER;
      }
    }
    // Default candidate profile
    return DEMO_USER;
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(!isSupabaseConfigured || (user?.isDemo ?? true));

  useEffect(() => {
    // Restore session from Supabase if present
    if (isSupabaseConfigured && supabase) {
      supabase.auth.getSession().then(({ data }) => {
        if (data.session?.user) {
          const u = data.session.user;
          const role = (u.user_metadata?.role as 'user' | 'admin') || (u.email?.includes('admin') ? 'admin' : 'user');
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
      localStorage.setItem('jobshield_user', JSON.stringify(user));
      saveKnownProfile(user);
      saveProfileToSupabase(user).catch(() => {});
    } else {
      localStorage.removeItem('jobshield_user');
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
    const role: 'user' | 'admin' = requestedRole || (cleanEmail.toLowerCase().includes('admin') ? 'admin' : 'user');

    try {
      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password: password || 'TestPass123!',
        });
        if (error) throw error;
        if (data.user) {
          const profile: UserProfile = {
            id: data.user.id,
            email: data.user.email || cleanEmail,
            fullName: customName?.trim() || data.user.user_metadata?.full_name || formatNameFromEmail(cleanEmail),
            role,
            careerSafetyScore: role === 'admin' ? 99 : 88,
            totalScansCount: role === 'admin' ? 42 : 5,
            isDemo: false,
          };
          setUser(profile);
          setIsDemoMode(false);
          setLoading(false);
          saveProfileToSupabase(profile).catch(() => {});
          return { success: true };
        }
      }

      // Check registry of previously registered profiles
      const registry = getKnownProfiles();
      const existing = registry[cleanEmail.toLowerCase()];

      const resolvedName = customName?.trim() || existing?.fullName || formatNameFromEmail(cleanEmail);

      const profile: UserProfile = {
        id: existing?.id || `usr-${Date.now()}`,
        email: cleanEmail,
        fullName: resolvedName,
        role,
        careerSafetyScore: role === 'admin' ? 99 : (existing?.careerSafetyScore || 88),
        totalScansCount: role === 'admin' ? 42 : (existing?.totalScansCount || 6),
        isDemo: true,
      };

      setUser(profile);
      setIsDemoMode(true);
      setLoading(false);
      return { success: true };
    } catch (err: any) {
      setLoading(false);
      return { success: false, error: err.message || 'Login failed' };
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
    const role: 'user' | 'admin' = requestedRole || (cleanEmail.toLowerCase().includes('admin') ? 'admin' : 'user');
    const name = fullName?.trim() || formatNameFromEmail(cleanEmail);

    try {
      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase.auth.signUp({
          email: cleanEmail,
          password: password || 'TestPass123!',
          options: {
            data: { full_name: name, role }
          }
        });
        if (error) throw error;
        if (data.user) {
          const profile: UserProfile = {
            id: data.user.id,
            email: data.user.email || cleanEmail,
            fullName: name,
            role,
            careerSafetyScore: role === 'admin' ? 99 : 85,
            totalScansCount: 0,
            isDemo: false,
          };
          setUser(profile);
          setIsDemoMode(false);
          setLoading(false);
          saveProfileToSupabase(profile).catch(() => {});
          return { success: true };
        }
      }

      // Demo signup
      const profile: UserProfile = {
        id: `usr-${Date.now()}`,
        email: cleanEmail,
        fullName: name,
        role,
        careerSafetyScore: role === 'admin' ? 99 : 85,
        totalScansCount: 0,
        isDemo: true,
      };
      setUser(profile);
      setIsDemoMode(true);
      setLoading(false);
      return { success: true };
    } catch (err: any) {
      setLoading(false);
      return { success: false, error: err.message || 'Registration failed' };
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
    localStorage.removeItem('jobshield_user');
  };

  const switchDemoRole = (role: 'user' | 'admin') => {
    if (role === 'admin') {
      setUser(DEMO_ADMIN);
    } else {
      setUser(DEMO_USER);
    }
    setIsDemoMode(true);
  };

  const updateProfile = (updated: Partial<UserProfile>) => {
    setUser((prev) => {
      if (!prev) return prev;
      const next = { ...prev, ...updated };
      localStorage.setItem('jobshield_user', JSON.stringify(next));
      saveKnownProfile(next);
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
