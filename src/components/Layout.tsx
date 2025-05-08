
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

type LayoutProps = {
  children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-muscle-gray">Gym Diet Plan Maker</h1>
          </div>
          {user && (
            <div className="flex items-center gap-4">
              <span className="text-muscle-gray font-medium">
                {user.role === 'trainer' ? 'Trainer' : 'Trainee'}: {user.name}
              </span>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="flex items-center gap-1">
                <LogOut size={16} />
                <span>Logout</span>
              </Button>
            </div>
          )}
        </div>
      </header>
      <main className="flex-1">
        {children}
      </main>
      <footer className="bg-muscle-gray text-white py-4">
        <div className="container mx-auto px-4 text-center">
          <p>© {new Date().getFullYear()} Gym Diet Plan Maker</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
