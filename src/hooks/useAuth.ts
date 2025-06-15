
import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface Profile {
  id: string;
  email: string | null;
  first_name: string | null;
  last_name: string | null;
  specialization: string | null;
  location: string | null;
  bio: string | null;
  phone: string | null;
  role: string | null;
  verified: boolean | null;
  avatar_url: string | null;
  created_at: string | null;
  updated_at: string | null;
}

interface LoginCredentials {
  email: string;
  password: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId: string) => {
    try {
      console.log('Fetching profile for user:', userId);
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, first_name, last_name, specialization, location, bio, phone, role, verified, created_at, updated_at')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }

      console.log('Profile fetched:', data);
      setProfile({
        ...data,
        avatar_url: null
      });
    } catch (error) {
      console.error('Error in fetchProfile:', error);
    }
  };

  const refreshProfile = async () => {
    if (user?.id) {
      await fetchProfile(user.id);
    }
  };

  useEffect(() => {
    console.log('useAuth: Setting up auth listener...');
    
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await fetchProfile(session.user.id);
        } else {
          setProfile(null);
        }
        
        setLoading(false);
      }
    );

    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error getting initial session:', error);
        } else {
          console.log('Initial session:', initialSession);
          if (initialSession) {
            setSession(initialSession);
            setUser(initialSession.user);
            await fetchProfile(initialSession.user.id);
          }
        }
      } catch (error) {
        console.error('Error in getInitialSession:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error signing out:', error);
        throw error;
      }
      // Clear local state
      setUser(null);
      setSession(null);
      setProfile(null);
    } catch (error) {
      console.error('Error in signOut:', error);
      throw error;
    }
  };

  return {
    user,
    session,
    profile,
    loading,
    signOut,
    refreshProfile,
  };
};

export const useLogin = () => {
  const [isPending, setIsPending] = useState(false);

  const mutate = async (
    credentials: LoginCredentials,
    options?: {
      onSuccess?: () => void;
      onError?: (error: any) => void;
    }
  ) => {
    setIsPending(true);
    try {
      console.log('Attempting login with email:', credentials.email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) {
        console.error('Login error:', error);
        toast({
          title: "Login Failed",
          description: error.message || "Invalid email or password. Please try again.",
          variant: "destructive",
        });
        options?.onError?.(error);
        return;
      }

      console.log('Login successful:', data);
      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
      });
      
      options?.onSuccess?.();
    } catch (error) {
      console.error('Unexpected login error:', error);
      toast({
        title: "Login Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      options?.onError?.(error);
    } finally {
      setIsPending(false);
    }
  };

  return {
    mutate,
    isPending,
  };
};
