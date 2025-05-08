
import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
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
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  register: (name: string, email: string, password: string, role: 'trainer' | 'trainee') => Promise<boolean>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
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
              return;
            }
            
            if (data) {
              setUser({
                id: data.id,
                name: data.name,
                email: data.email,
                role: data.role as 'trainer' | 'trainee'
              });
            } else {
              setUser(null);
            }
          } catch (error) {
            console.error('Error in auth change handler:', error);
            setUser(null);
          }
        } else {
          setUser(null);
        }
      }
    );

    // Then check for existing session
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        
        if (session?.user) {
          // Get user data from our users table
          const { data, error } = await supabase
            .from('users')
            .select('id, name, email, role')
            .eq('id', session.user.id)
            .single();
          
          if (error) {
            console.error('Error fetching user data:', error);
            setUser(null);
            return;
          }
          
          if (data) {
            setUser({
              id: data.id,
              name: data.name,
              email: data.email,
              role: data.role as 'trainer' | 'trainee'
            });
          } else {
            setUser(null);
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        toast.error(error.message);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, role: 'trainer' | 'trainee'): Promise<boolean> => {
    try {
      setLoading(true);
      
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
        toast.error(error.message);
        return false;
      }
      
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
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Logout error:', error);
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
