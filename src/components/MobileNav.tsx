import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, Home, User, FileText, LogIn, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const MobileNav: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate('/');
  };

  return (
    <div className="md:hidden">
      <Button 
        variant="ghost" 
        size="icon" 
        className="relative z-50" 
        onClick={toggleMenu}
        aria-label={isOpen ? "Close menu" : "Open menu"}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </Button>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile menu */}
      <div 
        className={`fixed top-0 right-0 h-full w-4/5 max-w-xs bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <img 
                src="/assets/images/Muscle-Works-Logo-e1727793657966.png" 
                alt="Logo" 
                className="h-10 w-auto" 
              />
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleMenu}
                aria-label="Close menu"
              >
                <X size={20} />
              </Button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto py-4">
            <nav className="flex flex-col space-y-1">
              <Button 
                variant="ghost" 
                className="justify-start px-4 py-3 text-left" 
                onClick={() => handleNavigation('/')}
              >
                <Home size={20} className="mr-3" />
                Home
              </Button>

              {user ? (
                <>
                  <Button 
                    variant="ghost" 
                    className="justify-start px-4 py-3 text-left" 
                    onClick={() => handleNavigation(user.role === 'trainer' ? '/dashboard' : '/trainee-dashboard')}
                  >
                    <User size={20} className="mr-3" />
                    Dashboard
                  </Button>
                  
                  {user.role === 'trainer' && (
                    <Button 
                      variant="ghost" 
                      className="justify-start px-4 py-3 text-left" 
                      onClick={() => handleNavigation('/create-plan')}
                    >
                      <FileText size={20} className="mr-3" />
                      Create Plan
                    </Button>
                  )}
                  
                  <Button 
                    variant="ghost" 
                    className="justify-start px-4 py-3 text-left text-red-600 hover:text-red-700 hover:bg-red-50" 
                    onClick={handleLogout}
                  >
                    <LogOut size={20} className="mr-3" />
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    variant="ghost" 
                    className="justify-start px-4 py-3 text-left" 
                    onClick={() => handleNavigation('/login')}
                  >
                    <LogIn size={20} className="mr-3" />
                    Login
                  </Button>
                  
                  <Button 
                    variant="default" 
                    className="justify-start mx-4 mt-2" 
                    onClick={() => handleNavigation('/register')}
                  >
                    Register
                  </Button>
                </>
              )}
            </nav>
          </div>

          <div className="p-4 border-t text-center text-xs text-gray-500">
            <p>© {new Date().getFullYear()} Gym Diet Plan Maker</p>
            <p className="mt-1">The Fitness Coliseum</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileNav;
