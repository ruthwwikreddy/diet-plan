
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { Card } from '@/components/ui/card';
import DietPlanTemplate from '@/components/DietPlanTemplate';
import { supabase } from '@/integrations/supabase/client';
import generatePDF from 'react-to-pdf';
import { toast } from 'sonner';

type DietPlanData = {
  id: string;
  traineeName: string;
  traineeEmail: string;
  createdAt: string;
  meals: {
    earlyMorning: { name: string; quantity: string; protein: string; carbs: string; fats: string; calories: string; };
    breakfast: { name: string; quantity: string; protein: string; carbs: string; fats: string; calories: string; };
    snack1: { name: string; quantity: string; protein: string; carbs: string; fats: string; calories: string; };
    lunch: { name: string; quantity: string; protein: string; carbs: string; fats: string; calories: string; };
    preWorkout: { name: string; quantity: string; protein: string; carbs: string; fats: string; calories: string; };
    dinner: { name: string; quantity: string; protein: string; carbs: string; fats: string; calories: string; };
  };
  totals: {
    protein: string;
    carbs: string;
    fats: string;
    calories: string;
  };
};

const ViewPlan = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [dietPlan, setDietPlan] = useState<DietPlanData | null>(null);
  const [loading, setLoading] = useState(true);
  const [pdfRef, setPdfRef] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchDietPlan = async () => {
      try {
        if (!id) {
          toast.error('Diet plan ID is missing');
          navigate(user.role === 'trainer' ? '/dashboard' : '/trainee-dashboard');
          return;
        }

        const { data, error } = await supabase
          .from('diet_plans')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          console.error('Error fetching diet plan:', error);
          toast.error('Failed to load diet plan');
          return;
        }

        if (data) {
          const formattedPlan: DietPlanData = {
            id: data.id,
            traineeName: data.trainee_name,
            traineeEmail: data.trainee_email,
            createdAt: data.created_at,
            meals: data.meals as DietPlanData['meals'],
            totals: data.totals as DietPlanData['totals']
          };
          
          setDietPlan(formattedPlan);
        } else {
          toast.error('Diet plan not found');
        }
      } catch (error) {
        console.error('Error fetching diet plan:', error);
        toast.error('Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchDietPlan();
  }, [id, user, navigate]);

  const handleDownloadPDF = () => {
    if (!dietPlan) return;
    
    try {
      generatePDF(() => pdfRef, {
        filename: `diet-plan-${dietPlan.traineeName.toLowerCase().replace(/\s+/g, '-')}.pdf`,
        page: { margin: 10, format: 'a4' }
      });
      toast.success('PDF downloaded successfully');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate PDF');
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto p-4 flex justify-center items-center min-h-[60vh]">
          <p>Loading diet plan...</p>
        </div>
      </Layout>
    );
  }

  if (!dietPlan) {
    return (
      <Layout>
        <div className="container mx-auto p-4 flex justify-center items-center min-h-[60vh]">
          <p>Diet plan not found.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto p-4 md:p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-muscle-gray">Diet Plan Details</h1>
            <p className="text-muted-foreground">
              Created on {new Date(dietPlan.createdAt).toLocaleDateString()} for {dietPlan.traineeName}
            </p>
          </div>
          <Button 
            className="mt-4 md:mt-0 bg-muscle-red hover:bg-red-700" 
            onClick={handleDownloadPDF}
          >
            <Download size={18} className="mr-1" />
            Download PDF
          </Button>
        </div>

        <Card className="mb-6 p-1 sm:p-4">
          <div ref={(ref) => setPdfRef(ref)}>
            <DietPlanTemplate initialDietPlan={dietPlan} />
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default ViewPlan;
