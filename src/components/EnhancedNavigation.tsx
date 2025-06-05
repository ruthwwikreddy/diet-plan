
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, Sparkles, Star, Trophy, Target, Shield } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';

const EnhancedNavigation: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const isMobile = useIsMobile();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const isHomePage = location.pathname === '/';

  if (!isHomePage) return null;

  return (
    <>
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/95 backdrop-blur-lg shadow-xl border-b border-red-100' 
            : 'bg-transparent'
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <div 
              className="flex items-center gap-3 cursor-pointer group"
              onClick={() => navigate('/')}
            >
              <div className={`p-2 rounded-xl transition-all duration-300 ${
                isScrolled 
                  ? 'bg-red-600 shadow-lg' 
                  : 'bg-white/20 backdrop-blur-sm'
              }`}>
                <img
                  src="/images/logo.png"
                  alt="Muscle Works Logo"
                  className="h-8 w-8 sm:h-10 sm:w-10 object-contain transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              <div className="hidden sm:block">
                <h1 className={`text-xl sm:text-2xl font-bold transition-colors duration-300 ${
                  isScrolled ? 'text-gray-900' : 'text-white'
                }`}>
                  Gym Diet Plan Maker
                </h1>
                <p className={`text-sm font-medium transition-colors duration-300 ${
                  isScrolled ? 'text-red-600' : 'text-red-100'
                }`}>
                  Professional Nutrition Planning
                </p>
              </div>
            </div>

            {/* Desktop Navigation */}
            {!isMobile && (
              <div className="hidden md:flex items-center gap-8">
                <div className="flex items-center gap-6">
                  <Button
                    variant="ghost"
                    className={`font-semibold transition-all duration-300 hover:scale-105 ${
                      isScrolled 
                        ? 'text-gray-700 hover:text-red-600 hover:bg-red-50' 
                        : 'text-white hover:text-red-100 hover:bg-white/10'
                    }`}
                    onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Features
                  </Button>
                  <Button
                    variant="ghost"
                    className={`font-semibold transition-all duration-300 hover:scale-105 ${
                      isScrolled 
                        ? 'text-gray-700 hover:text-red-600 hover:bg-red-50' 
                        : 'text-white hover:text-red-100 hover:bg-white/10'
                    }`}
                    onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    <Target className="w-4 h-4 mr-2" />
                    Demo
                  </Button>
                </div>

                <div className="flex items-center gap-4">
                  {user ? (
                    <Button 
                      onClick={() => navigate(user.role === 'trainer' ? '/dashboard' : '/trainee-dashboard')}
                      className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                    >
                      <Trophy className="w-4 h-4 mr-2" />
                      Dashboard
                    </Button>
                  ) : (
                    <>
                      <Button 
                        variant="ghost"
                        onClick={() => navigate('/login')}
                        className={`font-semibold px-6 py-2 rounded-xl transition-all duration-300 hover:scale-105 ${
                          isScrolled 
                            ? 'text-gray-700 hover:bg-gray-100 border border-gray-200' 
                            : 'text-white hover:bg-white/10 border border-white/30'
                        }`}
                      >
                        Sign In
                      </Button>
                      <Button 
                        onClick={() => navigate('/register')}
                        className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                      >
                        <Star className="w-4 h-4 mr-2" />
                        Get Started
                      </Button>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Mobile Menu Button */}
            {isMobile && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`relative z-50 transition-all duration-300 hover:scale-105 ${
                  isScrolled 
                    ? 'text-gray-700 hover:bg-gray-100' 
                    : 'text-white hover:bg-white/10'
                }`}
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </Button>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobile && (
          <div 
            className={`fixed inset-0 bg-white transform transition-transform duration-500 ease-out ${
              isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
            style={{ top: '0' }}
          >
            <div className="flex flex-col h-full">
              {/* Mobile Header */}
              <div className="bg-gradient-to-r from-red-600 to-red-700 p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-white/20 p-2 rounded-xl">
                      <img
                        src="/images/logo.png"
                        alt="Muscle Works Logo"
                        className="h-8 w-8 object-contain"
                      />
                    </div>
                    <div>
                      <h2 className="font-bold text-lg">Menu</h2>
                      <p className="text-red-100 text-sm">Navigate your journey</p>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-white hover:bg-white/20 rounded-full"
                  >
                    <X size={24} />
                  </Button>
                </div>
                
                {user && (
                  <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
                    <div className="flex items-center gap-3">
                      <div className="bg-white/20 p-2 rounded-full">
                        <Shield className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-semibold">{user.name}</p>
                        <p className="text-white/80 text-sm capitalize">{user.role}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile Navigation */}
              <div className="flex-1 overflow-y-auto py-6">
                <nav className="flex flex-col px-4 space-y-2">
                  <Button 
                    variant="ghost" 
                    className="justify-start px-6 py-4 text-left text-lg hover:bg-red-50 hover:text-red-600 rounded-2xl transition-all duration-200" 
                    onClick={() => {
                      document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <Sparkles size={24} className="mr-4" />
                    <span className="font-medium">Features</span>
                  </Button>

                  <Button 
                    variant="ghost" 
                    className="justify-start px-6 py-4 text-left text-lg hover:bg-red-50 hover:text-red-600 rounded-2xl transition-all duration-200" 
                    onClick={() => {
                      document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' });
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <Target size={24} className="mr-4" />
                    <span className="font-medium">Try Demo</span>
                  </Button>

                  {user ? (
                    <Button 
                      variant="ghost" 
                      className="justify-start px-6 py-4 text-left text-lg hover:bg-red-50 hover:text-red-600 rounded-2xl transition-all duration-200" 
                      onClick={() => {
                        navigate(user.role === 'trainer' ? '/dashboard' : '/trainee-dashboard');
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      <Trophy size={24} className="mr-4" />
                      <span className="font-medium">Dashboard</span>
                    </Button>
                  ) : (
                    <>
                      <div className="my-4 border-t border-gray-200"></div>
                      
                      <Button 
                        variant="ghost" 
                        className="justify-start px-6 py-4 text-left text-lg hover:bg-red-50 hover:text-red-600 rounded-2xl transition-all duration-200" 
                        onClick={() => {
                          navigate('/login');
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        <Shield size={24} className="mr-4" />
                        <span className="font-medium">Sign In</span>
                      </Button>
                      
                      <div className="px-4 mt-4">
                        <Button 
                          className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-2xl font-semibold shadow-lg text-lg" 
                          onClick={() => {
                            navigate('/register');
                            setIsMobileMenuOpen(false);
                          }}
                        >
                          <Star className="w-5 h-5 mr-3" />
                          Get Started Free
                        </Button>
                      </div>
                    </>
                  )}
                </nav>
              </div>

              {/* Mobile Footer */}
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
        )}
      </nav>

      {/* Overlay for mobile menu */}
      {isMobile && isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 backdrop-blur-md"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
};

export default EnhancedNavigation;
