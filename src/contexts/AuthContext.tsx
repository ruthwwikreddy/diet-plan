
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';
import { toast } from 'sonner';

type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: 'trainer' | 'trainee';
};

type AuthContextType = {
  user: AuthUser | null;
  session: Session | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  register: (name: string, username: string, password: string, role: 'trainer' | 'trainee') => Promise<boolean>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Function to handle user session
  const handleSession = useCallback(async (session: Session | null) => {
    console.log('Handling session:', session);
    setSession(session);
    
    if (session?.user) {
      try {
        // Get user data from our users table
        const { data, error } = await supabase
          .from('users')
          .select('id, name, email, role')
          .eq('id', session.user.id)
          .single();
        
        if (error) {
          console.error('Error fetching user data:', error);
          setUser(null);
          localStorage.removeItem('user');
          return;
        }
        
        if (data) {
          const userData = {
            id: data.id,
            name: data.name,
            email: data.email,
            role: data.role as 'trainer' | 'trainee'
          };
          setUser(userData);
          // Store user data in localStorage for persistence
          localStorage.setItem('user', JSON.stringify(userData));
          
          // Set a timer to refresh the token before it expires
          if (session.expires_in) {
            const refreshTime = (session.expires_in - 60) * 1000; // 1 minute before expiry
            setTimeout(() => {
              supabase.auth.refreshSession();
            }, refreshTime);
          }
        } else {
          setUser(null);
          localStorage.removeItem('user');
        }
      } catch (error) {
        console.error('Error in auth change handler:', error);
        setUser(null);
        localStorage.removeItem('user');
      }
    } else {
      setUser(null);
      localStorage.removeItem('user');
    }
  }, []);

  // Check for existing session on initial load
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setLoading(true);
        // Check for stored user data first
        const storedUser = localStorage.getItem('user');
        
        // Check for existing session
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        
        if (currentSession) {
          await handleSession(currentSession);
        } else if (storedUser) {
          // If no session but we have stored user, try to refresh
          try {
            const { data: { session: refreshedSession }, error } = await supabase.auth.refreshSession();
            if (error) throw error;
            if (refreshedSession) {
              await handleSession(refreshedSession);
              return;
            }
          } catch (error) {
            console.error('Error refreshing session:', error);
            // Continue to clear invalid session
          }
          
          // If we get here, the refresh failed - clear invalid data
          setUser(null);
          localStorage.removeItem('user');
          await supabase.auth.signOut();
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        setUser(null);
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };
    
    initializeAuth();
    
    // Set up auth state listener for future changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event);
        handleSession(session);
      }
    );
    
    // Cleanup subscription on unmount
    return () => {
      subscription?.unsubscribe();
    };
  }, [handleSession]);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      // Convert username to email format if needed
      const email = username.includes('@') ? username : `${username}@gmail.com`;
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: username.includes('@') ? username : `${username}@gmail.com`,
        password,
      });

      if (error) throw error;
      
      if (!data.session) {
        throw new Error('No session returned after login');
      }
      
      // The session will be handled by the auth state change listener
      return true;
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.error_description || error.message || 'Login failed');
      // Clear any potentially invalid session
      await supabase.auth.signOut();
      setUser(null);
      localStorage.removeItem('user');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, username: string, password: string, role: 'trainer' | 'trainee'): Promise<boolean> => {
    try {
      setLoading(true);
      
      // Convert username to email format
      const email = `${username}@gmail.com`;
      console.log('Attempting registration with email:', email);
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role
          }
        }
      });
      
      if (error) {
        console.error('Registration error:', error);
        toast.error(error.message);
        return false;
      }
      
      toast.info(`Account created with email: ${email}`);
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setLoading(true);
      // Clear all auth data
      await supabase.auth.signOut();
      
      // Clear local state
      setUser(null);
      setSession(null);
      
      // Clear all auth-related data from localStorage
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.startsWith('sb-') || key.includes('supabase') || key === 'user')) {
          keysToRemove.push(key);
        }
      }
      
      keysToRemove.forEach(key => localStorage.removeItem(key));
      
      // Clear session storage
      sessionStorage.clear();
    } catch (error) {
      console.error('Error logging out:', error);
      // Even if there's an error, we should still clear local state
      setUser(null);
      setSession(null);
      localStorage.removeItem('user');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, login, logout, register, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
