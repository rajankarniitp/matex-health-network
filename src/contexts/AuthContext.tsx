
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { getUserProfile, createUserProfile } from '@/services/auth';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: any | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = async (userId: string, userMetadata?: any) => {
    try {
      console.log('Fetching profile for user:', userId);
      let profileData = await getUserProfile(userId);
      
      // If no profile exists (OAuth user), create one
      if (!profileData && userMetadata) {
        console.log('Creating profile for OAuth user');
        const newProfileData = {
          email: userMetadata.email,
          first_name: userMetadata.full_name?.split(' ')[0] || userMetadata.name?.split(' ')[0] || '',
          last_name: userMetadata.full_name?.split(' ').slice(1).join(' ') || userMetadata.name?.split(' ').slice(1).join(' ') || '',
          role: 'doctor'
        };
        
        profileData = await createUserProfile(userId, newProfileData);
      }
      
      setProfile(profileData);
      console.log('Profile loaded:', profileData);
    } catch (error) {
      console.error('Error fetching/creating profile:', error);
    }
  };

  useEffect(() => {
    console.log('AuthProvider initializing...');
    let mounted = true;

    // Get initial session
    const getInitialSession = async () => {
      try {
        console.log('Getting initial session...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          return;
        }

        console.log('Initial session:', session);
        
        if (mounted) {
          setSession(session);
          setUser(session?.user ?? null);
          
          if (session?.user) {
            setTimeout(() => {
              fetchUserProfile(session.user.id, session.user.user_metadata);
            }, 0);
          }
        }
      } catch (error) {
        console.error('Error in getInitialSession:', error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, 'User:', session?.user?.email);
        
        if (mounted) {
          setSession(session);
          setUser(session?.user ?? null);
          setLoading(false);

          if (session?.user) {
            setTimeout(() => {
              fetchUserProfile(session.user.id, session.user.user_metadata);
            }, 0);
          } else {
            setProfile(null);
          }
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      console.log('Signing out...');
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setProfile(null);
      console.log('Sign out successful');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const value = {
    user,
    session,
    profile,
    loading,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
