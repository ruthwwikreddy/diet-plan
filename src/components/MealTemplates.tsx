
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type Meal = {
  name: string;
  quantity: string;
  protein: string;
  carbs: string;
  fats: string;
  calories: string;
};

type MealTemplatesProps = {
  onSelectTemplate: (meal: Meal, mealType: string) => void;
};

const MealTemplates: React.FC<MealTemplatesProps> = ({ onSelectTemplate }) => {
  const mealCategories = {
    breakfast: [
      { 
        name: "Apple-Cinnamon Oatmeal",
        quantity: "1 bowl",
        protein: "5g",
        carbs: "30g", 
        fats: "3g",
        calories: "170"
      },
      {
        name: "Greek Yogurt with Berries",
        quantity: "1 cup",
        protein: "15g",
        carbs: "12g",
        fats: "0g",
        calories: "110"
      },
      {
        name: "Protein Pancakes",
        quantity: "3 medium",
        protein: "25g",
        carbs: "30g",
        fats: "8g",
        calories: "290"
      },
      {
        name: "Egg White Omelet",
        quantity: "1 large",
        protein: "18g",
        carbs: "2g",
        fats: "5g",
        calories: "125"
      }
    ],
    lunch: [
      {
        name: "Grilled Chicken Salad",
        quantity: "1 plate",
        protein: "25g",
        carbs: "15g",
        fats: "8g",
        calories: "320"
      },
      {
        name: "Quinoa Bowl with Tofu",
        quantity: "1 bowl",
        protein: "15g",
        carbs: "40g",
        fats: "10g",
        calories: "310"
      },
      {
        name: "Tuna Wrap",
        quantity: "1 wrap",
        protein: "22g",
        carbs: "25g",
        fats: "6g",
        calories: "280"
      }
    ],
    dinner: [
      {
        name: "Baked Salmon with Vegetables",
        quantity: "150g + 100g",
        protein: "30g",
        carbs: "10g",
        fats: "15g",
        calories: "350"
      },
      {
        name: "Turkey Meatballs with Zucchini Noodles",
        quantity: "200g",
        protein: "28g",
        carbs: "8g",
        fats: "12g",
        calories: "320"
      },
      {
        name: "Chickpea and Vegetable Curry",
        quantity: "1 bowl",
        protein: "14g",
        carbs: "35g",
        fats: "8g",
        calories: "280"
      }
    ],
    snacks: [
      {
        name: "Protein Shake with Banana",
        quantity: "1 scoop + 1 medium",
        protein: "20g",
        carbs: "25g",
        fats: "1g",
        calories: "200"
      },
      {
        name: "Mixed Nuts",
        quantity: "30g",
        protein: "5g",
        carbs: "5g",
        fats: "15g",
        calories: "170"
      },
      {
        name: "Cottage Cheese with Berries",
        quantity: "100g + 50g",
        protein: "12g",
        carbs: "6g",
        fats: "2g",
        calories: "120"
      }
    ]
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg text-muscle-gray">Quick Meal Templates</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="breakfast" className="w-full">
          <TabsList className="mb-4 grid grid-cols-4 w-full">
            <TabsTrigger value="breakfast">Breakfast</TabsTrigger>
            <TabsTrigger value="lunch">Lunch</TabsTrigger>
            <TabsTrigger value="dinner">Dinner</TabsTrigger>
            <TabsTrigger value="snacks">Snacks</TabsTrigger>
          </TabsList>
          
          {Object.entries(mealCategories).map(([category, meals]) => (
            <TabsContent value={category} key={category} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {meals.map((meal, index) => (
                  <Card key={index} className="hover:shadow-md transition-all">
                    <CardContent className="pt-4">
                      <h3 className="font-bold">{meal.name}</h3>
                      <div className="text-sm text-gray-500 mt-1">
                        <p>Quantity: {meal.quantity}</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded">P: {meal.protein}</span>
                          <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded">C: {meal.carbs}</span>
                          <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded">F: {meal.fats}</span>
                          <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded">Cal: {meal.calories}</span>
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        className="mt-3 w-full"
                        onClick={() => {
                          const mealTypeMap: Record<string, string> = {
                            breakfast: 'breakfast',
                            lunch: 'lunch',
                            dinner: 'dinner',
                            snacks: category === 'snacks' ? 'snack1' : 'preWorkout'
                          };
                          onSelectTemplate(meal, mealTypeMap[category]);
                        }}
                      >
                        Apply Template
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default MealTemplates;
