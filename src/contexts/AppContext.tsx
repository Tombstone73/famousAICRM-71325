import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { User as SupabaseUser } from '@supabase/supabase-js';

interface AppUser {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'employee' | 'admin';
  auth_id?: string;
}

interface AppContextType {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  user: AppUser | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  refreshUser: () => Promise<void>;
}

const defaultAppContext: AppContextType = {
  sidebarOpen: false,
  toggleSidebar: () => {},
  user: null,
  login: async () => false,
  logout: () => {},
  isAuthenticated: false,
  refreshUser: async () => {},
};

const AppContext = createContext<AppContextType>(defaultAppContext);

export const useAppContext = () => useContext(AppContext);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<AppUser | null>(null);
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null);

  const fetchUserProfile = async (supabaseUser: SupabaseUser) => {
    try {
      console.log('Fetching user profile for auth_id:', supabaseUser.id);
      
      // First try to find user by auth_id
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('auth_id', supabaseUser.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching user profile:', error);
        throw error;
      }

      if (data) {
        console.log('User profile data:', data);
        setUser({
          id: data.id,
          name: data.name || supabaseUser.user_metadata?.full_name || supabaseUser.email?.split('@')[0] || 'User',
          email: data.email || supabaseUser.email || '',
          role: data.role || 'admin',
          auth_id: data.auth_id
        });
        return;
      }

      // If no user found by auth_id, try by email
      const { data: emailData, error: emailError } = await supabase
        .from('users')
        .select('*')
        .eq('email', supabaseUser.email)
        .single();

      if (emailData) {
        // Update the user record with auth_id
        const { error: updateError } = await supabase
          .from('users')
          .update({ auth_id: supabaseUser.id })
          .eq('id', emailData.id);

        if (updateError) {
          console.error('Error updating user auth_id:', updateError);
        }

        setUser({
          id: emailData.id,
          name: emailData.name || supabaseUser.user_metadata?.full_name || supabaseUser.email?.split('@')[0] || 'User',
          email: emailData.email || supabaseUser.email || '',
          role: emailData.role || 'admin',
          auth_id: supabaseUser.id
        });
        return;
      }

      // If still no user found, create a new one
      console.log('Creating new user profile');
      const { data: newUser, error: insertError } = await supabase
        .from('users')
        .insert({
          auth_id: supabaseUser.id,
          email: supabaseUser.email,
          name: supabaseUser.user_metadata?.full_name || supabaseUser.email?.split('@')[0] || 'User',
          role: 'admin', // Default to admin for now
          permissions: {
            orders: true,
            production: true,
            contacts: true,
            products: true,
            reports: true,
            settings: true
          }
        })
        .select()
        .single();

      if (insertError) {
        console.error('Error creating user:', insertError);
        // Fallback to basic user data
        setUser({
          id: supabaseUser.id,
          name: supabaseUser.user_metadata?.full_name || supabaseUser.email?.split('@')[0] || 'User',
          email: supabaseUser.email || '',
          role: 'admin',
          auth_id: supabaseUser.id
        });
        return;
      }

      setUser({
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role || 'admin',
        auth_id: newUser.auth_id
      });
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      // Fallback to basic user data from Supabase auth
      setUser({
        id: supabaseUser.id,
        name: supabaseUser.user_metadata?.full_name || supabaseUser.email?.split('@')[0] || 'User',
        email: supabaseUser.email || '',
        role: 'admin',
        auth_id: supabaseUser.id
      });
    }
  };

  const refreshUser = async () => {
    if (supabaseUser) {
      await fetchUserProfile(supabaseUser);
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSupabaseUser(session?.user ?? null);
      if (session?.user) {
        fetchUserProfile(session.user);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSupabaseUser(session?.user ?? null);
      if (session?.user) {
        fetchUserProfile(session.user);
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error('Login error:', error);
        return false;
      }
      
      setSupabaseUser(data.user);
      if (data.user) {
        await fetchUserProfile(data.user);
      }
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setSupabaseUser(null);
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AppContext.Provider
      value={{
        sidebarOpen,
        toggleSidebar,
        user,
        login,
        logout,
        isAuthenticated: !!user,
        refreshUser,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};