import { create } from 'zustand';
import { User } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { Database } from '../lib/database.types';

type Profile = Database['public']['Tables']['profiles']['Row'];

interface AuthState {
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string, role: 'patient' | 'doctor') => Promise<void>;
  signOut: () => Promise<void>;
  loadUser: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<Profile | undefined>;
  validateEmail: (email: string) => boolean;
  validatePassword: (password: string) => { isValid: boolean; message: string };
  isAuthenticated: boolean;
  redirectAfterSignUp: () => void;
  redirectAfterSignIn: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  profile: null,
  isLoading: true,
  error: null,
  isAuthenticated: false,  // Add initial value for isAuthenticated

  validateEmail: (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  validatePassword: (password: string) => {
    if (password.length < 8) {
      return { isValid: false, message: 'Password must be at least 8 characters long' };
    }
    if (!/[A-Z]/.test(password)) {
      return { isValid: false, message: 'Password must contain at least one uppercase letter' };
    }
    if (!/[a-z]/.test(password)) {
      return { isValid: false, message: 'Password must contain at least one lowercase letter' };
    }
    if (!/[0-9]/.test(password)) {
      return { isValid: false, message: 'Password must contain at least one number' };
    }
    return { isValid: true, message: '' };
  },

  signIn: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      if (!isSupabaseConfigured()) {
        throw new Error('Supabase not configured. Please set up your environment variables.');
      }
      
      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      if (!useAuthStore.getState().validateEmail(email)) {
        throw new Error('Invalid email format');
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        if (error.message === 'Invalid login credentials') {
          throw new Error('Invalid email or password. Please try again.');
        }
        throw error;
      }
      
      if (data.user) {
        let { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .maybeSingle();

        if (!profile) {
          const { data: newProfile, error: insertError } = await supabase
            .from('profiles')
            .insert({ id: data.user.id, full_name: data.user.user_metadata.full_name || '' })
            .select()
            .single();

          if (insertError) throw insertError;
          profile = newProfile;
        }
          
        set({ 
          user: data.user, 
          profile: profile || null,
          isAuthenticated: true 
        });
        
        // After successful login, redirect to dashboard
        useAuthStore.getState().redirectAfterSignIn();
      }
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
  
  signUp: async (email: string, password: string, fullName: string, role: 'patient' | 'doctor') => {
    set({ isLoading: true, error: null });
    try {
      if (!isSupabaseConfigured()) {
        throw new Error('Supabase not configured. Please set up your environment variables.');
      }
      
      // Validate inputs
      if (!email || !password || !fullName) {
        throw new Error('All fields are required');
      }

      if (!useAuthStore.getState().validateEmail(email)) {
        throw new Error('Invalid email format');
      }

      const passwordValidation = useAuthStore.getState().validatePassword(password);
      if (!passwordValidation.isValid) {
        throw new Error(passwordValidation.message);
      }

      // First sign up the user
      const { error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: role,
          }
        }
      });
      
      if (authError) throw authError;
      
      // After successful signup, redirect to signin
      set({ isLoading: false });
      useAuthStore.getState().redirectAfterSignUp();
      
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  signOut: async () => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      set({ user: null, profile: null });
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
  
  loadUser: async () => {
    // If Supabase is not configured, set unauthenticated state
    if (!isSupabaseConfigured()) {
      set({ user: null, profile: null, isLoading: false, isAuthenticated: false, error: 'Supabase not configured' });
      return;
    }
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        let { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();

        if (!profile) {
          const { data: newProfile, error: insertError } = await supabase
            .from('profiles')
            .insert({ id: user.id, full_name: user.user_metadata.full_name || '' })
            .select()
            .single();

          if (insertError) throw insertError;
          profile = newProfile;
        }
          
        set({ user, profile: profile || null, isLoading: false, isAuthenticated: true });
      } else {
        set({ user: null, profile: null, isLoading: false, isAuthenticated: false });
      }
    } catch (error) {
      console.error('Error loading user:', error);
      set({ user: null, profile: null, isLoading: false, isAuthenticated: false, error: (error as Error).message });
    }
  },

  updateProfile: async (updates: Partial<Profile>): Promise<Profile | undefined> => {
    set({ isLoading: true, error: null });
    try {
      const { user } = useAuthStore.getState();
      if (!user) throw new Error('No user logged in');

      console.log('Updating profile with data:', updates);
      
      // Check if Supabase is configured
      if (!isSupabaseConfigured()) {
        throw new Error('Supabase not configured. Please set up your environment variables.');
      }

      // Perform the update with returning option
      const { data: updatedProfiles, error: updateError } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)
        .select();

      if (updateError) {
        console.error('Error updating profile:', updateError);
        throw new Error(`Failed to update profile: ${updateError.message}`);
      }

      if (!updatedProfiles || updatedProfiles.length === 0) {
        console.error('No data returned after update');
        throw new Error('Failed to update profile. No data returned.');
      }

      const updatedProfile: Profile = updatedProfiles[0];
      console.log('Profile updated successfully:', updatedProfile);
      
      // Update the store with the new profile
      set({ profile: updatedProfile, isAuthenticated: true });
      
      return updatedProfile;
    } catch (error) {
      console.error('Profile update failed:', error);
      set({ error: (error as Error).message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
  
  redirectAfterSignUp: () => {
    window.location.href = '/login';
  },

  redirectAfterSignIn: () => {
    window.location.href = '/dashboard';
  }
}));