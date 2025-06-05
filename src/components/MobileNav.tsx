
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, Home, User, FileText, LogIn, LogOut, Sparkles } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const MobileNav: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

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
        className="relative z-50 mobile-button hover:bg-red-100 active:scale-95" 
        onClick={toggleMenu}
        aria-label={isOpen ? "Close menu" : "Open menu"}
      >
        <div className="relative w-6 h-6">
          <span className={`absolute inset-0 transition-all duration-300 ${isOpen ? 'rotate-45' : ''}`}>
            {isOpen ? <X size={24} className="text-red-600" /> : <Menu size={24} className="text-gray-700" />}
          </span>
        </div>
      </Button>

      {/* Enhanced Overlay with blur */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 backdrop-blur-md transition-all duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Enhanced Mobile menu */}
      <div 
        className={`fixed top-0 right-0 h-full w-full max-w-sm bg-white z-50 transform transition-all duration-500 ease-out shadow-2xl ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header with gradient */}
          <div className="bg-gradient-to-r from-red-600 to-red-700 p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-full">
                  <img
                    src="/images/logo.png"
                    alt="Gym Diet Plan Maker"
                    className="w-6 h-6 object-contain"
                  />
                </div>
                <div>
                  <h2 className="font-bold text-lg">Menu</h2>
                  <p className="text-white/80 text-sm">Navigate your journey</p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleMenu}
                className="text-white hover:bg-white/20 rounded-full"
                aria-label="Close menu"
              >
                <X size={24} />
              </Button>
            </div>
            
            {user && (
              <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 p-2 rounded-full">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold">{user.name}</p>
                    <p className="text-white/80 text-sm capitalize">{user.role}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Items */}
          <div className="flex-1 overflow-y-auto py-6">
            <nav className="flex flex-col px-4 space-y-2">
              <Button 
                variant="ghost" 
                className="justify-start px-4 py-4 text-left mobile-button hover:bg-red-50 hover:text-red-600 rounded-2xl transition-all duration-200" 
                onClick={() => handleNavigation('/')}
              >
                <Home size={20} className="mr-4" />
                <span className="font-medium">Home</span>
              </Button>

              {user ? (
                <>
                  <Button 
                    variant="ghost" 
                    className="justify-start px-4 py-4 text-left mobile-button hover:bg-red-50 hover:text-red-600 rounded-2xl transition-all duration-200" 
                    onClick={() => handleNavigation(user.role === 'trainer' ? '/dashboard' : '/trainee-dashboard')}
                  >
                    <User size={20} className="mr-4" />
                    <span className="font-medium">Dashboard</span>
                  </Button>
                  
                  {user.role === 'trainer' && (
                    <Button 
                      variant="ghost" 
                      className="justify-start px-4 py-4 text-left mobile-button hover:bg-red-50 hover:text-red-600 rounded-2xl transition-all duration-200" 
                      onClick={() => handleNavigation('/create-plan')}
                    >
                      <FileText size={20} className="mr-4" />
                      <span className="font-medium">Create Plan</span>
                    </Button>
                  )}
                  
                  <div className="my-4 border-t border-gray-200"></div>
                  
                  <Button 
                    variant="ghost" 
                    className="justify-start px-4 py-4 text-left text-red-600 hover:text-red-700 hover:bg-red-50 rounded-2xl transition-all duration-200" 
                    onClick={handleLogout}
                  >
                    <LogOut size={20} className="mr-4" />
                    <span className="font-medium">Logout</span>
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    variant="ghost" 
                    className="justify-start px-4 py-4 text-left mobile-button hover:bg-red-50 hover:text-red-600 rounded-2xl transition-all duration-200" 
                    onClick={() => handleNavigation('/login')}
                  >
                    <LogIn size={20} className="mr-4" />
                    <span className="font-medium">Sign In</span>
                  </Button>
                  
                  <div className="px-4 mt-4">
                    <Button 
                      className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95" 
                      onClick={() => handleNavigation('/register')}
                    >
                      Get Started Free
                    </Button>
                  </div>
                </>
              )}
            </nav>
          </div>

          {/* Enhanced Footer */}
          <div className="border-t border-gray-200 p-6 bg-gray-50">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-700">© {new Date().getFullYear()} Gym Diet Plan Maker</p>
              <p className="text-xs text-gray-500 mt-1">Professional Nutrition Planning</p>
              <div className="mt-3 flex justify-center">
                <div className="bg-gradient-to-r from-red-600 to-red-700 h-1 w-16 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileNav;
