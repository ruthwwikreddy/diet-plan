
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Eye, Download, User, Pencil } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import generatePDF from 'react-to-pdf';

type DietPlan = {
  id: string;
  trainee_name: string;
  trainee_email: string;
  created_at: string;
};

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [dietPlans, setDietPlans] = useState<DietPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (user.role !== 'trainer') {
      navigate('/trainee-dashboard');
      return;
    }

    const fetchDietPlans = async () => {
      try {
        const { data, error } = await supabase
          .from('diet_plans')
          .select('id, trainee_name, trainee_email, created_at')
          .eq('trainer_id', user.id)
          .order('created_at', { ascending: false });

        if (error) {
          throw error;
        }

        setDietPlans(data || []);
      } catch (error) {
        console.error('Error fetching diet plans:', error);
        toast.error('Failed to load diet plans');
      } finally {
        setLoading(false);
      }
    };

    fetchDietPlans();
  }, [user, navigate]);

  const handleDownloadPDF = (planId: string) => {
    // Navigate to the plan view first
    navigate(`/plan/${planId}`);
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto p-4 flex justify-center items-center min-h-[60vh]">
          <p>Loading diet plans...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto p-4 md:p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-muscle-gray mb-1">Trainer Dashboard</h1>
            <p className="text-muted-foreground">Manage your client diet plans</p>
          </div>
          <Button 
            className="mt-4 md:mt-0 bg-muscle-red hover:bg-red-700" 
            onClick={() => navigate('/create-plan')}
          >
            <Plus size={18} className="mr-1" />
            Create New Plan
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Diet Plans</CardTitle>
              <CardDescription>
                All diet plans created for your clients
              </CardDescription>
            </CardHeader>
            <CardContent>
              {dietPlans.length > 0 ? (
                <div className="space-y-4">
                  {dietPlans.map((plan) => (
                    <div 
                      key={plan.id} 
                      className="p-4 border rounded-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="bg-muscle-red/10 p-2 rounded-full">
                          <User size={20} className="text-muscle-red" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{plan.trainee_name}</h3>
                          <p className="text-sm text-muted-foreground">{plan.trainee_email}</p>
                          <p className="text-xs text-muted-foreground">
                            Created: {new Date(plan.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2 self-end sm:self-auto">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => navigate(`/edit-plan/${plan.id}`)}
                        >
                          <Pencil size={16} className="mr-1" />
                          Edit
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => navigate(`/plan/${plan.id}`)}
                        >
                          <Eye size={16} className="mr-1" />
                          View
                        </Button>
                        <Button 
                          size="sm" 
                          className="bg-muscle-red hover:bg-red-700"
                          onClick={() => handleDownloadPDF(plan.id)}
                        >
                          <Download size={16} className="mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground mb-2">
                    You haven't created any diet plans yet.
                  </p>
                  <Button 
                    className="bg-muscle-red hover:bg-red-700 mt-2" 
                    onClick={() => navigate('/create-plan')}
                  >
                    <Plus size={18} className="mr-1" />
                    Create Your First Plan
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
