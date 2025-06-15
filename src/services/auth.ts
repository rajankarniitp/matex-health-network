
import { supabase } from "@/integrations/supabase/client";
import { AuthError } from '@supabase/supabase-js';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export const authService = {
  // Login with email and password
  login: async ({ email, password }: LoginCredentials) => {
    console.log('Starting email/password login for:', email);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Login error:', error);
      throw error;
    }

    console.log('Login successful:', data);
    return { user: data.user, session: data.session };
  },

  // Sign up new user
  signup: async ({ email, password, firstName, lastName }: SignupData) => {
    console.log('Starting signup for:', email);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
        },
        emailRedirectTo: `${window.location.origin}/feed`,
      },
    });

    if (error) {
      console.error('Signup error:', error);
      throw error;
    }

    console.log('Signup successful:', data);
    return { user: data.user, session: data.session };
  },

  // Google OAuth login
  loginWithGoogle: async () => {
    console.log('Starting Google OAuth login...');
    const redirectTo = `${window.location.origin}/feed`;
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectTo,
        queryParams: {
          access_type: 'offline',
          prompt: 'select_account',
        },
      },
    });

    if (error) {
      console.error('Google OAuth error:', error);
      throw error;
    }
    
    console.log('Google OAuth initiated successfully');
    return { data };
  },

  // Logout
  logout: async () => {
    console.log('Starting logout...');
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Logout error:', error);
      throw error;
    }
    console.log('Logout successful');
  },

  // Get current user
  getCurrentUser: async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error) {
      console.error('Get user error:', error);
      throw error;
    }
    return data;
  },

  // Get current session
  getSession: async () => {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.error('Get session error:', error);
      throw error;
    }
    return data;
  },
};

// Helper function to get user profile
export const getUserProfile = async (userId: string) => {
  console.log('Fetching profile for user:', userId);
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();

  if (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
  console.log('Profile fetched:', data);
  return data;
};

// Helper function to update user profile
export const updateUserProfile = async (userId: string, updates: any) => {
  console.log('Updating profile for user:', userId, updates);
  const { data, error } = await supabase
    .from('profiles')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
  console.log('Profile updated:', data);
  return data;
};

// Helper function to create user profile (for OAuth users)
export const createUserProfile = async (userId: string, profileData: any) => {
  console.log('Creating profile for user:', userId, profileData);
  const { data, error } = await supabase
    .from('profiles')
    .insert({
      id: userId,
      ...profileData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating user profile:', error);
    throw error;
  }
  console.log('Profile created:', data);
  return data;
};
