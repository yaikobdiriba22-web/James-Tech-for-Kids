import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured, DbProfile } from '../lib/supabase';

interface SignUpMetadata {
  full_name?: string;
  student_age?: number;
  phone?: string;
  guardian_name?: string;
  role?: 'student' | 'parent';
}

interface AuthContextType {
  user: User | null;
  profile: DbProfile | null;
  session: Session | null;
  loading: boolean;
  isConfigured: boolean;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signUp: (email: string, password: string, metadata?: SignUpMetadata) => Promise<{ user: User | null; session: Session | null; error: AuthError | null }>;
  signOut: () => Promise<{ error: AuthError | null }>;
  resetPasswordForEmail: (email: string) => Promise<{ error: AuthError | null }>;
  updatePassword: (newPassword: string) => Promise<{ error: AuthError | null }>;
  updateProfile: (data: Partial<DbProfile>) => Promise<{ error: Error | null }>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<DbProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch or create profile row in 'profiles' table
  const fetchProfile = useCallback(async (userId: string, currentUser?: User | null) => {
    if (!isSupabaseConfigured) {
      // Local fallback mock profile if Supabase keys aren't added yet
      if (currentUser) {
        setProfile({
          id: userId,
          email: currentUser.email || '',
          full_name: currentUser.user_metadata?.full_name || 'Student Learner',
          student_age: currentUser.user_metadata?.student_age || 10,
          phone: currentUser.user_metadata?.phone || '',
          guardian_name: currentUser.user_metadata?.guardian_name || '',
          role: 'student',
          avatar_url: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
      }
      return;
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.warn('Error fetching profile from Supabase:', error.message);
      }

      if (data) {
        setProfile(data as DbProfile);
      } else if (currentUser) {
        // If profile row doesn't exist yet, attempt to upsert from auth user metadata
        const newProfile: Partial<DbProfile> = {
          id: userId,
          email: currentUser.email || '',
          full_name: currentUser.user_metadata?.full_name || currentUser.email?.split('@')[0] || 'Student',
          student_age: currentUser.user_metadata?.student_age ? Number(currentUser.user_metadata.student_age) : 10,
          phone: currentUser.user_metadata?.phone || null,
          guardian_name: currentUser.user_metadata?.guardian_name || null,
          role: 'student',
        };

        const { data: inserted, error: insertError } = await supabase
          .from('profiles')
          .upsert(newProfile)
          .select()
          .maybeSingle();

        if (!insertError && inserted) {
          setProfile(inserted as DbProfile);
        } else {
          setProfile(newProfile as DbProfile);
        }
      }
    } catch (err) {
      console.error('Unexpected error loading profile:', err);
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    if (user?.id) {
      await fetchProfile(user.id, user);
    }
  }, [user, fetchProfile]);

  useEffect(() => {
    let isMounted = true;

    async function initAuth() {
      try {
        if (!isSupabaseConfigured) {
          setLoading(false);
          return;
        }

        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.warn('Supabase getSession warning:', error.message);
        }

        if (isMounted) {
          setSession(data.session);
          setUser(data.session?.user ?? null);
          if (data.session?.user) {
            await fetchProfile(data.session.user.id, data.session.user);
          }
        }
      } catch (err) {
        console.error('Error initializing auth session:', err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    initAuth();

    // Listen to Auth State Changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, currentSession) => {
      if (!isMounted) return;
      setSession(currentSession);
      setUser(currentSession?.user ?? null);

      if (currentSession?.user) {
        await fetchProfile(currentSession.user.id, currentSession.user);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [fetchProfile]);

  // Sign In with email & password
  const signIn = async (email: string, password: string) => {
    if (!isSupabaseConfigured) {
      return {
        error: {
          name: 'SupabaseNotConfigured',
          message:
            'Supabase authentication is not configured. Please set VITE_SUPABASE_PUBLISHABLE_KEY in Vercel Environment Variables (for production) or in your local .env file.',
        } as AuthError,
      };
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (!error && data.user) {
      setUser(data.user);
      setSession(data.session);
      await fetchProfile(data.user.id, data.user);
    }

    return { error };
  };

  // Sign Up with email, password & student profile metadata
  const signUp = async (email: string, password: string, metadata?: SignUpMetadata) => {
    if (!isSupabaseConfigured) {
      return {
        user: null,
        session: null,
        error: {
          name: 'SupabaseNotConfigured',
          message:
            'Supabase authentication is not configured. Please set VITE_SUPABASE_PUBLISHABLE_KEY in Vercel Environment Variables (for production) or in your local .env file.',
        } as AuthError,
      };
    }

    const redirectUrl = `${window.location.origin}/dashboard`;

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          full_name: metadata?.full_name || '',
          student_age: metadata?.student_age || 10,
          phone: metadata?.phone || '',
          guardian_name: metadata?.guardian_name || '',
          role: metadata?.role || 'student',
        },
      },
    });

    if (!error && data.user) {
      setUser(data.user);
      setSession(data.session);
      await fetchProfile(data.user.id, data.user);
    }

    return {
      user: data.user,
      session: data.session,
      error,
    };
  };

  // Sign Out
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setSession(null);
    return { error };
  };

  // Request Password Reset
  const resetPasswordForEmail = async (email: string) => {
    if (!isSupabaseConfigured) {
      return {
        error: {
          name: 'SupabaseNotConfigured',
          message: 'Supabase is not configured. Please supply VITE_SUPABASE_PUBLISHABLE_KEY.',
        } as AuthError,
      };
    }

    const resetRedirectUrl = `${window.location.origin}/reset-password`;
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: resetRedirectUrl,
    });
    return { error };
  };

  // Update Password
  const updatePassword = async (newPassword: string) => {
    if (!isSupabaseConfigured) {
      return {
        error: {
          name: 'SupabaseNotConfigured',
          message: 'Supabase is not configured.',
        } as AuthError,
      };
    }

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    return { error };
  };

  // Update Profile in database
  const updateProfile = async (data: Partial<DbProfile>) => {
    if (!user) {
      return { error: new Error('User is not signed in') };
    }

    if (!isSupabaseConfigured) {
      setProfile((prev) => (prev ? { ...prev, ...data } : null));
      return { error: null };
    }

    try {
      const { data: updated, error } = await supabase
        .from('profiles')
        .update({
          ...data,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)
        .select()
        .single();

      if (error) {
        return { error: new Error(error.message) };
      }

      if (updated) {
        setProfile(updated as DbProfile);
      }
      return { error: null };
    } catch (err) {
      return { error: err as Error };
    }
  };

  const value = useMemo(
    () => ({
      user,
      profile,
      session,
      loading,
      isConfigured: isSupabaseConfigured,
      signIn,
      signUp,
      signOut,
      resetPasswordForEmail,
      updatePassword,
      updateProfile,
      refreshProfile,
    }),
    [user, profile, session, loading, refreshProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
