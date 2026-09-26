'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, signInWithSupabase, signUpWithSupabase, signOutSupabase, getUserProfile, setAuthCookie } from '@/lib/supabase';
import { Profile } from '@/lib/types';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  signIn: typeof signInWithSupabase;
  signUp: typeof signUpWithSupabase;
  signOut: typeof signOutSupabase;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  profile: null,
  loading: true,
  signIn: async () => ({ user: null, session: null }),
  signUp: async () => ({ user: null, session: null }),
  signOut: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    console.log('AuthProvider init: mounting');
    let mounted = true;

    async function initAuth() {
      console.log('Initializing auth...');
      if (!supabase) {
        if (mounted) setLoading(false);
        return;
      }

      try {
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        if (mounted) {
          setSession(initialSession);
          setUser(initialSession?.user ?? null);
          if (initialSession?.access_token) {
            setAuthCookie(initialSession.access_token);
          }
          if (initialSession?.user) {
            fetchProfile(initialSession.user.id);
          }
        }
      } catch (err) {
        console.error('Error resolving initial Supabase auth session:', err);
      } finally {
        if (mounted) setLoading(false);
      }

      // Listen for auth state changes (login, logout, token refresh)
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
        console.log('Auth state change event:', event);
        console.log('Current session:', currentSession);

        if (!mounted) return;
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        if (currentSession?.access_token) {
          setAuthCookie(currentSession.access_token);
        } else if (!currentSession) {
          setAuthCookie(null);
        }
        if (currentSession?.user) {
          fetchProfile(currentSession.user.id);
        } else {
          setProfile(null);
        }
        setLoading(false);
      });

      return () => {
        subscription.unsubscribe();
      };
    }

    initAuth();

    return () => {
      mounted = false;
    };
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const p = await getUserProfile(userId);
      setProfile(p);
    } catch {
      setProfile(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        loading,
        signIn: signInWithSupabase,
        signUp: signUpWithSupabase,
        signOut: signOutSupabase,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
