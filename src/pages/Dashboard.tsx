
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import TrainerProfile from '@/components/TrainerProfile';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Eye, Download, User, Pencil, CheckSquare, ChevronDown, ChevronUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import DailyChecklist from '@/components/DailyChecklist';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useIsMobile } from '@/hooks/use-mobile';

type DietPlan = {
  id: string;
  trainee_name: string;
  trainee_email: string;
  created_at: string;
};

type Trainee = {
  id: string;
  name: string;
  email: string;
};

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [dietPlans, setDietPlans] = useState<DietPlan[]>([]);
  const [trainees, setTrainees] = useState<Trainee[]>([]);
  const [selectedTraineeId, setSelectedTraineeId] = useState<string | null>(null);
  const [expandedTrainee, setExpandedTrainee] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [trainerProfile, setTrainerProfile] = useState<any>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (user.role !== 'trainer') {
      navigate('/trainee-dashboard');
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch trainer profile for colors
        const { data: profileData } = await supabase
          .from('trainer_profiles')
          .select('*')
          .eq('trainer_id', user.id)
          .single();

        if (profileData) {
          setTrainerProfile(profileData);
        }
        
        // Fetch diet plans
        const { data: planData, error: planError } = await supabase
          .from('diet_plans')
          .select('id, trainee_name, trainee_email, created_at')
          .eq('trainer_id', user.id)
          .order('created_at', { ascending: false });

        if (planError) throw planError;
        setDietPlans(planData || []);
        
        // Extract unique trainees from diet plans
        const uniqueTraineesMap = new Map<string, Trainee>();
        planData?.forEach(plan => {
          if (!uniqueTraineesMap.has(plan.trainee_email)) {
            uniqueTraineesMap.set(plan.trainee_email, {
              id: plan.trainee_email,
              name: plan.trainee_name,
              email: plan.trainee_email
            });
          }
        });
        
        const uniqueTrainees = Array.from(uniqueTraineesMap.values());
        setTrainees(uniqueTrainees);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, navigate]);

  const handleDownloadPDF = (planId: string) => {
    navigate(`/plan/${planId}`);
  };

  const toggleTraineeChecklist = (traineeId: string) => {
    setExpandedTrainee(expandedTrainee === traineeId ? null : traineeId);
  };

  const primaryColor = trainerProfile?.primary_color || '#E31B23';
  const secondaryColor = trainerProfile?.secondary_color || '#4D4D4D';

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto p-4 flex justify-center items-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderColor: primaryColor }}></div>
            <p style={{ color: secondaryColor }}>Loading dashboard...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto p-4 md:p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2" style={{ color: secondaryColor }}>
              Trainer Dashboard
            </h1>
            <p className="text-lg text-gray-600">Manage your client diet plans and branding</p>
          </div>
          <Button 
            className="mt-4 md:mt-0 text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200" 
            style={{ backgroundColor: primaryColor }}
            onClick={() => navigate('/create-plan')}
          >
            <Plus size={20} className="mr-2" />
            Create New Plan
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Trainer Profile Section */}
          <div className="lg:col-span-1">
            <TrainerProfile />
          </div>

          {/* Trainees Daily Checklists */}
          <Card className="lg:col-span-1 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-xl">
                <CheckSquare className="h-6 w-6" style={{ color: primaryColor }} />
                <span style={{ color: secondaryColor }}>Trainee Checklists</span>
              </CardTitle>
              <CardDescription className="text-base">
                Monitor your trainees' daily progress and compliance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {trainees.length > 0 ? (
                trainees.map((trainee) => (
                  <Collapsible key={trainee.id} className="border rounded-lg overflow-hidden shadow-sm">
                    <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full" style={{ backgroundColor: `${primaryColor}20` }}>
                          <User size={20} style={{ color: primaryColor }} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg" style={{ color: secondaryColor }}>{trainee.name}</h3>
                          <p className="text-sm text-gray-600">{trainee.email}</p>
                        </div>
                      </div>
                      <CollapsibleTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => toggleTraineeChecklist(trainee.id)}
                          className="h-8 w-8 p-0 hover:bg-gray-200 rounded-full"
                        >
                          {expandedTrainee === trainee.id ? (
                            <ChevronUp size={16} style={{ color: primaryColor }} />
                          ) : (
                            <ChevronDown size={16} style={{ color: primaryColor }} />
                          )}
                          <span className="sr-only">Toggle checklist</span>
                        </Button>
                      </CollapsibleTrigger>
                    </div>
                    <CollapsibleContent>
                      <div className="p-4 pt-0 bg-white">
                        <DailyChecklist traineeId={trainee.id} readOnly={true} />
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                ))
              ) : (
                <div className="text-center py-16">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: `${primaryColor}10` }}>
                    <User size={32} style={{ color: primaryColor }} />
                  </div>
                  <p className="text-lg font-medium mb-2" style={{ color: secondaryColor }}>
                    No trainees yet
                  </p>
                  <p className="text-gray-500 mb-4">
                    Create a diet plan for a trainee to see their checklist here.
                  </p>
                  <Button 
                    style={{ backgroundColor: primaryColor }}
                    className="text-white"
                    onClick={() => navigate('/create-plan')}
                  >
                    Create First Plan
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Diet Plans */}
          <Card className="lg:col-span-1 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl" style={{ color: secondaryColor }}>Diet Plans</CardTitle>
              <CardDescription className="text-base">
                All diet plans created for your clients
              </CardDescription>
            </CardHeader>
            <CardContent>
              {dietPlans.length > 0 ? (
                <div className="space-y-4">
                  {dietPlans.map((plan) => (
                    <div 
                      key={plan.id} 
                      className="p-4 border rounded-lg shadow-sm bg-gradient-to-r from-white to-gray-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full" style={{ backgroundColor: `${primaryColor}20` }}>
                          <User size={20} style={{ color: primaryColor }} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg" style={{ color: secondaryColor }}>{plan.trainee_name}</h3>
                          <p className="text-sm text-gray-600">{plan.trainee_email}</p>
                          <p className="text-xs text-gray-500">
                            Created: {new Date(plan.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2 self-end sm:self-auto">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => navigate(`/edit-plan/${plan.id}`)}
                          className="hover:bg-gray-100"
                        >
                          <Pencil size={16} className="mr-1" />
                          Edit
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => navigate(`/plan/${plan.id}`)}
                          className="hover:bg-gray-100"
                        >
                          <Eye size={16} className="mr-1" />
                          View
                        </Button>
                        <Button 
                          size="sm" 
                          className="text-white font-medium"
                          style={{ backgroundColor: primaryColor }}
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
                <div className="text-center py-16">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: `${primaryColor}10` }}>
                    <Plus size={32} style={{ color: primaryColor }} />
                  </div>
                  <p className="text-lg font-medium mb-2" style={{ color: secondaryColor }}>
                    No diet plans created yet
                  </p>
                  <p className="text-gray-500 mb-4">
                    Start by creating your first diet plan for a client.
                  </p>
                  <Button 
                    className="text-white font-medium px-6 py-3"
                    style={{ backgroundColor: primaryColor }}
                    onClick={() => navigate('/create-plan')}
                  >
                    <Plus size={18} className="mr-2" />
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
