
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
      // Try to get logo from localStorage first
      const localLogo = localStorage.getItem(`trainer_logo_${user?.id}`);
      
      const { data, error } = await supabase
        .from('trainer_profiles')
        .select('*')
        .eq('trainer_id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        // Use local logo if available, otherwise use database logo
        const logoUrl = localLogo || data.logo_url;
        setTrainerProfile({ ...data, logo_url: logoUrl });
        
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
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-white shadow-md border-b-2">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            {trainerProfile && trainerProfile.logo_url ? (
              <div className="flex items-center gap-4">
                <img
                  src={trainerProfile.logo_url}
                  alt="Trainer Logo"
                  className="h-12 w-auto object-contain rounded-lg shadow-sm"
                />
                <div>
                  <h1 
                    className="text-2xl font-bold"
                    style={{ color: secondaryColor }}
                  >
                    {trainerProfile.gym_name || 'Gym Diet Plan Maker'}
                  </h1>
                  {trainerProfile.gym_name && (
                    <p className="text-sm text-gray-600 font-medium">Professional Diet Plan System</p>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <img
                  src="/images/logo.png"
                  alt="Gym Diet Plan Maker"
                  className="h-12 w-auto object-contain rounded-lg shadow-sm"
                />
                <div>
                  <h1 className="text-2xl font-bold" style={{ color: secondaryColor }}>
                    Gym Diet Plan Maker
                  </h1>
                  <p className="text-sm text-gray-600 font-medium">Professional Diet Plan System</p>
                </div>
              </div>
            )}
          </div>
          {user && (
            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="font-semibold text-lg" style={{ color: secondaryColor }}>
                  {user.name}
                </p>
                <p className="text-sm text-gray-600 capitalize">
                  {user.role === 'trainer' ? 'Professional Trainer' : 'Trainee'}
                </p>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleLogout} 
                className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-red-50"
                style={{ color: primaryColor }}
              >
                <LogOut size={18} />
                <span className="font-medium">Logout</span>
              </Button>
            </div>
          )}
        </div>
      </header>
      <main className="flex-1 bg-gray-50">
        {children}
      </main>
      <footer style={{ backgroundColor: secondaryColor }} className="text-white py-6">
        <div className="container mx-auto px-6 text-center">
          <p className="text-lg font-medium">© {new Date().getFullYear()} {trainerProfile?.gym_name || 'Gym Diet Plan Maker'}</p>
          <p className="text-sm opacity-80 mt-1">Professional Nutrition Planning Platform</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
