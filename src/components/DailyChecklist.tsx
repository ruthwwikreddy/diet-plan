
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Loader2, Save, Plus, Trash2, CheckCircle, Apple } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useIsMobile } from '@/hooks/use-mobile';

interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
  trainee_id: string;
  created_at: string;
  is_diet_item?: boolean;
  meal_type?: string;
}

interface DailyChecklistProps {
  traineeId?: string;
  readOnly?: boolean;
}

interface DietPlanMeals {
  breakfast?: { name: string; };
  lunch?: { name: string; };
  dinner?: { name: string; };
  snack1?: { name: string; };
  preWorkout?: { name: string; };
  earlyMorning?: { name: string; };
}

const DailyChecklist: React.FC<DailyChecklistProps> = ({ traineeId, readOnly = false }) => {
  const { user } = useAuth();
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [newItemText, setNewItemText] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dietItems, setDietItems] = useState<ChecklistItem[]>([]);
  const isMobile = useIsMobile();
  
  // Use demo data if no user (for homepage demo)
  const effectiveTraineeId = traineeId || user?.id || 'demo';
  const isDemo = effectiveTraineeId === 'demo';
  const today = format(new Date(), 'yyyy-MM-dd');

  // Default demo items for homepage - diet-focused
  const demoItems = [
    { id: '1', text: 'Breakfast: Oatmeal with berries and protein powder', completed: true, trainee_id: 'demo', created_at: new Date().toISOString(), is_diet_item: true, meal_type: 'breakfast' },
    { id: '2', text: 'Mid-morning snack: Greek yogurt with almonds', completed: true, trainee_id: 'demo', created_at: new Date().toISOString(), is_diet_item: true, meal_type: 'snack' },
    { id: '3', text: 'Lunch: Grilled chicken with quinoa and vegetables', completed: false, trainee_id: 'demo', created_at: new Date().toISOString(), is_diet_item: true, meal_type: 'lunch' },
    { id: '4', text: 'Afternoon snack: Protein shake with banana', completed: false, trainee_id: 'demo', created_at: new Date().toISOString(), is_diet_item: true, meal_type: 'snack' },
    { id: '5', text: 'Dinner: Salmon with sweet potato and broccoli', completed: false, trainee_id: 'demo', created_at: new Date().toISOString(), is_diet_item: true, meal_type: 'dinner' },
    { id: '6', text: 'Take daily vitamins and supplements', completed: false, trainee_id: 'demo', created_at: new Date().toISOString(), is_diet_item: true, meal_type: 'supplement' },
    { id: '7', text: 'Drink 8 glasses of water throughout the day', completed: false, trainee_id: 'demo', created_at: new Date().toISOString(), is_diet_item: true, meal_type: 'hydration' },
  ];

  useEffect(() => {
    if (isDemo) {
      setChecklist(demoItems);
      setDietItems(demoItems);
      setLoading(false);
      return;
    }

    if (!effectiveTraineeId || effectiveTraineeId === 'demo') return;
    
    const fetchChecklistAndDiet = async () => {
      setLoading(true);
      
      try {
        // Fetch existing checklist
        const { data: checklistData, error: checklistError } = await supabase
          .from('daily_checklist')
          .select('*')
          .eq('trainee_id', effectiveTraineeId)
          .eq('date', today)
          .order('created_at', { ascending: true });
          
        if (checklistError) throw checklistError;
        
        // Fetch diet plan for the trainee to auto-generate diet items
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('email')
          .eq('id', effectiveTraineeId)
          .single();
          
        if (userError) throw userError;
        
        if (userData?.email) {
          const { data: dietData, error: dietError } = await supabase
            .from('diet_plans')
            .select('*')
            .eq('trainee_email', userData.email)
            .order('created_at', { ascending: false })
            .limit(1);
            
          if (!dietError && dietData && dietData.length > 0) {
            const latestDiet = dietData[0];
            const meals = latestDiet.meals as DietPlanMeals;
            
            // Generate diet checklist items from the diet plan
            const generatedDietItems: ChecklistItem[] = [];
            
            // Parse diet plan and create checklist items
            if (meals.earlyMorning?.name) {
              generatedDietItems.push({
                id: `early-morning-${Date.now()}`,
                text: `Early Morning: ${meals.earlyMorning.name}`,
                completed: false,
                trainee_id: effectiveTraineeId,
                created_at: new Date().toISOString(),
                is_diet_item: true,
                meal_type: 'early-morning'
              });
            }
            
            if (meals.breakfast?.name) {
              generatedDietItems.push({
                id: `breakfast-${Date.now()}`,
                text: `Breakfast: ${meals.breakfast.name}`,
                completed: false,
                trainee_id: effectiveTraineeId,
                created_at: new Date().toISOString(),
                is_diet_item: true,
                meal_type: 'breakfast'
              });
            }
            
            if (meals.snack1?.name) {
              generatedDietItems.push({
                id: `snack1-${Date.now()}`,
                text: `Mid-Morning Snack: ${meals.snack1.name}`,
                completed: false,
                trainee_id: effectiveTraineeId,
                created_at: new Date().toISOString(),
                is_diet_item: true,
                meal_type: 'snack'
              });
            }
            
            if (meals.lunch?.name) {
              generatedDietItems.push({
                id: `lunch-${Date.now()}`,
                text: `Lunch: ${meals.lunch.name}`,
                completed: false,
                trainee_id: effectiveTraineeId,
                created_at: new Date().toISOString(),
                is_diet_item: true,
                meal_type: 'lunch'
              });
            }
            
            if (meals.preWorkout?.name) {
              generatedDietItems.push({
                id: `pre-workout-${Date.now()}`,
                text: `Pre-Workout: ${meals.preWorkout.name}`,
                completed: false,
                trainee_id: effectiveTraineeId,
                created_at: new Date().toISOString(),
                is_diet_item: true,
                meal_type: 'pre-workout'
              });
            }
            
            if (meals.dinner?.name) {
              generatedDietItems.push({
                id: `dinner-${Date.now()}`,
                text: `Dinner: ${meals.dinner.name}`,
                completed: false,
                trainee_id: effectiveTraineeId,
                created_at: new Date().toISOString(),
                is_diet_item: true,
                meal_type: 'dinner'
              });
            }
            
            // Add water intake reminder
            generatedDietItems.push({
              id: `water-${Date.now()}`,
              text: 'Drink recommended daily water intake (8-10 glasses)',
              completed: false,
              trainee_id: effectiveTraineeId,
              created_at: new Date().toISOString(),
              is_diet_item: true,
              meal_type: 'hydration'
            });
            
            setDietItems(generatedDietItems);
            
            // Merge with existing checklist, prioritizing user-created items
            const allItems = [...(checklistData || []), ...generatedDietItems];
            setChecklist(allItems);
          } else {
            setChecklist(checklistData || []);
            setDietItems([]);
          }
        } else {
          setChecklist(checklistData || []);
          setDietItems([]);
        }
      } catch (error) {
        console.error('Error fetching checklist:', error);
        toast.error('Failed to load daily checklist');
      } finally {
        setLoading(false);
      }
    };
    
    fetchChecklistAndDiet();
  }, [effectiveTraineeId, today, isDemo]);

  const toggleItem = async (id: string, currentStatus: boolean) => {
    if (readOnly) return;
    
    if (isDemo) {
      // Demo mode - just update local state
      setChecklist(prev => 
        prev.map(item => 
          item.id === id ? { ...item, completed: !currentStatus } : item
        )
      );
      toast.success(!currentStatus ? 'Great job! Meal completed! 🎉' : 'Task marked as incomplete');
      return;
    }
    
    try {
      const { error } = await supabase
        .from('daily_checklist')
        .update({ completed: !currentStatus })
        .eq('id', id);
        
      if (error) throw error;
      
      setChecklist(prev => 
        prev.map(item => 
          item.id === id ? { ...item, completed: !currentStatus } : item
        )
      );
      
      const item = checklist.find(item => item.id === id);
      if (item?.is_diet_item) {
        toast.success(!currentStatus ? 'Great job! Meal completed! 🎉' : 'Meal marked as incomplete');
      } else {
        toast.success(!currentStatus ? 'Task completed! 🎉' : 'Task marked as incomplete');
      }
    } catch (error) {
      console.error('Error updating checklist item:', error);
      toast.error('Failed to update checklist item');
    }
  };

  const addItem = async () => {
    if (!newItemText.trim() || readOnly) return;
    
    if (isDemo) {
      const newItem = {
        id: String(Date.now()),
        text: newItemText.trim(),
        completed: false,
        trainee_id: 'demo',
        created_at: new Date().toISOString(),
        is_diet_item: false
      };
      setChecklist(prev => [...prev, newItem]);
      setNewItemText('');
      toast.success('Demo task added! (In real app, this saves to database)');
      return;
    }
    
    setSaving(true);
    
    try {
      const { data, error } = await supabase
        .from('daily_checklist')
        .insert({
          text: newItemText.trim(),
          completed: false,
          trainee_id: effectiveTraineeId,
          date: today,
          is_diet_item: false
        })
        .select()
        .single();
        
      if (error) throw error;
      
      setChecklist(prev => [...prev, data]);
      setNewItemText('');
      toast.success('New task added successfully!');
    } catch (error) {
      console.error('Error adding checklist item:', error);
      toast.error('Failed to add checklist item');
    } finally {
      setSaving(false);
    }
  };

  const deleteItem = async (id: string) => {
    if (readOnly) return;
    
    const item = checklist.find(item => item.id === id);
    if (item?.is_diet_item) {
      toast.error('Cannot delete diet plan items. These are generated from your assigned diet plan.');
      return;
    }
    
    if (isDemo) {
      setChecklist(prev => prev.filter(item => item.id !== id));
      toast.success('Demo task removed!');
      return;
    }
    
    try {
      const { error } = await supabase
        .from('daily_checklist')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      setChecklist(prev => prev.filter(item => item.id !== id));
      toast.success('Task removed successfully!');
    } catch (error) {
      console.error('Error deleting checklist item:', error);
      toast.error('Failed to delete checklist item');
    }
  };

  const completedCount = checklist.filter(item => item.completed).length;
  const totalCount = checklist.length;
  const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  // Separate diet items and custom items
  const dietOnlyItems = checklist.filter(item => item.is_diet_item);
  const customItems = checklist.filter(item => !item.is_diet_item);

  return (
    <Card className="w-full shadow-lg border-0 bg-white">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold text-red-600 flex items-center gap-2">
              <Apple className="h-6 w-6" />
              Daily Diet Checklist
            </CardTitle>
            <CardDescription className="text-gray-600">
              {isDemo 
                ? "Try out the diet tracking feature" 
                : readOnly 
                  ? "Trainee's diet progress for today" 
                  : "Track your daily meals and nutrition goals"}
            </CardDescription>
          </div>
          {totalCount > 0 && (
            <div className="text-right">
              <div className="text-2xl font-bold text-red-600">{completedCount}/{totalCount}</div>
              <div className="text-sm text-gray-500">completed</div>
            </div>
          )}
        </div>
        
        {totalCount > 0 && (
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-red-500 to-red-600 h-3 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              {Math.round(progressPercentage)}% of daily nutrition goals complete
            </p>
          </div>
        )}
      </CardHeader>
      
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-red-600" />
          </div>
        ) : (
          <div className="space-y-4">
            {/* Diet Plan Items */}
            {dietOnlyItems.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <Apple className="h-5 w-5 text-red-600" />
                  Today's Diet Plan
                </h3>
                <div className="space-y-3">
                  {dietOnlyItems.map(item => (
                    <div 
                      key={item.id} 
                      className={`flex items-center justify-between p-4 rounded-lg border transition-all duration-200 ${
                        item.completed 
                          ? 'bg-green-50 border-green-200' 
                          : 'bg-orange-50 border-orange-200 hover:bg-orange-100'
                      }`}
                    >
                      <div className="flex items-center space-x-4 flex-1">
                        <Checkbox 
                          id={`item-${item.id}`}
                          checked={item.completed}
                          onCheckedChange={() => toggleItem(item.id, item.completed)}
                          disabled={readOnly}
                          className={`w-5 h-5 ${item.completed ? "bg-red-600 border-red-600" : "border-orange-400"}`}
                        />
                        <label 
                          htmlFor={`item-${item.id}`}
                          className={`text-base cursor-pointer flex-1 ${
                            item.completed 
                              ? 'line-through text-gray-600 font-medium' 
                              : 'text-gray-800'
                          }`}
                        >
                          {item.text}
                        </label>
                        {item.meal_type && (
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            item.meal_type === 'breakfast' ? 'bg-yellow-100 text-yellow-800' :
                            item.meal_type === 'lunch' ? 'bg-orange-100 text-orange-800' :
                            item.meal_type === 'dinner' ? 'bg-purple-100 text-purple-800' :
                            item.meal_type === 'snack' ? 'bg-green-100 text-green-800' :
                            item.meal_type === 'pre-workout' ? 'bg-blue-100 text-blue-800' :
                            item.meal_type === 'early-morning' ? 'bg-pink-100 text-pink-800' :
                            'bg-cyan-100 text-cyan-800'
                          }`}>
                            {item.meal_type}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Custom Items */}
            {customItems.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-blue-600" />
                  Additional Tasks
                </h3>
                <div className="space-y-3">
                  {customItems.map(item => (
                    <div 
                      key={item.id} 
                      className={`flex items-center justify-between p-4 rounded-lg border transition-all duration-200 ${
                        item.completed 
                          ? 'bg-green-50 border-green-200' 
                          : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center space-x-4 flex-1">
                        <Checkbox 
                          id={`item-${item.id}`}
                          checked={item.completed}
                          onCheckedChange={() => toggleItem(item.id, item.completed)}
                          disabled={readOnly}
                          className={`w-5 h-5 ${item.completed ? "bg-red-600 border-red-600" : "border-gray-400"}`}
                        />
                        <label 
                          htmlFor={`item-${item.id}`}
                          className={`text-base cursor-pointer flex-1 ${
                            item.completed 
                              ? 'line-through text-gray-600 font-medium' 
                              : 'text-gray-800'
                          }`}
                        >
                          {item.text}
                        </label>
                      </div>
                      
                      {!readOnly && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => deleteItem(item.id)}
                          className="text-gray-400 hover:text-red-500 hover:bg-red-50 ml-2"
                        >
                          <Trash2 size={16} />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Empty State */}
            {checklist.length === 0 && (
              <div className="text-center py-8">
                <Apple className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-lg">
                  {isDemo 
                    ? "Demo diet checklist will appear here" 
                    : readOnly 
                      ? "No diet plan assigned yet" 
                      : "No diet plan found. Ask your trainer to create one for you!"}
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
      
      {!readOnly && (
        <CardFooter className="border-t pt-6">
          <div className="flex w-full space-x-2">
            <Input
              placeholder="Add additional nutrition task..."
              value={newItemText}
              onChange={(e) => setNewItemText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addItem();
                }
              }}
              className="flex-1 h-12 text-base"
            />
            <Button 
              onClick={addItem} 
              disabled={!newItemText.trim() || saving}
              className="bg-red-600 hover:bg-red-700 text-white px-6 h-12"
            >
              {saving ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : isMobile ? (
                <Plus size={20} />
              ) : (
                <>
                  <Plus size={20} className="mr-2" />
                  Add Task
                </>
              )}
            </Button>
          </div>
          
          {isDemo && (
            <p className="text-xs text-blue-600 mt-3 text-center w-full">
              This is a demo - your changes won't be saved. Sign up to track your real diet progress!
            </p>
          )}
        </CardFooter>
      )}
    </Card>
  );
};

export default DailyChecklist;
