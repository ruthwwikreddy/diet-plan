
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import EditableDietPlan from '../components/EditableDietPlan';
import MobileNav from '../components/MobileNav';
import { useIsMobile } from '@/hooks/use-mobile';

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  useEffect(() => {
    // Redirect logged in users to appropriate dashboard
    if (user) {
      if (user.role === 'trainer') {
        navigate('/dashboard');
      } else {
        navigate('/trainee-dashboard');
      }
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2 md:gap-4">
            <img src="/assets/images/Muscle-Works-Logo-e1727793657966.png" alt="Muscle Works Logo" className="h-10 md:h-12 w-auto" />
            <h1 className="text-lg md:text-xl font-bold text-muscle-gray hidden xs:block">Gym Diet Plan Maker</h1>
          </div>
          {isMobile ? (
            <MobileNav />
          ) : (
            <nav>
              <ul className="flex space-x-2 md:space-x-4">
                <li>
                  <Button variant="ghost" onClick={() => navigate('/login')} className="text-sm md:text-base px-2 md:px-4">Login</Button>
                </li>
                <li>
                  <Button variant="default" onClick={() => navigate('/register')} className="text-sm md:text-base px-3 md:px-4">Register</Button>
                </li>
              </ul>
            </nav>
          )}
        </div>
      </header>
      
      <main className="flex-1 bg-slate-50 py-6 md:py-8">
        <div className="container mx-auto px-3 md:px-4">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 md:mb-8 text-center leading-tight">
            <span className="text-muscle-red">Gym Diet Plan</span> Maker
          </h1>
          <p className="text-base md:text-xl mb-6 md:mb-10 max-w-2xl mx-auto text-muscle-gray text-center px-2">
            Professional diet planning tool for gym trainers to create customized nutrition plans for their trainees.
          </p>
          {/* Editable Diet Plan Table with Live Preview */}
          <div className="mb-8 md:mb-12">
            <EditableDietPlan />
          </div>
        </div>
      </main>
      
      <footer className="bg-muscle-gray text-white py-6 md:py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-4">
            <img src="/assets/images/Muscle-Works-Logo-e1727793657966.png" alt="Muscle Works Logo" className="h-10 w-auto invert opacity-80" />
            <div>
              <p className="text-sm md:text-base">© {new Date().getFullYear()} Gym Diet Plan Maker</p>
              <p className="text-xs text-gray-300 mt-1">The Fitness Coliseum</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
