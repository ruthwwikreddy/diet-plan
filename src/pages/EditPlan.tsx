
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import DietPlanTemplate from '@/components/DietPlanTemplate';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Save, Download, Eye } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import generatePDF from 'react-to-pdf';

type Meal = {
  name: string;
  quantity: string;
  protein: string;
  carbs: string;
  fats: string;
  calories: string;
};

type DietPlanFormData = {
  traineeName: string;
  traineeEmail: string;
  meals: {
    earlyMorning: Meal;
    breakfast: Meal;
    snack1: Meal;
    lunch: Meal;
    preWorkout: Meal;
    dinner: Meal;
  };
  totals: {
    protein: string;
    carbs: string;
    fats: string;
    calories: string;
  };
};

const EditPlan = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('edit');
  const [formData, setFormData] = useState<DietPlanFormData>({
    traineeName: '',
    traineeEmail: '',
    meals: {
      earlyMorning: { name: 'Green Tea + Lemon', quantity: '1 cup', protein: '0g', carbs: '0g', fats: '0g', calories: '2' },
      breakfast: { name: 'Apple-Cinnamon Oatmeal', quantity: '1 bowl', protein: '5g', carbs: '30g', fats: '3g', calories: '170' },
      snack1: { name: 'Greek Yogurt + Berries', quantity: '200g', protein: '15g', carbs: '10g', fats: '0g', calories: '100' },
      lunch: { name: 'Grilled Chicken Salad', quantity: '1 plate', protein: '25g', carbs: '15g', fats: '8g', calories: '320' },
      preWorkout: { name: 'Banana + Protein Shake', quantity: '1 banana + 1 scoop', protein: '20g', carbs: '25g', fats: '1g', calories: '200' },
      dinner: { name: 'Baked Salmon + Vegetables', quantity: '150g + 100g', protein: '30g', carbs: '10g', fats: '15g', calories: '350' },
    },
    totals: {
      protein: '95g',
      carbs: '90g',
      fats: '27g',
      calories: '1142',
    }
  });
  const [pdfRef, setPdfRef] = useState<HTMLDivElement | null>(null);
  const [submitting, setSubmitting] = useState(false);
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

    const fetchDietPlan = async () => {
      try {
        if (!id) {
          toast.error("Diet plan ID is missing");
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
          setFormData({
            traineeName: data.trainee_name,
            traineeEmail: data.trainee_email,
            meals: data.meals as DietPlanFormData['meals'],
            totals: data.totals as DietPlanFormData['totals']
          });
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

  const calculateTotals = () => {
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFats = 0;
    let totalCalories = 0;

    // Helper to parse nutrient values (removing 'g' and converting to number)
    const parseNutrient = (value: string) => {
      const numericValue = parseFloat(value.replace('g', ''));
      return isNaN(numericValue) ? 0 : numericValue;
    };

    // Add up all meal values
    Object.values(formData.meals).forEach(meal => {
      totalProtein += parseNutrient(meal.protein);
      totalCarbs += parseNutrient(meal.carbs);
      totalFats += parseNutrient(meal.fats);
      totalCalories += parseFloat(meal.calories);
    });

    // Update totals
    setFormData(prev => ({
      ...prev,
      totals: {
        protein: `${totalProtein}g`,
        carbs: `${totalCarbs}g`,
        fats: `${totalFats}g`,
        calories: `${totalCalories}`,
      }
    }));
  };

  const handleFormChange = (field: string, value: string) => {
    // Handle nested fields using dot notation (e.g., "meals.breakfast.name")
    const fieldPath = field.split('.');
    
    setFormData(prev => {
      const newData = { ...prev };
      
      if (fieldPath.length === 1) {
        // Top-level field (like traineeName, traineeEmail, etc.)
        newData[fieldPath[0] as keyof DietPlanFormData] = value as any;
      } else if (fieldPath.length === 3) {
        // Nested field (e.g., meals.breakfast.name)
        const [object, key, property] = fieldPath;
        
        if (object === 'meals') {
          const mealType = key as keyof typeof newData.meals;
          const propertyName = property as keyof Meal;
          
          // Create a new meal object with the updated property
          newData.meals[mealType] = {
            ...newData.meals[mealType],
            [propertyName]: value
          };
        } else if (object === 'totals') {
          const propertyName = key as keyof typeof newData.totals;
          newData.totals[propertyName] = value;
        }
      }
      
      return newData;
    });
    
    // Recalculate totals when meal nutrient data changes
    if (field.includes('meals') && (field.includes('protein') || field.includes('carbs') || 
                                   field.includes('fats') || field.includes('calories'))) {
      setTimeout(calculateTotals, 100); // Small timeout to ensure state is updated
    }
  };

  const handleTraineeFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    handleFormChange(name, value);
  };

  const handlePreviewPDF = () => {
    if (formData.traineeName.trim() === '' || formData.traineeEmail.trim() === '') {
      toast.error("Please fill in all trainee information fields.");
      return;
    }
    
    setActiveTab('preview');
  };

  const handleDownloadPDF = () => {
    if (formData.traineeName.trim() === '' || formData.traineeEmail.trim() === '') {
      toast.error("Please fill in all trainee information fields.");
      return;
    }

    try {
      generatePDF(() => pdfRef, {
        filename: `diet-plan-${formData.traineeName.toLowerCase().replace(/\s+/g, '-')}.pdf`,
        page: { margin: 10, format: 'a4' }
      });
      toast.success('PDF downloaded successfully');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate PDF');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.traineeName || !formData.traineeEmail) {
      toast.error("Please fill in all trainee information fields.");
      return;
    }
    
    try {
      setSubmitting(true);

      // Update plan in database
      const { error } = await supabase
        .from('diet_plans')
        .update({
          trainee_name: formData.traineeName,
          trainee_email: formData.traineeEmail,
          meals: formData.meals,
          totals: formData.totals
        })
        .eq('id', id);

      if (error) {
        throw error;
      }

      toast.success("Diet plan updated successfully!");
      navigate('/dashboard');
    } catch (error) {
      console.error('Error updating diet plan:', error);
      toast.error("Failed to update diet plan. Please try again.");
    } finally {
      setSubmitting(false);
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

  return (
    <Layout>
      <div className="container mx-auto p-4 md:p-6">
        <div className="flex items-center mb-6">
          <Button variant="ghost" onClick={() => navigate('/dashboard')} className="mr-2">
            <ArrowLeft size={18} />
          </Button>
          <h1 className="text-2xl md:text-3xl font-bold text-muscle-gray">Edit Diet Plan</h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Trainee Information Card */}
            <Card className="lg:col-span-1">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold mb-4">Trainee Information</h2>
                  
                  <div className="space-y-2">
                    <Label htmlFor="traineeName">Trainee Name</Label>
                    <Input
                      id="traineeName"
                      name="traineeName"
                      value={formData.traineeName}
                      onChange={handleTraineeFormChange}
                      placeholder="John Doe"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="traineeEmail">Trainee Email</Label>
                    <Input
                      id="traineeEmail"
                      name="traineeEmail"
                      type="email"
                      value={formData.traineeEmail}
                      onChange={handleTraineeFormChange}
                      placeholder="trainee@example.com"
                    />
                  </div>
                  
                  <div className="pt-4">
                    <Button 
                      type="submit" 
                      className="w-full bg-muscle-red hover:bg-red-700"
                      disabled={submitting}
                    >
                      <Save size={16} className="mr-1" />
                      {submitting ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Diet Plan Editor/Preview Card */}
            <Card className="lg:col-span-2">
              <CardContent className="pt-6">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-4">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="edit">Edit Plan</TabsTrigger>
                    <TabsTrigger value="preview">Preview</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="edit">
                    {/* Use our new EditableDietPlan component instead */}
                    <div className="bg-white p-4 rounded-md shadow-sm">
                      <div className="mb-4">
                        <Label htmlFor="traineeName" className="text-sm font-medium">Trainee Name</Label>
                        <Input 
                          id="traineeName"
                          name="traineeName"
                          value={formData.traineeName}
                          onChange={handleTraineeFormChange}
                          className="mt-1"
                          placeholder="Enter trainee name"
                        />
                      </div>
                      
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                          <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                              <th className="p-3 text-left text-sm font-semibold text-gray-600">Meal</th>
                              <th className="p-3 text-left text-sm font-semibold text-gray-600">Food Item</th>
                              <th className="p-3 text-center text-sm font-semibold text-gray-600">Quantity</th>
                              <th className="p-3 text-center text-sm font-semibold text-gray-600">Protein (g)</th>
                              <th className="p-3 text-center text-sm font-semibold text-gray-600">Carbs (g)</th>
                              <th className="p-3 text-center text-sm font-semibold text-gray-600">Fats (g)</th>
                              <th className="p-3 text-center text-sm font-semibold text-gray-600">Calories</th>
                            </tr>
                          </thead>
                          <tbody>
                            {Object.entries(formData.meals).map(([mealKey, meal], index) => {
                              const mealInfo = {
                                earlyMorning: { label: 'Early Morning', description: 'Empty stomach' },
                                breakfast: { label: 'Breakfast', description: 'First meal of the day' },
                                snack1: { label: 'Snack 1', description: 'Mid-morning snack' },
                                lunch: { label: 'Lunch', description: 'Midday meal' },
                                preWorkout: { label: 'Pre-workout', description: 'Before exercise' },
                                dinner: { label: 'Dinner', description: 'Evening meal' },
                              }[mealKey as keyof typeof formData.meals];
                              
                              return (
                                <tr key={mealKey} className={`border-b border-gray-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-gray-50 transition-colors`}>
                                  <td className="p-3">
                                    <div className="font-medium text-gray-900">{mealInfo.label}</div>
                                    <div className="text-xs text-gray-500">{mealInfo.description}</div>
                                  </td>
                                  <td className="p-3">
                                    <Input
                                      value={meal.name}
                                      onChange={(e) => handleFormChange(`meals.${mealKey}.name`, e.target.value)}
                                      className="border-gray-200 focus:border-muscle-red"
                                      disabled={mealKey === 'earlyMorning'}
                                    />
                                  </td>
                                  <td className="p-3">
                                    <Input
                                      value={meal.quantity}
                                      onChange={(e) => handleFormChange(`meals.${mealKey}.quantity`, e.target.value)}
                                      className="border-gray-200 focus:border-muscle-red text-center"
                                    />
                                  </td>
                                  <td className="p-3">
                                    <Input
                                      type="text"
                                      value={meal.protein}
                                      onChange={(e) => handleFormChange(`meals.${mealKey}.protein`, e.target.value)}
                                      className="border-gray-200 focus:border-muscle-red text-center"
                                    />
                                  </td>
                                  <td className="p-3">
                                    <Input
                                      type="text"
                                      value={meal.carbs}
                                      onChange={(e) => handleFormChange(`meals.${mealKey}.carbs`, e.target.value)}
                                      className="border-gray-200 focus:border-muscle-red text-center"
                                    />
                                  </td>
                                  <td className="p-3">
                                    <Input
                                      type="text"
                                      value={meal.fats}
                                      onChange={(e) => handleFormChange(`meals.${mealKey}.fats`, e.target.value)}
                                      className="border-gray-200 focus:border-muscle-red text-center"
                                    />
                                  </td>
                                  <td className="p-3">
                                    <Input
                                      type="text"
                                      value={meal.calories}
                                      onChange={(e) => handleFormChange(`meals.${mealKey}.calories`, e.target.value)}
                                      className="border-gray-200 focus:border-muscle-red text-center"
                                    />
                                  </td>
                                </tr>
                              );
                            })}
                            <tr className="bg-muscle-red/5 border-b border-muscle-red/20">
                              <td className="p-3 font-bold text-muscle-red" colSpan={2}>Daily Totals</td>
                              <td className="p-3"></td>
                              <td className="p-3 text-center font-bold">{formData.totals.protein}</td>
                              <td className="p-3 text-center font-bold">{formData.totals.carbs}</td>
                              <td className="p-3 text-center font-bold">{formData.totals.fats}</td>
                              <td className="p-3 text-center font-bold">{formData.totals.calories}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      
                      <div className="mt-6 flex justify-end">
                        <Button variant="outline" onClick={() => setActiveTab('preview')}>
                          Preview Plan
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="preview">
                    <div className="bg-white p-4 rounded-md shadow-sm">
                      <div className="flex justify-end mb-4">
                        <Button variant="outline" className="mr-2" onClick={handlePreviewPDF}>
                          <Eye size={16} className="mr-1" />
                          Full Preview
                        </Button>
                        <Button variant="outline" onClick={handleDownloadPDF}>
                          <Download size={16} className="mr-1" />
                          Download PDF
                        </Button>
                      </div>
                      <div ref={(ref) => setPdfRef(ref)}>
                        <DietPlanTemplate initialDietPlan={formData} />
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default EditPlan;
