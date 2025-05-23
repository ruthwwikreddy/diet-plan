import React, { useState, useEffect, useRef } from 'react';
import DietPlanTemplate from './DietPlanTemplate';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { toast } from '@/components/ui/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { useSwipe } from '@/hooks/use-swipe';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const defaultDietPlan = {
  traineeName: 'John Doe',
  meals: {
    earlyMorning: { name: 'Empty stomach', quantity: '1 glass', protein: '0', carbs: '0', fats: '0', calories: '0' },
    breakfast: { name: 'Apple-Cinnamon Oatmeal', quantity: '1 bowl', protein: '8', carbs: '45', fats: '3', calories: '240' },
    snack1: { name: 'Greek Yogurt with Berries', quantity: '1 cup', protein: '15', carbs: '12', fats: '0', calories: '110' },
    lunch: { name: 'Grilled Chicken Salad', quantity: '1 plate', protein: '35', carbs: '20', fats: '10', calories: '310' },
    preWorkout: { name: 'Protein Shake with Banana', quantity: '1 shake', protein: '25', carbs: '30', fats: '2', calories: '240' },
    dinner: { name: 'Salmon with Quinoa', quantity: '1 plate', protein: '30', carbs: '25', fats: '12', calories: '330' },
  },
  totals: { protein: '113', carbs: '132', fats: '27', calories: '1230' },
};

const mealOrder = [
  { key: 'earlyMorning', label: 'Early Morning', description: 'Empty stomach' },
  { key: 'breakfast', label: 'Breakfast', description: 'First meal of the day' },
  { key: 'snack1', label: 'Snack 1', description: 'Mid-morning snack' },
  { key: 'lunch', label: 'Lunch', description: 'Midday meal' },
  { key: 'preWorkout', label: 'Pre-workout', description: 'Before exercise' },
  { key: 'dinner', label: 'Dinner', description: 'Evening meal' },
];

