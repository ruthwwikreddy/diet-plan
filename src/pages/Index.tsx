
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import EditableDietPlan from '../components/EditableDietPlan';

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

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
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <img src="/assets/images/Muscle-Works-Logo-e1727793657966.png" alt="Muscle Works Logo" className="h-12 w-auto" />
            <h1 className="text-xl font-bold text-muscle-gray">Gym Diet Plan Maker</h1>
          </div>
          <nav>
            <ul className="flex space-x-4">
              <li>
                <Button variant="ghost" onClick={() => navigate('/login')}>Login</Button>
              </li>
              <li>
                <Button variant="default" onClick={() => navigate('/register')}>Register</Button>
              </li>
            </ul>
          </nav>
        </div>
      </header>
      
      <main className="flex-1 bg-slate-50 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center">
            <span className="text-muscle-red">Gym Diet Plan</span> Maker
          </h1>
          <p className="text-lg md:text-xl mb-10 max-w-2xl mx-auto text-muscle-gray text-center">
            Professional diet planning tool for gym trainers to create customized nutrition plans for their trainees.
          </p>
          {/* Editable Diet Plan Table with Live Preview */}
          <div className="mb-12">
            <EditableDietPlan />
          </div>
        </div>
      </main>
      
      <footer className="bg-muscle-gray text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>© {new Date().getFullYear()} Gym Diet Plan Maker</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
