
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type NutritionStatsProps = {
  totals: {
    protein: string;
    carbs: string;
    fats: string;
    calories: string;
  };
  trainerColors?: {
    primaryColor?: string;
    secondaryColor?: string;
  };
};

const NutritionStats: React.FC<NutritionStatsProps> = ({ totals, trainerColors }) => {
  const primaryColor = trainerColors?.primaryColor || '#E31B23';
  const secondaryColor = trainerColors?.secondaryColor || '#4D4D4D';

  // Parse nutrients to calculate progress
  const parseNutrient = (value: string) => {
    if (!value) return 0;
    const numericValue = parseFloat(value.replace(/[^\d.]/g, ''));
    return isNaN(numericValue) ? 0 : numericValue;
  };

  // Calculate macronutrient percentages from grams
  const calculateMacroPercentage = () => {
    const proteinGrams = parseNutrient(totals.protein);
    const carbsGrams = parseNutrient(totals.carbs);
    const fatsGrams = parseNutrient(totals.fats);
    
    const totalGrams = proteinGrams + carbsGrams + fatsGrams;
    
    if (totalGrams === 0) return { protein: 0, carbs: 0, fats: 0 };
    
    return {
      protein: Math.round((proteinGrams / totalGrams) * 100),
      carbs: Math.round((carbsGrams / totalGrams) * 100),
      fats: Math.round((fatsGrams / totalGrams) * 100)
    };
  };

  // Calculate calories from macros (more accurate)
  const calculateTotalCalories = () => {
    const proteinGrams = parseNutrient(totals.protein);
    const carbsGrams = parseNutrient(totals.carbs);
    const fatsGrams = parseNutrient(totals.fats);
    
    // Protein: 4 cal/g, Carbs: 4 cal/g, Fats: 9 cal/g
    return Math.round((proteinGrams * 4) + (carbsGrams * 4) + (fatsGrams * 9));
  };

  const macroPercentages = calculateMacroPercentage();
  const calculatedCalories = calculateTotalCalories();
  const displayCalories = calculatedCalories > 0 ? calculatedCalories : parseNutrient(totals.calories);
  const calorieGoal = 2000; // Example goal
  const caloriePercentage = Math.min(Math.round((displayCalories / calorieGoal) * 100), 100);

  // Format nutrition values properly
  const formatNutrientValue = (value: string, unit: string = 'g') => {
    const numValue = parseNutrient(value);
    return numValue > 0 ? `${numValue.toFixed(1)}${unit}` : '0g';
  };

  return (
    <Card className="w-full shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: primaryColor }}></div>
          <span style={{ color: secondaryColor }}>Nutritional Overview</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h3 className="text-sm font-medium" style={{ color: secondaryColor }}>Daily Calories</h3>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">{displayCalories} / {calorieGoal} kcal</span>
              <span className="text-sm font-semibold" style={{ color: primaryColor }}>{caloriePercentage}%</span>
            </div>
            <Progress 
              value={caloriePercentage} 
              className="h-3 bg-gray-100"
            />
          </div>
          
          <div className="space-y-3">
            <h3 className="text-sm font-medium" style={{ color: secondaryColor }}>Macronutrients</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Protein</span>
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  {formatNutrientValue(totals.protein)} ({macroPercentages.protein}%)
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Carbs</span>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  {formatNutrientValue(totals.carbs)} ({macroPercentages.carbs}%)
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Fats</span>
                <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                  {formatNutrientValue(totals.fats)} ({macroPercentages.fats}%)
                </Badge>
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-3">
          <h3 className="text-sm font-medium" style={{ color: secondaryColor }}>Macro Distribution</h3>
          <div className="flex gap-1 h-4 rounded-full overflow-hidden bg-gray-100">
            <div 
              className="bg-gradient-to-r from-blue-400 to-blue-500 transition-all duration-500" 
              style={{ width: `${macroPercentages.protein}%` }}
              title={`Protein: ${macroPercentages.protein}%`}
            ></div>
            <div 
              className="bg-gradient-to-r from-green-400 to-green-500 transition-all duration-500" 
              style={{ width: `${macroPercentages.carbs}%` }}
              title={`Carbs: ${macroPercentages.carbs}%`}
            ></div>
            <div 
              className="bg-gradient-to-r from-yellow-400 to-yellow-500 transition-all duration-500" 
              style={{ width: `${macroPercentages.fats}%` }}
              title={`Fats: ${macroPercentages.fats}%`}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              Protein
            </span>
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Carbs
            </span>
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              Fats
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NutritionStats;
