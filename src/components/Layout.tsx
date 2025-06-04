
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

type LayoutProps = {
  children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [trainerProfile, setTrainerProfile] = useState<any>(null);

  useEffect(() => {
    if (user?.role === 'trainer') {
      fetchTrainerProfile();
    }
  }, [user]);

  const fetchTrainerProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('trainer_profiles')
        .select('*')
        .eq('trainer_id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setTrainerProfile(data);
        // Apply custom colors to CSS variables
        if (data.primary_color) {
          document.documentElement.style.setProperty('--trainer-primary', data.primary_color);
        }
        if (data.secondary_color) {
          document.documentElement.style.setProperty('--trainer-secondary', data.secondary_color);
        }
      }
    } catch (error) {
      console.error('Error fetching trainer profile:', error);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const primaryColor = trainerProfile?.primary_color || '#E31B23';
  const secondaryColor = trainerProfile?.secondary_color || '#4D4D4D';

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            {trainerProfile ? (
              <div className="flex items-center gap-3">
                {trainerProfile.logo_url ? (
                  <img
                    src={trainerProfile.logo_url}
                    alt="Trainer Logo"
                    className="h-10 w-auto object-contain"
                  />
                ) : (
                  <div className="h-10 w-16 border-2 border-dashed border-gray-300 rounded flex items-center justify-center">
                    <span className="text-xs text-gray-500">Your Logo</span>
                  </div>
                )}
                <div>
                  <h1 
                    className="text-xl font-bold"
                    style={{ color: secondaryColor }}
                  >
                    {trainerProfile.gym_name || 'Gym Diet Plan Maker'}
                  </h1>
                  {trainerProfile.gym_name && (
                    <p className="text-xs text-gray-500">Diet Plan System</p>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div className="h-10 w-16 border-2 border-dashed border-gray-300 rounded flex items-center justify-center">
                  <span className="text-xs text-gray-500">Your Logo</span>
                </div>
                <h1 className="text-xl font-bold" style={{ color: secondaryColor }}>
                  Gym Diet Plan Maker
                </h1>
              </div>
            )}
          </div>
          {user && (
            <div className="flex items-center gap-4">
              <span className="font-medium" style={{ color: secondaryColor }}>
                {user.role === 'trainer' ? 'Trainer' : 'Trainee'}: {user.name}
              </span>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleLogout} 
                className="flex items-center gap-1"
                style={{ color: primaryColor }}
              >
                <LogOut size={16} />
                <span>Logout</span>
              </Button>
            </div>
          )}
        </div>
      </header>
      <main className="flex-1" style={{ backgroundColor: '#fafafa' }}>
        {children}
      </main>
      <footer style={{ backgroundColor: secondaryColor }} className="text-white py-4">
        <div className="container mx-auto px-4 text-center">
          <p>© {new Date().getFullYear()} {trainerProfile?.gym_name || 'Gym Diet Plan Maker'}</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