const EditableDietPlan: React.FC = () => {
  const [dietPlan, setDietPlan] = useState(defaultDietPlan);
  const [activeTab, setActiveTab] = useState('edit');
  const [showFullPreview, setShowFullPreview] = useState(false);
  const [traineeName, setTraineeName] = useState(defaultDietPlan.traineeName);
  const [isSaved, setIsSaved] = useState(false);
  const [activeMealIndex, setActiveMealIndex] = useState(0);
  const isMobile = useIsMobile();
  const mealCardRef = useRef<HTMLDivElement>(null);
  
  // Set up swipe handlers for mobile navigation
  useSwipe(mealCardRef, {
    onSwipeLeft: () => {
      if (activeMealIndex < mealOrder.length - 1) {
        setActiveMealIndex(activeMealIndex + 1);
      }
    },
    onSwipeRight: () => {
      if (activeMealIndex > 0) {
        setActiveMealIndex(activeMealIndex - 1);
      }
    }
  }, { threshold: 30 });
  
  // Auto-calculate totals whenever any nutritional value changes
  useEffect(() => {
    calculateTotals();
  }, [dietPlan.meals]);

  // Update trainee name in diet plan
  useEffect(() => {
    setDietPlan(prev => ({
      ...prev,
      traineeName
    }));
  }, [traineeName]);

  const handleInputChange = (mealType: string, field: string, value: string) => {
    setDietPlan(prev => {
      const updatedPlan = { ...prev };
      updatedPlan.meals[mealType][field] = value;
      return updatedPlan;
    });
    setIsSaved(false);
  };

  const calculateTotals = () => {
    setDietPlan(prev => {
      const updatedPlan = { ...prev };
      const fields = ['protein', 'carbs', 'fats', 'calories'];
      fields.forEach(field => {
        const total = mealOrder.reduce((sum, meal) => sum + (parseFloat(updatedPlan.meals[meal.key][field]) || 0), 0);
        updatedPlan.totals[field] = total.toFixed(0);
      });
      return updatedPlan;
    });
  };

  const handleSave = () => {
    calculateTotals();
    setIsSaved(true);
    toast({
      title: "Diet Plan Saved",
      description: "Your diet plan has been saved successfully.",
      duration: 3000,
    });
  };

  const handleReset = () => {
    setDietPlan(defaultDietPlan);
    setTraineeName(defaultDietPlan.traineeName);
    setIsSaved(false);
    toast({
      title: "Diet Plan Reset",
      description: "Your diet plan has been reset to default values.",
      duration: 3000,
    });
  };
  
  // Render a meal card for mobile view
  const renderMobileCard = (mealKey: string) => {
    const meal = mealOrder.find(m => m.key === mealKey);
    if (!meal) return null;
    
    return (
      <Card key={meal.key} className="border border-gray-200 shadow-sm">
        <CardHeader className="p-3 pb-0">
          <CardTitle className="text-base">{meal.label}</CardTitle>
          <CardDescription className="text-xs">{meal.description}</CardDescription>
        </CardHeader>
        <CardContent className="p-3 pt-0 space-y-2">
          <div>
            <Label htmlFor={`${meal.key}-name`} className="text-xs font-medium">Food Item</Label>
            <Input
              id={`${meal.key}-name`}
              value={meal.key === 'earlyMorning' ? 'Empty stomach' : dietPlan.meals[meal.key].name}
              onChange={(e) => handleInputChange(meal.key, 'name', e.target.value)}
              className="mt-1 text-sm"
              disabled={meal.key === 'earlyMorning'}
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor={`${meal.key}-quantity`} className="text-xs font-medium">Quantity</Label>
              <Input
                id={`${meal.key}-quantity`}
                value={dietPlan.meals[meal.key].quantity}
                onChange={(e) => handleInputChange(meal.key, 'quantity', e.target.value)}
                className="mt-1 text-sm"
              />
            </div>
            <div>
              <Label htmlFor={`${meal.key}-protein`} className="text-xs font-medium">Protein (g)</Label>
              <Input
                id={`${meal.key}-protein`}
                type="number"
                value={dietPlan.meals[meal.key].protein}
                onChange={(e) => handleInputChange(meal.key, 'protein', e.target.value)}
                className="mt-1 text-sm"
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <Label htmlFor={`${meal.key}-carbs`} className="text-xs font-medium">Carbs (g)</Label>
              <Input
                id={`${meal.key}-carbs`}
                type="number"
                value={dietPlan.meals[meal.key].carbs}
                onChange={(e) => handleInputChange(meal.key, 'carbs', e.target.value)}
                className="mt-1 text-sm"
              />
            </div>
            <div>
              <Label htmlFor={`${meal.key}-fats`} className="text-xs font-medium">Fats (g)</Label>
              <Input
                id={`${meal.key}-fats`}
                type="number"
                value={dietPlan.meals[meal.key].fats}
                onChange={(e) => handleInputChange(meal.key, 'fats', e.target.value)}
                className="mt-1 text-sm"
              />
            </div>
            <div>
              <Label htmlFor={`${meal.key}-calories`} className="text-xs font-medium">Calories</Label>
              <Input
                id={`${meal.key}-calories`}
                type="number"
                value={dietPlan.meals[meal.key].calories}
                onChange={(e) => handleInputChange(meal.key, 'calories', e.target.value)}
                className="mt-1 text-sm"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <Card className="w-full bg-white shadow-lg border-0 max-w-[100vw] overflow-hidden rounded-lg md:rounded-xl">
      <CardHeader className="bg-gradient-to-r from-muscle-red/90 to-muscle-red text-white p-4 md:p-6">
        <CardTitle className="text-xl md:text-2xl font-bold flex items-center justify-between">
          <span>Diet Plan Builder</span>
          <div className="flex gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm" className="bg-white/20 hover:bg-white/30 text-white border-white/30" onClick={handleReset}>
                    Reset
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Reset to default values</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm" className="bg-white/20 hover:bg-white/30 text-white border-white/30" onClick={handleSave}>
                    Save Plan
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Save your diet plan</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardTitle>
        <CardDescription className="text-white/80">
          Create a professional diet plan with live preview
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs defaultValue="edit" className="w-full" onValueChange={setActiveTab} value={activeTab}>
          <TabsList className="w-full rounded-none bg-gray-100 p-0 h-auto">
            <TabsTrigger value="edit" className="flex-1 py-3 data-[state=active]:bg-white rounded-none border-b-2 border-transparent data-[state=active]:border-muscle-red transition-all">
              Edit Diet Plan
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex-1 py-3 data-[state=active]:bg-white rounded-none border-b-2 border-transparent data-[state=active]:border-muscle-red transition-all">
              Preview
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="edit" className="p-6 focus-visible:outline-none focus-visible:ring-0">
            <div className="mb-4">
              <Label htmlFor="traineeName" className="text-sm font-medium">Trainee Name</Label>
              <Input 
                id="traineeName"
                value={traineeName}
                onChange={(e) => setTraineeName(e.target.value)}
                className="mt-1"
                placeholder="Enter trainee name"
              />
            </div>
            
            {isMobile ? (
              // Mobile card-based layout
              <div className="space-y-4 px-1" ref={mealCardRef}>
                <div className="flex justify-between items-center mb-2 px-1">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setActiveMealIndex(Math.max(0, activeMealIndex - 1))}
                    disabled={activeMealIndex === 0}
                    className="text-muscle-red hover:text-muscle-red/80 p-2"
                  >
                    <ChevronLeft size={20} />
                    <span className="sr-only">Previous</span>
                  </Button>
                  <span className="font-medium text-sm">
                    Meal {activeMealIndex + 1} of {mealOrder.length}
                  </span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setActiveMealIndex(Math.min(mealOrder.length - 1, activeMealIndex + 1))}
                    disabled={activeMealIndex === mealOrder.length - 1}
                    className="text-muscle-red hover:text-muscle-red/80 p-2"
                  >
                    <ChevronRight size={20} />
                    <span className="sr-only">Next</span>
                  </Button>
                </div>
                {renderMobileCard(mealOrder[activeMealIndex].key)}

                <Card className="border border-gray-200 bg-muscle-red/5 shadow-sm sticky bottom-0 mt-6">
                  <CardContent className="p-3">
                    <div className="flex justify-between items-center">
                      <h3 className="font-bold text-muscle-red">Daily Totals</h3>
                      <div className="grid grid-cols-2 gap-x-4 text-sm">
                        <div className="text-right">Protein: <span className="font-bold">{dietPlan.totals.protein}g</span></div>
                        <div className="text-right">Carbs: <span className="font-bold">{dietPlan.totals.carbs}g</span></div>
                        <div className="text-right">Fats: <span className="font-bold">{dietPlan.totals.fats}g</span></div>
                        <div className="text-right">Calories: <span className="font-bold">{dietPlan.totals.calories}</span></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              // Desktop table layout
              <div className="overflow-x-auto">
                <table className="w-full border-collapse min-w-[700px] md:min-w-0">
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
                  {mealOrder.map((meal, index) => (
                    <tr key={meal.key} className={`border-b border-gray-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-gray-50 transition-colors`}>
                      <td className="p-3">
                        <div className="font-medium text-gray-900">{meal.label}</div>
                        <div className="text-xs text-gray-500">{meal.description}</div>
                      </td>
                      <td className="p-3">
                        <Input
                          value={meal.key === 'earlyMorning' ? 'Empty stomach' : dietPlan.meals[meal.key].name}
                          onChange={(e) => handleInputChange(meal.key, 'name', e.target.value)}
                          className="border-gray-200 focus:border-muscle-red"
                          disabled={meal.key === 'earlyMorning'}
                        />
                      </td>
                      <td className="p-3">
                        <Input
                          value={dietPlan.meals[meal.key].quantity}
                          onChange={(e) => handleInputChange(meal.key, 'quantity', e.target.value)}
                          className="border-gray-200 focus:border-muscle-red text-center"
                        />
                      </td>
                      <td className="p-3">
                        <Input
                          type="number"
                          value={dietPlan.meals[meal.key].protein}
                          onChange={(e) => handleInputChange(meal.key, 'protein', e.target.value)}
                          className="border-gray-200 focus:border-muscle-red text-center"
                        />
                      </td>
                      <td className="p-3">
                        <Input
                          type="number"
                          value={dietPlan.meals[meal.key].carbs}
                          onChange={(e) => handleInputChange(meal.key, 'carbs', e.target.value)}
                          className="border-gray-200 focus:border-muscle-red text-center"
                        />
                      </td>
                      <td className="p-3">
                        <Input
                          type="number"
                          value={dietPlan.meals[meal.key].fats}
                          onChange={(e) => handleInputChange(meal.key, 'fats', e.target.value)}
                          className="border-gray-200 focus:border-muscle-red text-center"
                        />
                      </td>
                      <td className="p-3">
                        <Input
                          type="number"
                          value={dietPlan.meals[meal.key].calories}
                          onChange={(e) => handleInputChange(meal.key, 'calories', e.target.value)}
                          className="border-gray-200 focus:border-muscle-red text-center"
                        />
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-muscle-red/5 border-b border-muscle-red/20">
                    <td className="p-3 font-bold text-muscle-red" colSpan={2}>Daily Totals</td>
                    <td className="p-3"></td>
                    <td className="p-3 text-center font-bold">{dietPlan.totals.protein}g</td>
                    <td className="p-3 text-center font-bold">{dietPlan.totals.carbs}g</td>
                    <td className="p-3 text-center font-bold">{dietPlan.totals.fats}g</td>
                    <td className="p-3 text-center font-bold">{dietPlan.totals.calories} kcal</td>
                  </tr>
                </tbody>
                </table>
              </div>
            )}
            
            <div className="mt-6 flex justify-between items-center">
              <div className="text-sm text-gray-500 hidden md:block">
                {isSaved ? "✓ All changes saved" : "Unsaved changes"}
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setActiveTab('preview')} className="w-full md:w-auto">
                  Preview Plan
                </Button>
                <Dialog open={showFullPreview} onOpenChange={setShowFullPreview}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full md:w-auto">
                      {isMobile ? "Full Preview" : "Full Screen Preview"}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-[95vw] md:max-w-4xl h-[90vh] md:h-auto">
                    <DialogHeader>
                      <DialogTitle>Diet Plan Preview</DialogTitle>
                      <DialogDescription>
                        This is how your diet plan will look when printed or shared
                      </DialogDescription>
                    </DialogHeader>
                    <div className="max-h-[70vh] overflow-y-auto p-4 bg-gray-50 rounded">
                      <DietPlanTemplate initialDietPlan={dietPlan} />
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setShowFullPreview(false)}>Close</Button>
                      <Button onClick={handleSave}>Save Plan</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <Button onClick={handleSave} className="bg-muscle-red hover:bg-red-700 w-full md:w-auto">
                  {isMobile ? "Save" : "Save Plan"}
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="preview" className="p-0 focus-visible:outline-none focus-visible:ring-0">
            <div className="p-6 bg-gray-50">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
                <h3 className="text-lg font-semibold">Diet Plan Preview</h3>
                <Button variant="outline" onClick={() => setActiveTab('edit')} className="w-full md:w-auto">
                  Back to Edit
                </Button>
              </div>
              <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm">
                <DietPlanTemplate initialDietPlan={dietPlan} />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="bg-gray-50 border-t border-gray-200 p-4">
        <div className="flex flex-col md:flex-row justify-between items-center w-full gap-4">
          <div className="text-sm text-gray-500">
            <span className="font-medium">Total Calories:</span> {dietPlan.totals.calories} kcal
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <Button variant="outline" size="sm" onClick={handleReset} className="w-1/2 md:w-auto">
              Reset
            </Button>
            <Button size="sm" className="bg-muscle-red hover:bg-red-700 w-1/2 md:w-auto" onClick={handleSave}>
              {isMobile ? "Save" : "Save Plan"}
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default EditableDietPlan;
